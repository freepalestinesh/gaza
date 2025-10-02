export default async function healthRoutes(fastify, options) {
  fastify.get('/health', async (request, reply) => {
    try {
      // Check database connection
      await fastify.prisma.$queryRaw`SELECT 1`;
      return { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'gaza-api'
      };
    } catch (error) {
      reply.code(503);
      return { 
        status: 'error', 
        message: 'Database connection failed',
        timestamp: new Date().toISOString()
      };
    }
  });
}
