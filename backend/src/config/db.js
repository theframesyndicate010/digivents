require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const knex = require('knex');
const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;
const databaseClient = process.env.DATABASE_CLIENT || 'mysql';

let config;

const resolveMysqlConnection = () => {
  const hostFromEnv = process.env.DATABASE_HOST || 'localhost';
  const portFromEnv = parseInt(process.env.DATABASE_PORT || '3306', 10);
  const isRunningInDocker = fs.existsSync('/.dockerenv');

  let host = hostFromEnv;
  let port = portFromEnv;

  // When running app on host machine, Docker service DNS name `mysql` is not resolvable.
  if (!isRunningInDocker && hostFromEnv === 'mysql') {
    host = '127.0.0.1';
    if (portFromEnv === 3306) {
      port = parseInt(process.env.LOCAL_DATABASE_PORT || '3307', 10);
    }
  }

  return {
    host,
    port,
    database: process.env.DATABASE_NAME || 'digivents',
    user: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
};

// MySQL configuration (local or remote)
if (databaseClient === 'mysql') {
  const connectionConfig = databaseUrl ? {
    connectionString: databaseUrl,
  } : resolveMysqlConnection();

  config = {
    client: 'mysql2',
    connection: connectionConfig,
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
    },
    migrations: {
      extension: 'js'
    },
    debug: process.env.NODE_ENV === 'development',
  };
  const target = databaseUrl ? 'DATABASE_URL' : `${connectionConfig.host}:${connectionConfig.port}`;
  console.log(`[DB Config] Using MySQL connection (${target})`);
}
// Fallback to SQLite if no other configuration
else {
  const dbPath = path.resolve(__dirname, '../../', process.env.DATABASE_FILENAME || '.tmp/data.db');
  config = {
    client: 'sqlite3',
    connection: {
      filename: dbPath,
    },
    useNullAsDefault: true,
  };
  console.log(`[DB Config] Using SQLite at: ${dbPath}`);
}

const db = knex(config);

module.exports = db;
