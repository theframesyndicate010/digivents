module.exports = ({ env }) => {
  const isProduction = env('NODE_ENV') === 'production';
  const databaseUrl = env('DATABASE_URL');
  const useLocal = env('USE_LOCAL_DB') === 'true';
  const isRailway = env('RAILWAY_ENVIRONMENT_NAME');

  // Use local SQLite for local development only
  if (useLocal && !isRailway && env('NODE_ENV') === 'development') {
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

  // Railway PostgreSQL connection (preferred)
  if (databaseUrl) {
    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: databaseUrl,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          // Railway handles connection pooling well
          connectionTimeoutMillis: 60000,
          statement_timeout: 60000,
          query_timeout: 60000,
          acquireConnectionTimeout: 60000,
          schema: env('DATABASE_SCHEMA', 'public'),
        },
        pool: {
          min: isRailway ? 0 : 2, // Railway prefers 0 min connections
          max: isRailway ? 10 : 10,
          acquireTimeoutMillis: 60000,
          idleTimeoutMillis: 30000,
          reapIntervalMillis: 10000,
          createTimeoutMillis: 30000,
          destroyTimeoutMillis: 5000,
        },
        debug: false,
      },
    };
  }

  // Fallback configuration (should not be used on Railway)
  return {
    connection: {
      client: 'postgres',
      connection: {
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'digivents'),
        user: env('DATABASE_USERNAME', 'username'),
        password: env('DATABASE_PASSWORD', 'password'),
        ssl: isProduction ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 30000,
        statement_timeout: 30000,
        query_timeout: 30000,
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: {
        min: 0,
        max: 10,
        acquireTimeoutMillis: 60000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 10000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
      },
      debug: false,
    },
  };
};