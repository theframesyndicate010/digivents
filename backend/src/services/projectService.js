const db = require('../config/db');
const crypto = require('crypto');

const normalizeProject = (row) => {
    if (!row) return null;
    return {
        id: row.id,
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
    const { youtubeLink, instagramLink, tiktokLink, facebookLink } = data;
    
    const payload = {
        id: crypto.randomUUID(),
        name: 'Untitled Project', // satisfies the NOT NULL database requirement to fix the 500 error
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
    const { youtubeLink, instagramLink, tiktokLink, facebookLink, status } = data;

    const payload = {
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
