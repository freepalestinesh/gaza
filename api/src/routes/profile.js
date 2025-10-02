import { verifyToken } from '../utils/auth.js';

export default async function profileRoutes(fastify, options) {
  // JWT authentication decorator
  fastify.decorate('authenticate', verifyToken);

  // Get user profile
  fastify.get('/', {
    onRequest: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const userId = request.user.userId;
      
      const profile = await fastify.prisma.profile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      });

      if (!profile) {
        reply.code(404);
        return { error: 'Profile not found' };
      }

      return profile;
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { error: 'Failed to fetch profile' };
    }
  });

  // Create profile
  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: {
      body: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string' },
          location: { type: 'string' },
          bio: { type: 'string' },
          needs: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = request.user.userId;
      const { firstName, lastName, phone, location, bio, needs } = request.body;

      // Check if profile already exists
      const existingProfile = await fastify.prisma.profile.findUnique({
        where: { userId }
      });

      if (existingProfile) {
        reply.code(409);
        return { error: 'Profile already exists' };
      }

      const profile = await fastify.prisma.profile.create({
        data: {
          userId,
          firstName,
          lastName,
          phone,
          location,
          bio,
          needs: needs || []
        }
      });

      return profile;
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { error: 'Failed to create profile' };
    }
  });

  // Update profile
  fastify.put('/', {
    onRequest: [fastify.authenticate],
    schema: {
      body: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string' },
          location: { type: 'string' },
          bio: { type: 'string' },
          needs: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = request.user.userId;
      const { firstName, lastName, phone, location, bio, needs } = request.body;

      const profile = await fastify.prisma.profile.update({
        where: { userId },
        data: {
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(phone !== undefined && { phone }),
          ...(location !== undefined && { location }),
          ...(bio !== undefined && { bio }),
          ...(needs !== undefined && { needs })
        }
      });

      return profile;
    } catch (error) {
      fastify.log.error(error);
      reply.code(500);
      return { error: 'Failed to update profile' };
    }
  });
}
