const path = require('path');

const getPostgresUrl = (env) => {
  const url = env('DATABASE_URL');
  if (!url || url.includes('<') || url.includes('>')) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'postgres:' && parsed.protocol !== 'postgresql:') return null;
    return url;
  } catch {
    return null;
  }
};

module.exports = ({ env }) => ({
  // Use postgres by default in production (Strapi Cloud), sqlite in local development.
  // DATABASE_CLIENT always has highest priority when explicitly provided.
  connection: {
    client: env(
      'DATABASE_CLIENT',
      getPostgresUrl(env) ? 'postgres' : env('NODE_ENV') === 'production' ? 'postgres' : 'sqlite'
    ),
    ...({
      mysql: {
        connection: {
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 3306),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          ssl: env.bool('DATABASE_SSL', false) && {
            key: env('DATABASE_SSL_KEY', undefined),
            cert: env('DATABASE_SSL_CERT', undefined),
            ca: env('DATABASE_SSL_CA', undefined),
            capath: env('DATABASE_SSL_CAPATH', undefined),
            cipher: env('DATABASE_SSL_CIPHER', undefined),
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
          },
        },
        pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
      },
      postgres: {
        connection: {
          ...(getPostgresUrl(env) ? { connectionString: getPostgresUrl(env) } : {}),
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          ssl: env.bool('DATABASE_SSL', false) && {
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
          },
          schema: env('DATABASE_SCHEMA', env('DATABASE_SHEMA', 'public')),
        },
        pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
      },
      sqlite: {
        connection: {
          filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
        },
        useNullAsDefault: true,
      },
    }[
      env(
        'DATABASE_CLIENT',
        getPostgresUrl(env) ? 'postgres' : env('NODE_ENV') === 'production' ? 'postgres' : 'sqlite'
      )
    ]),
  },
});
