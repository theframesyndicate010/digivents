const db = require('../config/db');

// Cache resolved table names so we don't call db.schema.hasTable() on every request
const cache = {};

/**
 * Resolve the first existing table from a list of candidates.
 * Result is cached after the first successful lookup.
 */
async function resolveTable(candidates) {
    const key = candidates.join('|');
    if (cache[key]) return cache[key];

    for (const name of candidates) {
        if (await db.schema.hasTable(name)) {
            cache[key] = name;
            return name;
        }
    }
    throw new Error(`None of these tables exist: ${candidates.join(', ')}`);
}

exports.getMessagesTable = () => resolveTable(['messages', 'contacts']);
exports.getCreatorsTable = () => resolveTable(['creators']);
