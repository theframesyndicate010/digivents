module.exports = ({ env }) => {
  const isProduction = env('NODE_ENV') === 'production';
  const databaseUrl = env('DATABASE_URL');
  const useLocal = env('USE_LOCAL_DB') === 'true';
  const isRailway = env('RAILWAY_ENVIRONMENT_NAME');
  const databaseClient = env('DATABASE_CLIENT', 'sqlite');

  // Use local SQLite for local development only when explicitly set
  if (useLocal && !isRailway && env('NODE_ENV') === 'development' && databaseClient === 'sqlite') {
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: env('DATABASE_FILENAME', '.tmp/data.db'),
        },
        useNullAsDefault: true,
      },
    };
  }

  // PostgreSQL connection (Railway or Supabase)
  if (databaseClient === 'postgres' || databaseUrl) {
    const connectionConfig = databaseUrl ? {
      connectionString: databaseUrl,
      ssl: env('DATABASE_SSL', 'true') === 'true' ? { rejectUnauthorized: false } : false,
    } : {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'postgres'),
      user: env('DATABASE_USERNAME', 'username'),
      password: env('DATABASE_PASSWORD', 'password'),
      ssl: env('DATABASE_SSL', 'true') === 'true' ? { rejectUnauthorized: false } : false,
    };

    return {
      connection: {
        client: 'postgres',
        connection: {
          ...connectionConfig,
          // Connection timeouts
          connectionTimeoutMillis: 60000,
          statement_timeout: 60000,
          query_timeout: 60000,
          acquireConnectionTimeout: 60000,
          schema: env('DATABASE_SCHEMA', 'public'),
        },
        pool: {
          min: isRailway ? 0 : 1, // Railway prefers 0 min connections
          max: isRailway ? 10 : 5, // Reduced max connections to prevent pool exhaustion
          acquireTimeoutMillis: 60000,
          idleTimeoutMillis: 30000,
          reapIntervalMillis: 10000,
          createTimeoutMillis: 30000,
          destroyTimeoutMillis: 5000,
          // Add these for better connection management
          propagateCreateError: false,
        },
        debug: env('NODE_ENV') === 'development' ? false : false,
      },
    };
  }

  // Fallback to SQLite if no other configuration
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
      },
      useNullAsDefault: true,
    },
  };
};