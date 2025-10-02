# Gaza Platform - Architecture Documentation

## System Overview

The Gaza Platform is a full-stack web application designed to facilitate donations and profile management for supporting Gaza. The system is built using a modern microservices architecture with the following main components:

## Components

### 1. API Server (Fastify + Prisma)
- **Technology Stack**: Node.js, Fastify, Prisma ORM, PostgreSQL
- **Responsibilities**:
  - RESTful API endpoints for all business logic
  - Database operations through Prisma ORM
  - JWT-based authentication and authorization
  - File upload handling
  - Email notifications
  - Payment processing integration

### 2. Frontend UI (Next.js)
- **Technology Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Responsibilities**:
  - Server-side rendering for optimal performance
  - Responsive user interface
  - Client-side state management
  - API communication
  - Form validation and handling

### 3. MCP Identity Server
- **Technology Stack**: Node.js, Fastify, JWT
- **Responsibilities**:
  - OAuth2/OpenID Connect identity provider
  - Centralized authentication
  - Token management
  - Single sign-on capabilities

### 4. Database (PostgreSQL)
- **Schema Management**: Prisma Migrations
- **Main Tables**:
  - Users: User accounts and authentication
  - Profiles: Extended user information
  - Donations: Donation transactions
  - Campaigns: Fundraising campaigns
  - VerificationRequests: Identity verification
  - RefreshTokens: JWT refresh tokens

## Architecture Patterns

### API Architecture
```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  API Gateway│
│  (Fastify)  │
└──────┬──────┘
       │
       ├──────────────┬──────────────┬──────────────┐
       ▼              ▼              ▼              ▼
┌───────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│   Auth    │  │  Users   │  │Donations │  │ Campaigns│
│  Service  │  │ Service  │  │ Service  │  │  Service │
└─────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
      │             │              │              │
      └─────────────┴──────────────┴──────────────┘
                              │
                              ▼
                      ┌──────────────┐
                      │   Database   │
                      │ (PostgreSQL) │
                      └──────────────┘
```

### Authentication Flow
```
┌──────┐                   ┌──────┐                   ┌──────┐
│Client│                   │ API  │                   │ MCP  │
└───┬──┘                   └───┬──┘                   └───┬──┘
    │                          │                          │
    │  1. Login Request        │                          │
    ├─────────────────────────>│                          │
    │                          │                          │
    │                          │  2. Verify Credentials   │
    │                          ├─────────────────────────>│
    │                          │                          │
    │                          │  3. Generate Tokens      │
    │                          │<─────────────────────────┤
    │                          │                          │
    │  4. Access + Refresh     │                          │
    │<─────────────────────────┤                          │
    │                          │                          │
    │  5. API Request (JWT)    │                          │
    ├─────────────────────────>│                          │
    │                          │                          │
    │  6. Response             │                          │
    │<─────────────────────────┤                          │
```

## Data Flow

### Donation Processing
1. User submits donation through UI
2. Frontend validates form data
3. API receives donation request
4. Payment provider processes transaction
5. Database records donation
6. Receipt email sent to user
7. Campaign totals updated
8. UI confirms successful donation

### Profile Verification
1. User uploads verification documents
2. Documents stored securely
3. Admin receives verification request
4. Admin reviews documents and profile
5. Admin approves or rejects verification
6. User notified of verification status
7. Profile status updated in database

## Security Considerations

### Authentication & Authorization
- JWT tokens for API authentication
- Role-based access control (RBAC)
- Refresh token rotation
- Password hashing with bcrypt
- Email verification required

### Data Protection
- HTTPS/TLS for all communications
- Environment variables for secrets
- SQL injection prevention (Prisma)
- XSS protection
- CSRF tokens for state-changing operations
- Rate limiting on API endpoints

### Payment Security
- PCI DSS compliance considerations
- Never store full credit card numbers
- Use payment provider tokenization
- Secure webhook handling
- Transaction logging and audit trails

## Scalability

### Horizontal Scaling
- Stateless API design
- Redis for session storage
- Database connection pooling
- Load balancer ready

### Vertical Scaling
- Database indexing strategies
- Query optimization with Prisma
- Caching frequently accessed data
- CDN for static assets

## Monitoring & Logging

### Application Logging
- Structured logging (JSON format)
- Log levels: error, warn, info, debug
- Request/response logging
- Error tracking and reporting

### Metrics
- API response times
- Database query performance
- Payment success rates
- User engagement metrics
- System resource utilization

## Deployment

### Development
- Docker Compose for local development
- Hot reload for rapid iteration
- Seed data for testing
- Mock payment providers

### Production
- Kubernetes orchestration (planned)
- CI/CD with GitHub Actions
- Blue-green deployment strategy
- Automated database migrations
- Health checks and auto-recovery

## Technology Justification

### Why Fastify?
- High performance (one of the fastest Node.js frameworks)
- Excellent TypeScript support
- Schema validation built-in
- Rich plugin ecosystem

### Why Prisma?
- Type-safe database queries
- Automatic migrations
- Excellent DX with schema introspection
- Multi-database support

### Why Next.js?
- Server-side rendering for SEO
- API routes for backend-for-frontend
- Automatic code splitting
- Optimized production builds
- Great developer experience

### Why PostgreSQL?
- ACID compliance
- JSON support for flexible data
- Robust transaction handling
- Excellent performance
- Wide community support

## Future Enhancements

1. **Real-time Features**: WebSocket support for live donation tracking
2. **Analytics Dashboard**: Comprehensive reporting for admins
3. **Mobile Apps**: Native iOS and Android applications
4. **Internationalization**: Multi-language support
5. **Advanced Search**: Elasticsearch integration
6. **Notification System**: Push notifications and SMS
7. **Social Features**: Donation sharing and social proof
8. **API Versioning**: Support for multiple API versions
