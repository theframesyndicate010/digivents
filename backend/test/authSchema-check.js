const assert = require('node:assert/strict');
const test = require('node:test');
const { ensureAuthSchema } = require('../src/config/authSchema');

test('creates the auth tables when a database volume has no auth schema', async () => {
    const tables = new Set();
    const db = {
        fn: { now: () => 'CURRENT_TIMESTAMP' },
        schema: {
            hasTable: async (name) => tables.has(name),
            createTable: async (name, define) => {
                const table = new Proxy({}, { get: () => () => table });
                define(table);
                tables.add(name);
            }
        }
    };

    await ensureAuthSchema(db);

    assert.deepEqual([...tables], ['users', 'sessions']);
});
