module.exports = ({ env }) => {
  const databaseClient = env('DATABASE_CLIENT', 'mysql');

  // MySQL connection (local or remote)
  if (databaseClient === 'mysql') {
    const connectionConfig = env('DATABASE_URL') ? {
      connectionString: env('DATABASE_URL'),
    } : {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', 'digivents'),
      user: env('DATABASE_USERNAME', 'root'),
      password: env('DATABASE_PASSWORD', ''),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    return {
      connection: {
        client: 'mysql2',
        connection: connectionConfig,
        pool: {
          min: 2,
          max: 10,
          acquireTimeoutMillis: 30000,
          idleTimeoutMillis: 30000,
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