const db = require('../config/db');
const crypto = require('crypto');
const { getTestimonialsTable } = require('../utils/tableResolver');

// Multer maps any URL containing "/testimonials" to the "images" subfolder.
const AVATAR_ROOT = 'uploads';
const AVATAR_SUBDIR = 'images';
const buildAvatarPath = (file) => `/${AVATAR_ROOT}/${AVATAR_SUBDIR}/${file.filename}`;

const normalizeTestimonial = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name || '',
        text: row.text || '',
        avatar: row.avatar || '',
        position: Number.isFinite(Number(row.position)) ? Number(row.position) : 0,
        is_active: Boolean(row.is_active),
        created_at: row.created_at,
        updated_at: row.updated_at
    };
};

// Pulls `text` from either `text` (backend/DB) or `testimonial`/`body`, which is
// what the React component historically called the field.
const pickText = ({ text, testimonial, body }) => text ?? testimonial ?? body;

// multipart/form-data always delivers strings, so an admin <select> posting
// "true"/"false" must be coerced before it reaches the TINYINT column.
const toBool = (value, fallback = true) => {
    if (value === undefined || value === null || value === '') return fallback;
    if (typeof value === 'boolean') return value;
    const s = String(value).toLowerCase();
    if (s === 'true' || s === '1' || s === 'yes' || s === 'on') return true;
    if (s === 'false' || s === '0' || s === 'no' || s === 'off') return false;
    return fallback;
};

exports.fetchAllTestimonials = async () => {
    const table = await getTestimonialsTable();
    const rows = await db(table)
        .select('*')
        .where({ is_active: true })
        .orderBy('position', 'asc')
        .orderBy('created_at', 'asc');
    return rows.map(normalizeTestimonial);
};

exports.fetchAllTestimonialsAdmin = async () => {
    const table = await getTestimonialsTable();
    const rows = await db(table)
        .select('*')
        .orderBy('position', 'asc')
        .orderBy('created_at', 'asc');
    return rows.map(normalizeTestimonial);
};

exports.getTestimonialById = async (id) => {
    const table = await getTestimonialsTable();
    const row = await db(table).where({ id }).first();
    if (!row) {
        const error = new Error('Testimonial not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    return normalizeTestimonial(row);
};

exports.createTestimonial = async (data, file) => {
    const { name, avatar, position, is_active, isActive } = data;
    const text = pickText(data);

    if (!name) {
        const error = new Error('Testimonial name is required');
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
    }
    if (!text) {
        const error = new Error('Testimonial text is required');
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
    }

    const table = await getTestimonialsTable();
    const payload = {
        id: crypto.randomUUID(),
        name,
        text,
        avatar: file ? buildAvatarPath(file) : (avatar || null),
        position: position !== undefined && position !== '' ? Number(position) || 0 : 0,
        is_active: toBool(is_active ?? isActive, true)
    };

    await db(table).insert(payload);
    return normalizeTestimonial(await db(table).where({ id: payload.id }).first());
};

exports.updateTestimonial = async (id, data, file) => {
    const table = await getTestimonialsTable();
    const existing = await db(table).where({ id }).first();
    if (!existing) {
        const error = new Error('Testimonial not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    const { name, avatar, position, is_active, isActive } = data;
    const text = pickText(data);

    const payload = {
        ...(name !== undefined ? { name } : {}),
        ...(text !== undefined ? { text } : {}),
        // An uploaded file always wins; otherwise honour an explicit `avatar`
        // (including "" to clear it). Omitting both keeps the stored photo.
        ...(file
            ? { avatar: buildAvatarPath(file) }
            : (avatar !== undefined ? { avatar: avatar || null } : {})),
        ...(position !== undefined ? { position: Number(position) || 0 } : {}),
        ...(is_active !== undefined || isActive !== undefined
            ? { is_active: toBool(is_active ?? isActive, true) }
            : {}),
        updated_at: db.fn.now()
    };

    await db(table).where({ id }).update(payload);
    return normalizeTestimonial(await db(table).where({ id }).first());
};

exports.deleteTestimonial = async (id) => {
    const table = await getTestimonialsTable();
    const count = await db(table).where({ id }).del();
    if (count === 0) {
        const error = new Error('Testimonial not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    return true;
};