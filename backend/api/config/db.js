require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const knex = require('knex');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;
const databaseClient = process.env.DATABASE_CLIENT || 'mysql';

let config;

// MySQL configuration (local or remote)
if (databaseClient === 'mysql') {
  const connectionConfig = databaseUrl ? {
    connectionString: databaseUrl,
  } : {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || 3306, 10),
    database: process.env.DATABASE_NAME || 'digivents',
    user: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

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
  console.log('[DB Config] Using MySQL connection');
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
