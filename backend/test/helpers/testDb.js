// Tests run against a real MySQL instance but a dedicated throwaway database,
// so the dev/production data is never touched.
//
// Must be required BEFORE ../src/config/db.
process.env.DATABASE_NAME = process.env.TEST_DATABASE_NAME || 'digivents_test';

const mysql = require('mysql2/promise');
const db = require('../../src/config/db');

const HOST = {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10)
};

// The app user is only granted on the main database, so provisioning the
// throwaway one needs a privileged account. Falls back to the app user.
const ADMIN = {
    ...HOST,
    user: process.env.MYSQL_ADMIN_USER || 'root',
    password: process.env.MYSQL_ADMIN_PASSWORD || 'rootpassword'
};

async function ensureDatabase() {
    for (const creds of [ADMIN, { ...HOST, user: process.env.DATABASE_USERNAME, password: process.env.DATABASE_PASSWORD }]) {
        let conn;
        try {
            conn = await mysql.createConnection(creds);
            await conn.query(
                `CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE_NAME}\` ` +
                'CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
            );
            // Make sure the app user can actually reach the test database.
            if (creds.user === ADMIN.user && process.env.DATABASE_USERNAME) {
                await conn.query(
                    `GRANT ALL PRIVILEGES ON \`${process.env.DATABASE_NAME}\`.* ` +
                    `TO '${process.env.DATABASE_USERNAME}'@'%'`
                );
                await conn.query('FLUSH PRIVILEGES');
            }
            await conn.end();
            return;
        } catch (error) {
            if (conn) await conn.end().catch(() => {});
            if (error.code !== 'ER_DBACCESS_DENIED_ERROR') throw error;
        }
    }
    throw new Error(
        `Unable to create test database "${process.env.DATABASE_NAME}". ` +
        'Set MYSQL_ADMIN_USER / MYSQL_ADMIN_PASSWORD, or create it manually.'
    );
}

async function reset() {
    await ensureDatabase();

    await db.raw('DROP TABLE IF EXISTS clients');
    await db.raw('DROP TABLE IF EXISTS testimonials');

    // Mirrors migrations/mysql/003_new_schema.sql
    await db.schema.createTable('clients', (t) => {
        t.string('id', 36).notNullable().primary();
        t.string('name', 255).notNullable();
        t.string('website', 500);
        t.string('instagram_link', 500);
        t.string('facebook_link', 500);
        t.string('tiktok_link', 500);
        t.string('logo', 500);
        t.timestamp('created_at').notNullable().defaultTo(db.fn.now());
        t.timestamp('updated_at').notNullable().defaultTo(db.fn.now());
    });

    await db.schema.createTable('testimonials', (t) => {
        t.string('id', 36).notNullable().primary();
        t.string('name', 255).notNullable();
        t.text('text').notNullable();
        t.string('avatar', 500);
        t.integer('position').notNullable().defaultTo(0);
        t.boolean('is_active').notNullable().defaultTo(true);
        t.timestamp('created_at').notNullable().defaultTo(db.fn.now());
        t.timestamp('updated_at').notNullable().defaultTo(db.fn.now());
    });
}

async function destroy() {
    await db.destroy();
}

module.exports = { db, reset, destroy };