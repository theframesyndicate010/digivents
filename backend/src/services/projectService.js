const db = require('../config/db');
const crypto = require('crypto');

const normalizeProject = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name || '',
        description: row.description || '',
        tag: row.tag || '',
        cover_photo: row.cover_photo || '',
        contact: row.contact || '',
        client: row.client || '',
        media: row.media ? (typeof row.media === 'string' ? JSON.parse(row.media) : row.media) : [],
        youtubeLink: row.youtube_link || '',
        instagramLink: row.instagram_link || '',
        tiktokLink: row.tiktok_link || '',
        facebookLink: row.facebook_link || '',
        status: row.status || 'active',
        created_at: row.created_at,
        updated_at: row.updated_at
    };
};

exports.fetchAllProjects = async () => {
    const projects = await db('projects').select('*').orderBy('created_at', 'desc');
    return projects.map(normalizeProject);
};

exports.getProjectById = async (id) => {
    const project = await db('projects').where({ id }).first();
    if (!project) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    return normalizeProject(project);
};

exports.createProject = async (data, files) => {
    const { name, description, tag, contact, client, youtubeLink, instagramLink, tiktokLink, facebookLink } = data;

    // Handle cover photo from uploaded files
    let coverPhotoPath = null;
    if (files && files.coverPhoto && files.coverPhoto[0]) {
        coverPhotoPath = files.coverPhoto[0]._publicPath || `/uploads/graphics/${files.coverPhoto[0].filename}`;
    }

    // Handle media/graphics from uploaded files
    let mediaArray = [];
    if (files && files.graphics) {
        mediaArray = files.graphics.map(f => f._publicPath || `/uploads/graphics/${f.filename}`);
    }

    const payload = {
        id: crypto.randomUUID(),
        name: name || 'Untitled Project',
        description: description || null,
        tag: tag || null,
        contact: contact || null,
        client: client || null,
        cover_photo: coverPhotoPath,
        media: JSON.stringify(mediaArray),
        youtube_link: youtubeLink || null,
        instagram_link: instagramLink || null,
        tiktok_link: tiktokLink || null,
        facebook_link: facebookLink || null,
        status: 'active'
    };
    await db('projects').insert(payload);
    const newProject = await db('projects').where({ id: payload.id }).first();
    return normalizeProject(newProject);
};

exports.updateProject = async (id, data, files) => {
    const existing = await db('projects').where({ id }).first();
    if (!existing) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    const { name, description, tag, contact, client, youtubeLink, instagramLink, tiktokLink, facebookLink, status } = data;

    // Handle cover photo from uploaded files
    let coverPhotoUpdate = {};
    if (files && files.coverPhoto && files.coverPhoto[0]) {
        coverPhotoUpdate = { cover_photo: files.coverPhoto[0]._publicPath || `/uploads/graphics/${files.coverPhoto[0].filename}` };
    }

    // Handle media/graphics from uploaded files
    let mediaUpdate = {};
    if (files && files.graphics && files.graphics.length) {
        const mediaArray = files.graphics.map(f => f._publicPath || `/uploads/graphics/${f.filename}`);
        mediaUpdate = { media: JSON.stringify(mediaArray) };
    }

    const payload = {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(tag !== undefined ? { tag } : {}),
        ...(contact !== undefined ? { contact } : {}),
        ...(client !== undefined ? { client } : {}),
        ...coverPhotoUpdate,
        ...mediaUpdate,
        ...(youtubeLink !== undefined ? { youtube_link: youtubeLink || null } : {}),
        ...(instagramLink !== undefined ? { instagram_link: instagramLink || null } : {}),
        ...(tiktokLink !== undefined ? { tiktok_link: tiktokLink || null } : {}),
        ...(facebookLink !== undefined ? { facebook_link: facebookLink || null } : {}),
        ...(status !== undefined ? { status } : {}),
        updated_at: db.fn.now()
    };
    await db('projects').where({ id }).update(payload);
    const updatedProject = await db('projects').where({ id }).first();
    return normalizeProject(updatedProject);
};

exports.deleteProject = async (id) => {
    const count = await db('projects').where({ id }).del();
    if (count === 0) {
        const error = new Error('Project not found');
        error.statusCode = 404;
        error.isOperational = true;
        throw error;
    }
    return true;
};
