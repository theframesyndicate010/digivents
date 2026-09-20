const ensureAuthSchema = async (db) => {
    if (!(await db.schema.hasTable('users'))) {
        await db.schema.createTable('users', (table) => {
            table.increments('id').primary();
            table.string('email', 255).notNullable().unique();
            table.string('password_hash', 255).notNullable();
            table.string('role', 50).notNullable().defaultTo('admin');
            table.timestamp('created_at').notNullable().defaultTo(db.fn.now());
            table.timestamp('updated_at').notNullable().defaultTo(db.fn.now());
        });
    }

    if (!(await db.schema.hasTable('sessions'))) {
        await db.schema.createTable('sessions', (table) => {
            table.increments('id').primary();
            table.integer('user_id').unsigned().notNullable()
                .references('id').inTable('users').onDelete('CASCADE');
            table.string('refresh_token_hash', 64).notNullable().unique();
            table.text('user_agent');
            table.string('ip_address', 255);
            table.dateTime('expires_at').notNullable();
            table.boolean('is_revoked').notNullable().defaultTo(false);
            table.dateTime('last_used_at');
            table.timestamp('created_at').notNullable().defaultTo(db.fn.now());
        });
    }
};

module.exports = { ensureAuthSchema };
