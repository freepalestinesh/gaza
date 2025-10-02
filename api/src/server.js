import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import healthRoutes from './routes/health.js';

dotenv.config();

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

// Register plugins
await fastify.register(helmet, { contentSecurityPolicy: false });
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
});
await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '15 minutes'
});
await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production'
});

// Decorate fastify with prisma
fastify.decorate('prisma', prisma);

// Register routes
await fastify.register(healthRoutes);
await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(profileRoutes, { prefix: '/api/profile' });

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach(signal => {
  process.on(signal, async () => {
    await prisma.$disconnect();
    await fastify.close();
    process.exit(0);
  });
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
