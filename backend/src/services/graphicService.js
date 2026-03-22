const db = require('../config/db');
const crypto = require('crypto');

const normalizeGraphic = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name || '',
        title: row.title || row.name || '',
        description: row.description || '',
        photo: row.photo || '',
        created_at: row.created_at,
        updated_at: row.updated_at
    };
};

exports.fetchAllGraphics = async () => {
    const graphics = await db('graphics').select('*').orderBy('created_at', 'desc');
    return graphics.map(normalizeGraphic);
};

exports.getGraphicById = async (id) => {
    const graphic = await db('graphics').where({ id }).first();
    if (!graphic) {
        const error = new Error('Graphic not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    return normalizeGraphic(graphic);
};

exports.createGraphic = async (data, file) => {
    const { name, title, description } = data;
    
    if (!name) {
        const error = new Error('Graphic name is required');
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
    }

    if (!file) {
        const error = new Error('Graphic photo is required');
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
    }

    const photo = `/uploads/graphics/${file}`;
    const payload = {
        id: crypto.randomUUID(),
        name,
        title: title || name,
        description: description || null,
        photo
    };

    await db('graphics').insert(payload);
    
    const newGraphic = await db('graphics').where({ id: payload.id }).first();
    return normalizeGraphic(newGraphic);
};

exports.updateGraphic = async (id, data, file) => {
    const existing = await db('graphics').where({ id }).first();
    if (!existing) {
        const error = new Error('Graphic not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    const { name, title, description } = data;
    const payload = {
        ...(name !== undefined ? { name } : {}),
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(file ? { photo: `/uploads/graphics/${file}` } : {}),
        updated_at: db.fn.now()
    };

    await db('graphics').where({ id }).update(payload);
    const updatedGraphic = await db('graphics').where({ id }).first();
    return normalizeGraphic(updatedGraphic);
};

exports.deleteGraphic = async (id) => {
    const count = await db('graphics').where({ id }).del();
    if (count === 0) {
        const error = new Error('Graphic not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    return true;
};
