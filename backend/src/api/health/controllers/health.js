module.exports = {
  async index(ctx) {
    try {
      // Basic health check
      const healthStatus = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
      };

      // Check database connection
      try {
        await strapi.db.connection.raw('SELECT 1');
        healthStatus.database = 'connected';
      } catch (error) {
        healthStatus.database = 'disconnected';
        healthStatus.status = 'degraded';
      }

      ctx.body = healthStatus;
      ctx.status = healthStatus.status === 'ok' ? 200 : 503;
    } catch (error) {
      ctx.body = {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
      ctx.status = 500;
    }
  },
};