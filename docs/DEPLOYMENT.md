# Deployment Guide

This guide covers deploying the Gaza Platform to various environments.

## Prerequisites

- Domain name configured
- SSL certificates
- Database server (PostgreSQL)
- Redis server (for sessions/caching)
- SMTP server (for emails)
- Payment provider account (Stripe, etc.)

## Environment Variables

Ensure all required environment variables are set in production:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/db

# API
API_PORT=3001
API_HOST=0.0.0.0
NODE_ENV=production

# JWT
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# MCP Identity Server
MCP_SERVER_PORT=3002
MCP_CLIENT_SECRET=<strong-random-secret>

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=<smtp-password>

# Payment
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Security
CORS_ORIGIN=https://yourdomain.com

# Redis
REDIS_URL=redis://redis-host:6379
```

## Docker Deployment

### Build Images

```bash
# Build all images
docker-compose -f docker-compose.prod.yml build

# Or build individually
docker build -t gaza-api:latest ./api
docker build -t gaza-ui:latest ./ui
docker build -t gaza-mcp-server:latest ./mcp-server
```

### Run Containers

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Database Migrations

```bash
docker-compose exec api npx prisma migrate deploy
```

## Manual Deployment

### API Server

1. **Install dependencies**
   ```bash
   cd api
   npm ci --production
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Run migrations**
   ```bash
   npx prisma migrate deploy
   ```

4. **Start server**
   ```bash
   npm start
   ```

   Or with PM2:
   ```bash
   pm2 start src/index.js --name gaza-api
   ```

### UI Server

1. **Install dependencies**
   ```bash
   cd ui
   npm ci --production
   ```

2. **Build application**
   ```bash
   npm run build
   ```

3. **Start server**
   ```bash
   npm start
   ```

   Or with PM2:
   ```bash
   pm2 start npm --name gaza-ui -- start
   ```

### MCP Server

1. **Install dependencies**
   ```bash
   cd mcp-server
   npm ci --production
   ```

2. **Start server**
   ```bash
   npm start
   ```

   Or with PM2:
   ```bash
   pm2 start src/index.js --name gaza-mcp-server
   ```

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster
- kubectl configured
- Docker registry

### Deploy to Kubernetes

1. **Create namespace**
   ```bash
   kubectl create namespace gaza-platform
   ```

2. **Create secrets**
   ```bash
   kubectl create secret generic gaza-secrets \
     --from-literal=database-url='postgresql://...' \
     --from-literal=jwt-secret='...' \
     -n gaza-platform
   ```

3. **Apply configurations**
   ```bash
   kubectl apply -f k8s/ -n gaza-platform
   ```

4. **Check deployment**
   ```bash
   kubectl get pods -n gaza-platform
   kubectl get services -n gaza-platform
   ```

## Cloud Provider Specific

### AWS

#### Using ECS

1. Push images to ECR
2. Create ECS task definitions
3. Create ECS services
4. Configure Application Load Balancer
5. Set up RDS for PostgreSQL
6. Configure ElastiCache for Redis

#### Using EKS

1. Create EKS cluster
2. Follow Kubernetes deployment steps
3. Use AWS Load Balancer Controller
4. Set up RDS and ElastiCache

### Google Cloud Platform

#### Using Cloud Run

1. Push images to Container Registry
2. Deploy each service to Cloud Run
3. Configure Cloud SQL
4. Set up Cloud Memorystore for Redis

### Azure

#### Using Azure Container Apps

1. Push images to Azure Container Registry
2. Create Container Apps
3. Configure Azure Database for PostgreSQL
4. Set up Azure Cache for Redis

## Reverse Proxy (Nginx)

```nginx
# /etc/nginx/sites-available/gaza-platform

upstream api {
    server localhost:3001;
}

upstream ui {
    server localhost:3000;
}

upstream mcp {
    server localhost:3002;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # UI
    location / {
        proxy_pass http://ui;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $host;
    }

    # MCP Identity Server
    location /auth {
        proxy_pass http://mcp;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

## SSL Certificates

### Using Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured by default
# Test renewal:
sudo certbot renew --dry-run
```

## Monitoring

### Application Monitoring
- Use PM2 monitoring dashboard
- Set up error tracking (Sentry, Rollbar)
- Configure log aggregation (ELK stack, Datadog)

### Server Monitoring
- CPU, memory, disk usage
- Network traffic
- Database connections
- Response times

### Health Checks

```bash
# API health
curl https://api.yourdomain.com/health

# UI health
curl https://yourdomain.com/

# MCP health
curl https://mcp.yourdomain.com/health
```

## Backup Strategy

### Database Backups

```bash
# Daily automated backup
pg_dump -h localhost -U user gaza_db | gzip > backup-$(date +%Y%m%d).sql.gz

# Restore from backup
gunzip -c backup-20240101.sql.gz | psql -h localhost -U user gaza_db
```

### File Backups
- User uploads
- Configuration files
- SSL certificates
- Environment files

## Rollback Procedure

1. **Identify issue**
2. **Stop current deployment**
3. **Deploy previous version**
4. **Rollback database if needed**
5. **Verify system is operational**
6. **Notify users if necessary**

## Security Checklist

- [ ] All environment variables secured
- [ ] SSL/TLS certificates valid
- [ ] Firewall configured
- [ ] Database access restricted
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Regular security updates
- [ ] Backup encryption enabled
- [ ] Monitoring and alerting configured

## Post-Deployment

1. **Run smoke tests**
2. **Check logs for errors**
3. **Monitor performance metrics**
4. **Verify all integrations working**
5. **Update status page**
6. **Notify team of successful deployment**

## Troubleshooting

### Common Issues

**Database connection failed**
- Check DATABASE_URL
- Verify database is running
- Check firewall rules

**API not responding**
- Check API logs
- Verify environment variables
- Check service status

**Build failures**
- Clear node_modules and reinstall
- Check Node.js version
- Verify all dependencies available

**SSL errors**
- Verify certificate validity
- Check certificate chain
- Update certificate if expired

## Support

For deployment issues:
1. Check documentation
2. Review logs
3. Contact DevOps team
4. Create issue in repository
