import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({ logger: true });

await fastify.register(jwt, {
  secret: process.env.MCP_CLIENT_SECRET || 'your-mcp-client-secret'
});

// Health check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', service: 'MCP Identity Server' };
});

// Token endpoint
fastify.post('/token', async (request, reply) => {
  // Placeholder for OAuth2 token endpoint
  return { message: 'Token endpoint - to be implemented' };
});

// Authorize endpoint
fastify.get('/authorize', async (request, reply) => {
  // Placeholder for OAuth2 authorization endpoint
  return { message: 'Authorize endpoint - to be implemented' };
});

// Userinfo endpoint
fastify.get('/userinfo', async (request, reply) => {
  // Placeholder for OpenID Connect userinfo endpoint
  return { message: 'Userinfo endpoint - to be implemented' };
});

const start = async () => {
  try {
    const port = parseInt(process.env.MCP_SERVER_PORT) || 3002;
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`MCP Identity Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
