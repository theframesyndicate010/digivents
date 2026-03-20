const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const MYSQL_DUPLICATE_TABLE = 1050;
const MYSQL_DUPLICATE_KEY = 1061;
const MYSQL_DUPLICATE_ENTRY = 1062;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const resolveBootstrapConnectionConfig = () => {
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
        user: process.env.DATABASE_USERNAME || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'digivents',
        connectTimeout: 10000,
        multipleStatements: false,
    };
};

const splitSqlStatements = (sqlText) => {
    return sqlText
        .split(';')
        .map((stmt) => stmt
            .split('\n')
            .filter((line) => !line.trim().startsWith('--'))
            .join('\n')
            .trim())
        .filter(Boolean);
};

const executeSqlFile = async (connection, filePath) => {
    const sqlText = fs.readFileSync(filePath, 'utf8');
    const statements = splitSqlStatements(sqlText);

    for (const statement of statements) {
        try {
            await connection.query(statement);
        } catch (error) {
            if (
                error &&
                [MYSQL_DUPLICATE_TABLE, MYSQL_DUPLICATE_KEY, MYSQL_DUPLICATE_ENTRY].includes(error.errno)
            ) {
                continue;
            }
            throw error;
        }
    }
};

const connectWithRetry = async () => {
    const maxAttempts = parseInt(process.env.DB_BOOTSTRAP_RETRIES || '10', 10);
    const delayMs = parseInt(process.env.DB_BOOTSTRAP_DELAY_MS || '2000', 10);
    const connectionConfig = resolveBootstrapConnectionConfig();

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            return await mysql.createConnection(connectionConfig);
        } catch (error) {
            if (attempt === maxAttempts) {
                throw error;
            }
            console.warn(`[DB Bootstrap] Connection attempt ${attempt}/${maxAttempts} failed, retrying...`);
            await sleep(delayMs);
        }
    }

    throw new Error('Unable to connect to database');
};

module.exports = async function bootstrapDatabase() {
    if ((process.env.DATABASE_CLIENT || 'mysql') !== 'mysql') {
        return;
    }

    const shouldBootstrap = process.env.DB_BOOTSTRAP !== 'false';
    if (!shouldBootstrap) {
        return;
    }
};
