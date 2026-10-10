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

    for (const tableName of ['projects', 'clients', 'creators', 'graphics', 'contacts', 'messages', 'posts']) {
        if (await db.schema.hasTable(tableName)) {
            const column = await db(tableName).columnInfo('id');
            if (String(column.type).toLowerCase().startsWith('int')) {
                await db.schema.alterTable(tableName, (table) => {
                    table.string('id', 36).notNullable().alter();
                });
            }
        }
    }
};

// Migration 003 (dynamic testimonials + client logo) is only replayed by
// docker-entrypoint-initdb.d on first volume creation. This bootstrap brings
// long-lived volumes up to the same shape at boot. Every check is guarded, so
// it is a no-op once the columns/table exist.
const ensureContentSchema = async (db) => {
    if (!(await db.schema.hasTable('testimonials'))) {
        await db.schema.createTable('testimonials', (table) => {
            table.string('id', 36).notNullable().primary();
            table.string('name', 255).notNullable();
            table.text('text').notNullable();
            table.string('avatar', 500);
            table.integer('position').notNullable().defaultTo(0);
            table.boolean('is_active').notNullable().defaultTo(true);
            table.timestamp('created_at').notNullable().defaultTo(db.fn.now());
            table.timestamp('updated_at').notNullable().defaultTo(db.fn.now());
        });
    }

    if (await db.schema.hasTable('clients') && !(await db.schema.hasColumn('clients', 'logo'))) {
        await db.schema.alterTable('clients', (table) => {
            table.string('logo', 500).nullable();
        });
    }
};

module.exports = { ensureAuthSchema, ensureContentSchema };
