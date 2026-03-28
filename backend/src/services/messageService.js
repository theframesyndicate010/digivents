const crypto = require('crypto');
const db = require('../config/db');
const { getMessagesTable } = require('../utils/tableResolver');

const normalizeMessage = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        first_name: row.first_name || '',
        last_name: row.last_name || '',
        name: row.name || `${row.first_name || ''} ${row.last_name || ''}`.trim(),
        email: row.email || '',
        subject: row.subject || '',
        message: row.message || '',
        status: row.status || 'new',
        created_at: row.created_at,
        updated_at: row.updated_at
    };
};

exports.fetchAllMessages = async ({ page = 1, perPage = 20, status, search }) => {
    const table = await getMessagesTable();
    const offset = (page - 1) * perPage;

    let query = db(table);

    if (status) {
        query = query.where({ status });
    }

    if (search) {
        query = query.where((qb) => {
            qb.where('name', 'like', `%${search}%`)
                .orWhere('first_name', 'like', `%${search}%`)
                .orWhere('last_name', 'like', `%${search}%`)
                .orWhere('email', 'like', `%${search}%`)
                .orWhere('subject', 'like', `%${search}%`)
                .orWhere('message', 'like', `%${search}%`);
        });
    }

    const totalResult = await query.clone().count('* as count').first();
    const total = parseInt(totalResult.count || 0, 10);

    const rows = await query
        .clone()
        .select('*')
        .orderBy('created_at', 'desc')
        .limit(perPage)
        .offset(offset);

    return {
        messages: rows.map(normalizeMessage),
        pagination: { page, perPage, total }
    };
};

exports.createMessage = async (data) => {
    const table = await getMessagesTable();
    const { first_name, last_name, name, email, subject, message, status } = data;

    if (!email || !message) {
        const error = new Error('Email and message are required');
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
    }

    const payload = {
        id: crypto.randomUUID(),
        first_name: first_name || null,
        last_name: last_name || null,
        name: name || null,
        email,
        subject: subject || null,
        message,
        status: status || 'new'
    };

    await db(table).insert(payload);
    
    // Fetch newly created row to ensure consistent return shape
    const newRow = await db(table).where({ id: payload.id }).first();
    return normalizeMessage(newRow);
};

exports.updateMessage = async (id, data) => {
    const table = await getMessagesTable();
    
    const existing = await db(table).where({ id }).first();
    if (!existing) {
        const error = new Error('Message not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    const { first_name, last_name, name, email, subject, message, status } = data;
    const payload = {
        ...(first_name !== undefined && { first_name }),
        ...(last_name !== undefined && { last_name }),
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(subject !== undefined && { subject }),
        ...(message !== undefined && { message }),
        ...(status !== undefined && { status }),
        updated_at: db.fn.now()
    };

    await db(table).where({ id }).update(payload);
    
    const updated = await db(table).where({ id }).first();
    return normalizeMessage(updated);
};

exports.deleteMessage = async (id) => {
    const table = await getMessagesTable();
    
    const count = await db(table).where({ id }).del();
    if (count === 0) {
        const error = new Error('Message not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    
    return true;
};
