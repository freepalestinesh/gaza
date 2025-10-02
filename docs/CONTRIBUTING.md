# Contributing to Gaza Platform

Thank you for your interest in contributing to the Gaza Platform! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and considerate in all interactions.

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git
- Docker (optional, for containerized development)

### Setup Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/gaza.git
   cd gaza
   ```

2. **Install dependencies for all components**
   ```bash
   cd api && npm install && cd ..
   cd ui && npm install && cd ..
   cd mcp-server && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Set up the database**
   ```bash
   cd api
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start development servers**
   ```bash
   # In separate terminals:
   cd api && npm run dev
   cd ui && npm run dev
   cd mcp-server && npm run dev
   ```

   Or use Docker Compose:
   ```bash
   docker-compose up
   ```

## Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Urgent production fixes

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments where necessary
   - Update documentation if needed

3. **Test your changes**
   ```bash
   # Run tests
   npm test
   
   # Run linter
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Coding Standards

### JavaScript/Node.js
- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use arrow functions where appropriate
- Use async/await over callbacks
- Handle errors properly
- Add JSDoc comments for functions

### React/Next.js
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for type safety
- Follow React best practices
- Use meaningful component and variable names

### Database
- Write efficient queries
- Use Prisma for database operations
- Add proper indexes
- Include migration descriptions
- Test migrations in development first

### API Design
- Follow RESTful conventions
- Use appropriate HTTP methods
- Return consistent response formats
- Include proper error handling
- Document all endpoints

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
- Aim for at least 80% code coverage
- Write tests for new features
- Update tests when modifying code

## Pull Request Process

1. **Update documentation**
   - Update README if needed
   - Update API docs for endpoint changes
   - Add comments to complex code

2. **Ensure tests pass**
   - All tests must pass
   - Linter must pass
   - Build must succeed

3. **Create pull request**
   - Use a clear, descriptive title
   - Describe what changes you made and why
   - Reference related issues
   - Add screenshots for UI changes

4. **Code review**
   - Address reviewer feedback
   - Make requested changes
   - Keep discussion professional and constructive

5. **Merge**
   - Squash commits if requested
   - Ensure branch is up to date with target branch

## Project Structure

```
gaza/
├── api/                 # Backend API
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── services/   # Business logic
│   │   ├── models/     # Data models
│   │   └── utils/      # Utility functions
│   └── prisma/         # Database schema
├── ui/                 # Frontend
│   └── src/
│       ├── app/        # Next.js pages
│       ├── components/ # React components
│       └── lib/        # Utilities
├── mcp-server/        # Identity server
├── docs/              # Documentation
└── .github/           # GitHub workflows
```

## Common Tasks

### Adding a New API Endpoint

1. Create route handler in `api/src/routes/`
2. Add business logic in `api/src/services/`
3. Update API documentation in `docs/API.md`
4. Add tests
5. Update OpenAPI spec if applicable

### Adding a New UI Component

1. Create component in `ui/src/components/`
2. Add PropTypes or TypeScript types
3. Create stories for Storybook (if applicable)
4. Add unit tests
5. Update component documentation

### Database Schema Changes

1. Update `api/prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name your_migration_name`
3. Update seed data if needed
4. Test migration thoroughly
5. Document schema changes

## Getting Help

- Check existing documentation
- Search for similar issues
- Ask questions in discussions
- Reach out to maintainers

## Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributors list

Thank you for contributing to the Gaza Platform! 🇵🇸
