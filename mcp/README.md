# MCP Agent Server

Model Context Protocol (MCP) agent server for the Gaza Humanitarian Platform.

## Overview

This MCP server provides automated tools for interacting with the Gaza API through a standardized protocol. It uses stdio transport for communication and can be integrated with various MCP clients.

## Features

- **stdio Transport**: Communication via standard input/output
- **Three Core Tools**:
  - `register_user`: Register new users
  - `init_profile`: Create or update user profiles
  - `donation_intent`: Express donation intent (stub)
- **Job Orchestrator**: Redis-backed job queue for async processing

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
API_URL=http://localhost:3001
REDIS_URL=redis://localhost:6379
```

## Running the MCP Server

### Stdio Mode (Default)

```bash
npm start
```

The server communicates via stdin/stdout using JSON-RPC 2.0 protocol.

### With API Running

Ensure the Gaza API is running at the configured URL:

```bash
cd ../api
npm start
```

## Available Tools

### 1. register_user

Register a new user in the humanitarian platform.

**Input Schema:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Example Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "register_user",
    "arguments": {
      "email": "user@example.com",
      "password": "securepass123"
    }
  },
  "id": 1
}
```

**Example Response:**
```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"success\":true,\"message\":\"User registered successfully\",\"userId\":\"...\",\"email\":\"user@example.com\",\"token\":\"jwt-token-here\"}"
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 1
}
```

### 2. init_profile

Initialize or update a user profile.

**Input Schema:**
```json
{
  "token": "jwt-token-here",
  "firstName": "Ahmed",
  "lastName": "Hassan",
  "phone": "+972-xxx-xxxx",
  "location": "Gaza",
  "bio": "Need medical supplies",
  "needs": ["medical", "food"]
}
```

**Example Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "init_profile",
    "arguments": {
      "token": "jwt-token-from-registration",
      "firstName": "Ahmed",
      "lastName": "Hassan",
      "location": "Gaza",
      "bio": "Need medical supplies and food"
    }
  },
  "id": 2
}
```

**Example Response:**
```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"success\":true,\"message\":\"Profile initialized/updated successfully\",\"profile\":{...}}"
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 2
}
```

### 3. donation_intent

Express intent to donate (stub for future payment integration).

**Input Schema:**
```json
{
  "amount": 100,
  "currency": "USD",
  "category": "medical"
}
```

**Example Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "donation_intent",
    "arguments": {
      "amount": 100,
      "currency": "USD",
      "category": "medical"
    }
  },
  "id": 3
}
```

**Example Response:**
```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"success\":true,\"message\":\"Donation intent recorded (stub)\",\"intent\":{\"amount\":100,\"currency\":\"USD\",\"category\":\"medical\",\"status\":\"pending\"}}"
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 3
}
```

## Job Orchestrator

The orchestrator manages async jobs using Redis as a queue backend.

### Running the Orchestrator

```bash
node src/orchestrator.js
```

### Supported Job Types

1. **send_notification**: Send notifications to users
2. **process_donation**: Process donation transactions

### Adding Jobs Programmatically

```javascript
import JobOrchestrator from './src/orchestrator.js';

const orchestrator = new JobOrchestrator();
await orchestrator.connect();

// Add a job
await orchestrator.addJob('send_notification', {
  userId: 'user-id',
  message: 'Your profile has been updated'
});

// Add another job
await orchestrator.addJob('process_donation', {
  amount: 100,
  currency: 'USD',
  userId: 'user-id'
});
```

## Testing

### List Available Tools

```bash
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node src/index.js
```

### Test Registration

```bash
echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"register_user","arguments":{"email":"test@example.com","password":"testpass123"}},"id":2}' | node src/index.js
```

### Run Test Script

```bash
./test-manual.sh
```

## Integration with MCP Clients

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "gaza-humanitarian": {
      "command": "node",
      "args": ["/path/to/gaza/mcp/src/index.js"]
    }
  }
}
```

### Custom Client

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

// Spawn the MCP server
const serverProcess = spawn('node', ['path/to/mcp/src/index.js']);

// Create transport
const transport = new StdioClientTransport({
  reader: serverProcess.stdout,
  writer: serverProcess.stdin
});

// Create client
const client = new Client({
  name: 'gaza-client',
  version: '1.0.0'
}, {
  capabilities: {}
});

// Connect
await client.connect(transport);

// List tools
const tools = await client.listTools();
console.log(tools);

// Call a tool
const result = await client.callTool({
  name: 'register_user',
  arguments: {
    email: 'user@example.com',
    password: 'password123'
  }
});
console.log(result);
```

## Error Handling

The MCP server handles errors gracefully and returns them in the response:

```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Error: User already exists"
      }
    ],
    "isError": true
  },
  "jsonrpc": "2.0",
  "id": 1
}
```

## Architecture

```
┌─────────────────┐
│   MCP Client    │
│  (Claude, etc)  │
└────────┬────────┘
         │ stdio (JSON-RPC)
         ▼
┌─────────────────┐
│   MCP Server    │
│  (this module)  │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐      ┌─────────────┐
│   Gaza API      │◄────►│  PostgreSQL │
└────────┬────────┘      └─────────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────┐
│  Orchestrator   │◄────►│    Redis    │
└─────────────────┘      └─────────────┘
```

## Development

### Adding New Tools

1. Add tool definition to `setupToolHandlers()`:

```javascript
{
  name: 'my_new_tool',
  description: 'Description of what it does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: { type: 'string', description: 'First parameter' }
    },
    required: ['param1']
  }
}
```

2. Add handler method:

```javascript
async handleMyNewTool(args) {
  const { param1 } = args;
  
  // Your logic here
  const result = await doSomething(param1);
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }
    ]
  };
}
```

3. Register in switch statement:

```javascript
case 'my_new_tool':
  return await this.handleMyNewTool(args);
```

### Adding Job Types

Edit `src/orchestrator.js` and add to the switch statement in `processJobs()`:

```javascript
case 'my_job_type':
  console.log(`Processing: ${job.payload.message}`);
  // Your job logic
  break;
```

## Deployment

### Docker

The MCP service is included in docker-compose:

```bash
docker-compose up -d mcp
```

### Standalone

```bash
npm start
```

Ensure the API_URL environment variable points to your API server.

## Security Considerations

1. **JWT Tokens**: Tokens should be kept secure and not logged
2. **API Access**: Ensure MCP server can only access authorized API endpoints
3. **Rate Limiting**: Consider implementing rate limits for tool calls
4. **Input Validation**: All inputs are validated against schemas
5. **Error Messages**: Avoid exposing sensitive information in errors

## Future Enhancements

- [ ] Authentication for MCP clients
- [ ] Tool usage logging and analytics
- [ ] Advanced job scheduling
- [ ] Webhook support
- [ ] Multi-tenant support
- [ ] Tool versioning
- [ ] Performance monitoring

## Support

For issues or questions:
1. Check the [TESTING.md](../TESTING.md) guide
2. Review the main [README.md](../README.md)
3. Open an issue on GitHub

## License

MIT
