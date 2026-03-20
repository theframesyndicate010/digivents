const db = require('../config/db');
const crypto = require('crypto');

const normalizeClient = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name || '',
        website: row.website || '',
        instagram_link: row.instagram_link || '',
        facebook_link: row.facebook_link || '',
        tiktok_link: row.tiktok_link || '',
        created_at: row.created_at,
        updated_at: row.updated_at
    };
};

exports.fetchAllClients = async () => {
    const clients = await db('clients').select('*').orderBy('created_at', 'desc');
    return clients.map(normalizeClient);
};

exports.getClientById = async (id) => {
    const client = await db('clients').where({ id }).first();
    if (!client) {
        const error = new Error('Client not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    return normalizeClient(client);
};

exports.createClient = async (data) => {
    // Support both camelCase (frontend) and snake_case (DB/service) fields
    const {
        name,
        website,
        instagram_link,
        facebook_link,
        tiktok_link,
        instagramLink,
        facebookLink,
        tiktokLink
    } = data;
    
    if (!name) {
        const error = new Error('Client name is required');
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
    }

    const payload = {
        id: crypto.randomUUID(),
        name,
        website: website || null,
        instagram_link: instagram_link ?? instagramLink ?? null,
        facebook_link: facebook_link ?? facebookLink ?? null,
        tiktok_link: tiktok_link ?? tiktokLink ?? null
    };

    await db('clients').insert(payload);
    
    const newClient = await db('clients').where({ id: payload.id }).first();
    return normalizeClient(newClient);
};

exports.updateClient = async (id, data) => {
    const existing = await db('clients').where({ id }).first();
    if (!existing) {
        const error = new Error('Client not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    const {
        name,
        website,
        instagram_link,
        facebook_link,
        tiktok_link,
        instagramLink,
        facebookLink,
        tiktokLink
    } = data;

    const payload = {
        ...(name !== undefined ? { name } : {}),
        ...(website !== undefined ? { website } : {}),
        ...(instagram_link !== undefined || instagramLink !== undefined
            ? { instagram_link: instagram_link ?? instagramLink ?? null }
            : {}),
        ...(facebook_link !== undefined || facebookLink !== undefined
            ? { facebook_link: facebook_link ?? facebookLink ?? null }
            : {}),
        ...(tiktok_link !== undefined || tiktokLink !== undefined
            ? { tiktok_link: tiktok_link ?? tiktokLink ?? null }
            : {}),
        updated_at: db.fn.now()
    };

    await db('clients').where({ id }).update(payload);
    const updatedClient = await db('clients').where({ id }).first();
    return normalizeClient(updatedClient);
};

exports.deleteClient = async (id) => {
    const count = await db('clients').where({ id }).del();
    if (count === 0) {
        const error = new Error('Client not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    return true;
};
