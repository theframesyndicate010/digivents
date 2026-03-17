module.exports = ({ env }) => {
  const isProduction = env('NODE_ENV') === 'production';
  const databaseUrl = env('DATABASE_URL');

  // Parse DATABASE_URL if provided (Railway format: postgresql://user:password@host:port/database)
  if (databaseUrl) {
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: databaseUrl,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          schema: env('DATABASE_SCHEMA', 'public'),
        },
        pool: {
          min: 2,
          max: 10,
          acquireTimeoutMillis: 30000,
          idleTimeoutMillis: 30000,
          reapIntervalMillis: 1000,
        },
      },
    };
  }

  // Fallback to individual environment variables
  return {
    connection: {
      client: 'postgres',
      connection: {
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'digivents'),
        user: env('DATABASE_USERNAME', 'username'),
        password: env('DATABASE_PASSWORD', 'password'),
        ssl: env.bool('DATABASE_SSL', isProduction),
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
      },
    },
  };
};