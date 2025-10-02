import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';

export default async function authRoutes(fastify, options) {
  // Register new user
  fastify.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 }
        }
      }
    }
  }, async (request, reply) => {
    const { email, password } = request.body;

    try {
      // Check if user already exists
      const existingUser = await fastify.prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        reply.code(409);
        return { error: 'User already exists' };
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = await fastify.prisma.user.create({
        data: {
          email,
          password: hashedPassword
        }
      });

      // Generate JWT token
      const token = generateToken(fastify, user.id);

      return {
        token,
        user: {
          id: user.id,
          email: user.email
        }
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { error: 'Failed to register user' };
    }
  });

  // Login
  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { email, password } = request.body;

    try {
      // Find user
      const user = await fastify.prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        reply.code(401);
        return { error: 'Invalid credentials' };
      }

      // Verify password
      const valid = await comparePassword(password, user.password);
      if (!valid) {
        reply.code(401);
        return { error: 'Invalid credentials' };
      }

      // Generate JWT token
      const token = generateToken(fastify, user.id);

      return {
        token,
        user: {
          id: user.id,
          email: user.email
        }
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { error: 'Failed to login' };
    }
  });

  // Verify token
  fastify.get('/verify', {
    onRequest: [fastify.authenticate]
  }, async (request, reply) => {
    return {
      userId: request.user.userId,
      valid: true
    };
  });
}
