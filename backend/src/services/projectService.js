const db = require('../config/db');
const crypto = require('crypto');

const normalizeProject = (row) => {
    if (!row) return null;
    let media = [];
    if (row.media) {
        media = typeof row.media === 'string' ? JSON.parse(row.media) : row.media;
    }
    
    return {
        id: row.id,
        name: row.name || '',
        description: row.description || '',
        tag: row.tag || '',
        media: media,
        // Keep both naming styles for template compatibility
        coverPhoto: row.cover_photo || '',
        cover_photo: row.cover_photo || '',
        contact: row.contact || '',
        youtubeLink: row.youtube_link || '',
        instagramLink: row.instagram_link || '',
        tiktokLink: row.tiktok_link || '',
        facebookLink: row.facebook_link || '',
        clientId: row.client_id || '',
        client: row.client || '',
        categoryId: row.category_id || '',
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
    const { name, description, tag, contact, youtubeLink, instagramLink, tiktokLink, facebookLink, client } = data;

    if (!name) {
        const error = new Error('Project name is required');
        error.statusCode = 400;
        error.isOperational = true;
        throw error;
    }

    const graphicsFiles = files?.graphics || [];
    const coverPhotoFile = files?.coverPhoto ? files.coverPhoto[0] : null;

    const media = graphicsFiles.map(file => `/uploads/projects/${file.filename}`);
    const coverPhoto = coverPhotoFile ? `/uploads/projects/${coverPhotoFile.filename}` : null;

    const payload = {
        id: crypto.randomUUID(),
        name,
        description: description || null,
        tag: tag || null,
        media: JSON.stringify(media),
        cover_photo: coverPhoto,
        contact: contact || null,
        youtube_link: youtubeLink || null,
        instagram_link: instagramLink || null,
        tiktok_link: tiktokLink || null,
        facebook_link: facebookLink || null,
        client: client || null,
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

    const { name, description, tag, contact, youtubeLink, instagramLink, tiktokLink, facebookLink, client, status } = data;
    const graphicsFiles = files?.graphics || [];
    const coverPhotoFile = files?.coverPhoto ? files.coverPhoto[0] : null;

    const payload = {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(tag !== undefined ? { tag } : {}),
        ...(contact !== undefined ? { contact } : {}),
        ...(youtubeLink !== undefined ? { youtube_link: youtubeLink || null } : {}),
        ...(instagramLink !== undefined ? { instagram_link: instagramLink || null } : {}),
        ...(tiktokLink !== undefined ? { tiktok_link: tiktokLink || null } : {}),
        ...(facebookLink !== undefined ? { facebook_link: facebookLink || null } : {}),
        ...(client !== undefined ? { client: client || null } : {}),
        ...(status !== undefined ? { status } : {}),
        updated_at: db.fn.now()
    };

    if (graphicsFiles.length) {
        payload.media = JSON.stringify(graphicsFiles.map((file) => `/uploads/projects/${file.filename}`));
    }
    if (coverPhotoFile) {
        payload.cover_photo = `/uploads/projects/${coverPhotoFile.filename}`;
    }

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
