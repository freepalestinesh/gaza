import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

// Register plugins
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production'
});

await fastify.register(rateLimit, {
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  timeWindow: process.env.RATE_LIMIT_WINDOW || '15 minutes'
});

await fastify.register(multipart, {
  limits: {
    fileSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 5242880
  }
});

// Decorate fastify with prisma client
fastify.decorate('prisma', prisma);

// Health check route
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// API routes (to be implemented)
fastify.get('/api', async (request, reply) => {
  return { 
    message: 'Gaza Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      donations: '/api/donations',
      campaigns: '/api/campaigns',
      admin: '/api/admin'
    }
  };
});

// Graceful shutdown
const closeGracefully = async (signal) => {
  fastify.log.info(`Received ${signal}, closing application gracefully`);
  await prisma.$disconnect();
  await fastify.close();
  process.exit(0);
};

process.on('SIGTERM', () => closeGracefully('SIGTERM'));
process.on('SIGINT', () => closeGracefully('SIGINT'));

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.API_PORT) || 3001;
    const host = process.env.API_HOST || 'localhost';
    
    await fastify.listen({ port, host });
    fastify.log.info(`Server listening on ${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
