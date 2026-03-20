const db = require('../config/db');
const crypto = require('crypto');

const normalizeCreator = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name || '',
        photo: row.photo || '',
        role: row.role || '',
        description: row.description || '',
        created_at: row.created_at,
        updated_at: row.updated_at
    };
};

exports.fetchAllCreators = async () => {
    // If you need legacy support for other environments
    let table = 'creators';
    const hasCreators = await db.schema.hasTable('creators');
    if (!hasCreators) throw new Error('Creators table not found');

    const creators = await db(table).select('*').orderBy('created_at', 'desc');
    return creators.map(normalizeCreator);
};

exports.getCreatorById = async (id) => {
    const creator = await db('creators').where({ id }).first();
    if (!creator) {
        const error = new Error('Creator not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    return normalizeCreator(creator);
};

exports.createCreator = async (data, file) => {
    const { name, role, description } = data;
    
    if (!name) {
        const error = new Error('Creator name is required');
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
    }

    const photo = file ? `/uploads/creators/${file.filename}` : null;
    const payload = {
        id: crypto.randomUUID(),
        name,
        role: role || null,
        description: description || null,
        photo
    };

    await db('creators').insert(payload);
    
    const newCreator = await db('creators').where({ id: payload.id }).first();
    return normalizeCreator(newCreator);
};

exports.updateCreator = async (id, data, file) => {
    const existing = await db('creators').where({ id }).first();
    if (!existing) {
        const error = new Error('Creator not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    const { name, role, description } = data;
    const payload = {
        ...(name !== undefined ? { name } : {}),
        ...(role !== undefined ? { role } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(file ? { photo: `/uploads/creators/${file.filename}` } : {}),
        updated_at: db.fn.now()
    };

    await db('creators').where({ id }).update(payload);
    const updatedCreator = await db('creators').where({ id }).first();
    return normalizeCreator(updatedCreator);
};

exports.deleteCreator = async (id) => {
    const count = await db('creators').where({ id }).del();
    if (count === 0) {
        const error = new Error('Creator not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    return true;
};
