const db = require('../config/db');
const crypto = require('crypto');

const normalizePost = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        title: row.title || '',
        description: row.description || '',
        cover_image: row.cover_image || '',
        video: row.video || '',
        status: row.status || 'active',
        created_at: row.created_at,
        updated_at: row.updated_at
    };
};

exports.fetchAllPosts = async () => {
    const posts = await db('posts').select('*').orderBy('created_at', 'desc');
    return posts.map(normalizePost);
};

exports.getPostById = async (id) => {
    const post = await db('posts').where({ id }).first();
    if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    return normalizePost(post);
};

exports.createPost = async (data, files) => {
    const { title, description, status } = data;

    if (!title) {
        const error = new Error('Post title is required');
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
    }

    const coverImageFile = files?.coverImage?.[0];
    const videoFile = files?.video?.[0];

    const payload = {
        id: crypto.randomUUID(),
        title,
        description: description || null,
        cover_image: coverImageFile ? `/uploads/graphics/${coverImageFile.filename}` : null,
        video: videoFile ? `/uploads/videos/${videoFile.filename}` : null,
        status: status || 'active'
    };

    await db('posts').insert(payload);
    const newPost = await db('posts').where({ id: payload.id }).first();
    return normalizePost(newPost);
};

exports.updatePost = async (id, data, files) => {
    const existing = await db('posts').where({ id }).first();
    if (!existing) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }

    const { title, description, status } = data;
    const coverImageFile = files?.coverImage?.[0];
    const videoFile = files?.video?.[0];

    const payload = {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(coverImageFile ? { cover_image: `/uploads/graphics/${coverImageFile.filename}` } : {}),
        ...(videoFile ? { video: `/uploads/videos/${videoFile.filename}` } : {}),
        updated_at: db.fn.now()
    };

    await db('posts').where({ id }).update(payload);
    const updatedPost = await db('posts').where({ id }).first();
    return normalizePost(updatedPost);
};

exports.deletePost = async (id) => {
    const count = await db('posts').where({ id }).del();
    if (count === 0) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    return true;
};
