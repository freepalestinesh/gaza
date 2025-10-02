# Testing Guide

This document provides instructions for testing the Gaza Humanitarian Platform.

## Prerequisites

- Node.js 20+
- PostgreSQL (or Docker)
- Redis (optional, for orchestrator)

## Quick Start - Docker Compose Testing

The easiest way to test the entire platform:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Run manual tests (after services are up)
cd api && ./test-manual.sh
cd ../mcp && ./test-manual.sh

# Stop services
docker-compose down
```

## API Testing

### Automated Tests

```bash
cd api
npm test
```

These are basic structure tests. For full integration tests, run the manual test script.

### Manual API Testing

1. **Start PostgreSQL:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Setup database:**
   ```bash
   cd api
   cp .env.example .env
   # Edit .env with your database URL
   npx prisma migrate deploy
   npx prisma generate
   ```

3. **Start the API:**
   ```bash
   npm start
   ```

4. **Run manual tests:**
   ```bash
   ./test-manual.sh
   ```

### Testing Individual Endpoints

**Health Check:**
```bash
curl http://localhost:3001/health
```

**Register User:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Get Profile (with token):**
```bash
curl http://localhost:3001/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create Profile:**
```bash
curl -X POST http://localhost:3001/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"firstName":"Ahmed","lastName":"Hassan","location":"Gaza"}'
```

**Update Profile:**
```bash
curl -X PUT http://localhost:3001/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"bio":"Updated bio","needs":["food","medical"]}'
```

## Web UI Testing

### Build and Lint

```bash
cd web
npm install
npm run lint
npm run build
```

### Local Development

```bash
cd web
npm run dev
```

Visit http://localhost:3000 to test:
- Landing page
- Registration flow
- Login flow
- Profile creation/editing
- Dark mode toggle
- Navigation

### Static Export Testing

```bash
cd web
npm run build
# Serve the out directory
python3 -m http.server 8080 --directory out
```

Visit http://localhost:8080 to test the static build.

## MCP Agent Testing

### List Available Tools

```bash
cd mcp
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node src/index.js
```

### Test Register User Tool

```bash
echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"register_user","arguments":{"email":"mcp@example.com","password":"mcp123"}},"id":2}' | node src/index.js
```

**Note:** API must be running for this to work.

### Test Donation Intent Tool (Stub)

```bash
echo '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"donation_intent","arguments":{"amount":100,"currency":"USD","category":"medical"}},"id":3}' | node src/index.js
```

### Test Orchestrator

```bash
cd mcp
node src/orchestrator.js
```

This starts the job queue processor. In another terminal, you can add jobs programmatically or through the MCP tools.

## Integration Testing

### Full Stack Test

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Register a user via web UI:**
   - Open http://localhost:3000
   - Click "Register"
   - Fill in email and password
   - Submit

3. **Create profile:**
   - After registration, you're redirected to profile page
   - Fill in profile details
   - Save

4. **Test via API:**
   ```bash
   # Login to get token
   TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com","password":"your-password"}' | \
     grep -o '"token":"[^"]*' | cut -d'"' -f4)
   
   # Get profile
   curl http://localhost:3001/api/profile \
     -H "Authorization: Bearer $TOKEN"
   ```

5. **Test via MCP:**
   ```bash
   echo "{\"jsonrpc\":\"2.0\",\"method\":\"tools/call\",\"params\":{\"name\":\"init_profile\",\"arguments\":{\"token\":\"$TOKEN\",\"firstName\":\"MCP\",\"lastName\":\"Test\"}},\"id\":4}" | \
     node mcp/src/index.js
   ```

## CI/CD Testing

The GitHub Actions workflows will automatically:
1. Build and test the API
2. Build and lint the web UI
3. Validate the MCP server
4. Deploy to GitHub Pages (on main branch)
5. Build Docker images (on main branch)

To test workflows locally, use [act](https://github.com/nektos/act):

```bash
# Test build workflow
act push -W .github/workflows/build-test.yml
```

## Performance Testing

For load testing the API:

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test health endpoint
ab -n 1000 -c 10 http://localhost:3001/health
```

## Database Management

**View data with Prisma Studio:**
```bash
cd api
npx prisma studio
```

**Reset database (development only):**
```bash
cd api
npx prisma migrate reset
```

**Create new migration:**
```bash
cd api
npx prisma migrate dev --name migration_name
```

## Troubleshooting

### API won't start
- Check PostgreSQL is running: `docker-compose ps postgres`
- Check DATABASE_URL in .env
- Check logs: `docker-compose logs api`

### Web UI build fails
- Check for lint errors: `npm run lint`
- Clear build cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### MCP server not responding
- Check if API is accessible
- Test with curl: `curl http://localhost:3001/health`
- Check stdin/stdout formatting of JSON requests

### Docker Compose issues
- Check logs: `docker-compose logs`
- Rebuild images: `docker-compose build --no-cache`
- Clean volumes: `docker-compose down -v`

## Test Coverage

Current test coverage includes:
- ✅ API structure tests (automated)
- ✅ Manual API integration tests (script provided)
- ✅ Web UI lint and build verification
- ✅ MCP tool listing and basic functionality
- ✅ Docker Compose orchestration
- ⚠️ E2E tests (not implemented - future enhancement)
- ⚠️ Load tests (not implemented - future enhancement)
- ⚠️ Security tests (basic - consider adding penetration testing)

## Next Steps

For production deployment:
1. Set up proper monitoring (e.g., Prometheus, Grafana)
2. Implement comprehensive logging (e.g., Winston, ELK stack)
3. Add E2E tests (e.g., Playwright, Cypress)
4. Set up staging environment
5. Implement backup and disaster recovery
6. Add security scanning (e.g., Snyk, OWASP ZAP)
