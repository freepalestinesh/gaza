#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3001';

// MCP Server for Gaza Humanitarian Platform
class GazaMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'gaza-humanitarian-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'register_user',
          description: 'Register a new user in the humanitarian platform',
          inputSchema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                description: 'User email address',
              },
              password: {
                type: 'string',
                description: 'User password (minimum 6 characters)',
              },
            },
            required: ['email', 'password'],
          },
        },
        {
          name: 'init_profile',
          description: 'Initialize or update user profile',
          inputSchema: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
                description: 'JWT authentication token',
              },
              firstName: {
                type: 'string',
                description: 'First name',
              },
              lastName: {
                type: 'string',
                description: 'Last name',
              },
              phone: {
                type: 'string',
                description: 'Phone number',
              },
              location: {
                type: 'string',
                description: 'Location/address',
              },
              bio: {
                type: 'string',
                description: 'Biography or description',
              },
              needs: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of needs or requirements',
              },
            },
            required: ['token'],
          },
        },
        {
          name: 'donation_intent',
          description: 'Express intent to donate (stub for future implementation)',
          inputSchema: {
            type: 'object',
            properties: {
              amount: {
                type: 'number',
                description: 'Donation amount',
              },
              currency: {
                type: 'string',
                description: 'Currency code (e.g., USD, EUR)',
              },
              category: {
                type: 'string',
                description: 'Donation category (medical, food, shelter, etc.)',
              },
            },
            required: ['amount', 'currency'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'register_user':
            return await this.handleRegisterUser(args);
          case 'init_profile':
            return await this.handleInitProfile(args);
          case 'donation_intent':
            return await this.handleDonationIntent(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async handleRegisterUser(args) {
    const { email, password } = args;

    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'User registered successfully',
            userId: data.user.id,
            email: data.user.email,
            token: data.token,
          }, null, 2),
        },
      ],
    };
  }

  async handleInitProfile(args) {
    const { token, ...profileData } = args;

    // Try to create profile first
    let response = await fetch(`${API_URL}/api/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    // If profile exists, update it
    if (response.status === 409) {
      response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Profile operation failed');
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'Profile initialized/updated successfully',
            profile: data,
          }, null, 2),
        },
      ],
    };
  }

  async handleDonationIntent(args) {
    const { amount, currency, category } = args;

    // This is a stub - in production, this would interact with payment systems
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: 'Donation intent recorded (stub)',
            intent: {
              amount,
              currency,
              category: category || 'general',
              status: 'pending',
              note: 'Payment processing not yet implemented. This is a placeholder for future integration.',
            },
          }, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Gaza MCP server running on stdio');
  }
}

// Start the server
const server = new GazaMCPServer();
server.run().catch(console.error);
