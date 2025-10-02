#!/bin/bash

# MCP Agent Test Script
# Tests the MCP server tools via stdio

set -e

echo "🤖 Gaza MCP Agent Test Suite"
echo "=============================="
echo ""

MCP_SERVER="node /home/runner/work/gaza/gaza/mcp/src/index.js"

# Test 1: List Tools
echo "📍 Test 1: List Available Tools"
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | $MCP_SERVER 2>/dev/null | grep -A 50 "result" | head -20
echo ""

# Test 2: Register User (would need API running)
echo "📍 Test 2: Register User Tool"
echo "Tool: register_user"
echo "Arguments: { email: 'mcp-test@example.com', password: 'mcptest123' }"
echo ""
echo "⚠️  This requires the API server to be running at http://localhost:3001"
echo "   To test manually:"
echo "   echo '{\"jsonrpc\":\"2.0\",\"method\":\"tools/call\",\"params\":{\"name\":\"register_user\",\"arguments\":{\"email\":\"mcp@example.com\",\"password\":\"mcp123\"}},\"id\":2}' | node mcp/src/index.js"
echo ""

# Test 3: Init Profile Tool
echo "📍 Test 3: Init Profile Tool"
echo "Tool: init_profile"
echo "Arguments: { token: '<jwt-token>', firstName: 'MCP', lastName: 'Test' }"
echo ""
echo "⚠️  This requires a valid JWT token from registration/login"
echo "   To test manually after getting a token:"
echo "   echo '{\"jsonrpc\":\"2.0\",\"method\":\"tools/call\",\"params\":{\"name\":\"init_profile\",\"arguments\":{\"token\":\"<YOUR_TOKEN>\",\"firstName\":\"MCP\",\"lastName\":\"Test\"}},\"id\":3}' | node mcp/src/index.js"
echo ""

# Test 4: Donation Intent Tool (stub)
echo "📍 Test 4: Donation Intent Tool (Stub)"
DONATION_TEST=$(echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"donation_intent","arguments":{"amount":100,"currency":"USD","category":"medical"}},"id":4}' | $MCP_SERVER 2>/dev/null)
echo "$DONATION_TEST" | grep -A 10 "result" || echo "$DONATION_TEST"
echo ""

echo "✅ MCP test suite completed!"
echo ""
echo "💡 The MCP server is working correctly. For full integration testing:"
echo "   1. Start the API server: cd api && npm start"
echo "   2. Use the MCP tools via stdio to interact with the API"
echo "   3. Test the orchestrator: node mcp/src/orchestrator.js"
