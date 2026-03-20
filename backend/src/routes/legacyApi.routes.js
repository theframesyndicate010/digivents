const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const MAX_UPLOAD_SIZE = parseInt(process.env.MAX_FILE_SIZE || String(5 * 1024 * 1024), 10);
const DEFAULT_UPLOAD_ROOT = path.resolve(__dirname, '../../public/uploads');
const isRunningInDocker = fs.existsSync('/.dockerenv');
const configuredUploadDir = process.env.UPLOAD_DIR || '';

const uploadRoot = (() => {
    if (path.isAbsolute(configuredUploadDir)) {
        // `/app` is valid in container, but not when running directly on host machine.
        if (!isRunningInDocker && configuredUploadDir.startsWith('/app/')) {
            return DEFAULT_UPLOAD_ROOT;
        }
        return configuredUploadDir;
    }
    return DEFAULT_UPLOAD_ROOT;
})();

function sanitizeFilenamePart(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80) || 'file';
}

function sanitizeFolder(value) {
    return sanitizeFilenamePart(value || 'misc') || 'misc';
}

function ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true, mode: 0o755 });
    }
}

function relativeUploadUrl(absolutePath) {
    const normalizedRoot = path.resolve(uploadRoot);
    const normalizedFile = path.resolve(absolutePath);
    const rel = path.relative(normalizedRoot, normalizedFile).replace(/\\/g, '/');
    return `/uploads/${rel}`;
}

function getUploadSubfolder(req) {
    const explicitFolder = req.body.folder || req.query.folder;
    if (explicitFolder) return sanitizeFolder(explicitFolder);
    if (req.path.includes('/projects')) return 'projects';
    if (req.path.includes('/creators')) return 'creators';
    if (req.path.includes('/graphics')) return 'graphics';
    return 'misc';
}

function requireApiAdmin(req, res, next) {
    try {
        let token = req.cookies?.accessToken;
        if (!token) {
            const auth = req.headers.authorization;
            if (auth && auth.startsWith('Bearer ')) {
                token = auth.slice(7);
            }
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            return res.status(500).json({ success: false, message: 'Server auth is not configured' });
        }

        const decoded = jwt.verify(token, secret);
        if (!decoded || decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required' });
        }

        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const target = path.join(uploadRoot, getUploadSubfolder(req));
        ensureDirectory(target);
        cb(null, target);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname || '').toLowerCase();
        const baseName = sanitizeFilenamePart(path.basename(file.originalname || 'file', ext));
        const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: MAX_UPLOAD_SIZE },
    fileFilter: function (req, file, cb) {
        const allowedMimeTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']);
        const allowedExtensions = new Set(['.jpeg', '.jpg', '.png', '.gif', '.webp']);
        const extname = path.extname(file.originalname || '').toLowerCase();

        if (allowedMimeTypes.has(file.mimetype) && allowedExtensions.has(extname)) {
            return cb(null, true);
        }
        return cb(new Error('Only JPG, PNG, GIF, and WEBP images are allowed'));
    }
});

function safeJsonParse(value, fallback = []) {
    try {
        return JSON.parse(value);
    } catch (_) {
        return fallback;
    }
}

function parsePositiveInt(value, fallback) {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed <= 0) return fallback;
    return parsed;
}

function slugify(text) {
    return String(text || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

async function getFirstExistingTable(candidates) {
    for (const tableName of candidates) {
        const exists = await db.schema.hasTable(tableName);
        if (exists) return tableName;
    }
    return null;
}

async function ensureProjectsTable() {
    const exists = await db.schema.hasTable('projects');
    if (exists) return;

    await db.schema.createTable('projects', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description');
        table.string('tag');
        table.text('media');
        table.string('cover_photo');
        table.string('contact');
        table.string('youtube_link');
        table.string('instagram_link');
        table.string('tiktok_link');
        table.string('facebook_link');
        table.string('client');
        table.string('status').defaultTo('active');
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
    });
}

async function ensureClientsTable() {
    const exists = await db.schema.hasTable('clients');
    if (exists) return;

    await db.schema.createTable('clients', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('website');
        table.string('instagram_link');
        table.string('facebook_link');
        table.string('tiktok_link');
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
    });
}

async function ensureCreatorsTable() {
    const existing = await getFirstExistingTable(['creators', 'authors']);
    if (existing) return existing;

    await db.schema.createTable('creators', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('photo');
        table.string('role');
        table.text('description');
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
    });

    return 'creators';
}

async function ensureGraphicsTable() {
    const exists = await db.schema.hasTable('graphics');
    if (exists) return;

    await db.schema.createTable('graphics', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description');
        table.string('photo').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
    });
}

async function ensureContactsTable() {
    const exists = await db.schema.hasTable('contacts');
    if (exists) return;

    await db.schema.createTable('contacts', (table) => {
        table.increments('id').primary();
        table.string('first_name');
        table.string('last_name');
        table.string('name');
        table.string('email').notNullable();
        table.string('subject');
        table.text('message').notNullable();
        table.string('status').defaultTo('new');
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
    });
}

async function ensureMessagesTable() {
    const existing = await getFirstExistingTable(['messages', 'contacts']);
    if (existing) return existing;

    await db.schema.createTable('messages', (table) => {
        table.increments('id').primary();
        table.string('first_name');
        table.string('last_name');
        table.string('name');
        table.string('email').notNullable();
        table.string('subject');
        table.text('message').notNullable();
        table.string('status').defaultTo('new');
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
    });

    return 'messages';
}

async function ensureFeedbackTable() {
    const existing = await getFirstExistingTable(['feedback', 'feedbacks']);
    if (existing) return existing;

    await db.schema.createTable('feedback', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email');
        table.integer('rating').defaultTo(5);
        table.text('message').notNullable();
        table.integer('project_id');
        table.string('status').defaultTo('pending');
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
    });

    return 'feedback';
}

async function getGraphicsColumnMode() {
    const [hasName, hasPhoto, hasTitle, hasImagePath] = await Promise.all([
        db.schema.hasColumn('graphics', 'name'),
        db.schema.hasColumn('graphics', 'photo'),
        db.schema.hasColumn('graphics', 'title'),
        db.schema.hasColumn('graphics', 'image_path')
    ]);

    if (hasName && hasPhoto) return 'name_photo';
    if (hasTitle && hasImagePath) return 'title_image_path';
    return 'unknown';
}

function normalizeProject(row) {
    let graphics = [];
    if (Array.isArray(row.media)) {
        graphics = row.media;
    } else if (typeof row.media === 'string' && row.media.trim()) {
        graphics = safeJsonParse(row.media, []);
    }

    return {
        ...row,
        name: row.name || row.title || 'Untitled',
        tag: row.tag || row.category || row.category_name || (row.category_id ? String(row.category_id) : ''),
        client: row.client || row.client_name || (row.client_id ? String(row.client_id) : ''),
        youtubeLink: row.youtube_link || row.youtubeLink || null,
        instagramLink: row.instagram_link || row.instagramLink || null,
        tiktokLink: row.tiktok_link || row.tiktokLink || null,
        facebookLink: row.facebook_link || row.facebookLink || null,
        coverPhoto: row.cover_photo || row.image_path || null,
        contact: row.contact || null,
        status: row.status || 'active',
        graphics
    };
}

function normalizeCreator(row) {
    return {
        ...row,
        name: row.name || row.title || '',
        photo: row.photo || row.image_path || ''
    };
}

function normalizeGraphic(row) {
    return {
        ...row,
        name: row.name || row.title || '',
        photo: row.photo || row.image_path || '',
        description: row.description || ''
    };
}

function normalizeMessage(row) {
    const firstName = row.first_name || row.firstName || '';
    const lastName = row.last_name || row.lastName || '';
    const fullName = String(`${firstName} ${lastName}`).trim();

    return {
        ...row,
        name: row.name || fullName || 'Anonymous',
        first_name: firstName || null,
        last_name: lastName || null,
        status: row.status || 'new'
    };
}

function normalizeFeedback(row) {
    return {
        ...row,
        name: row.name || row.client_name || 'Anonymous',
        rating: parseInt(row.rating || 0, 10) || 0,
        status: row.status || 'pending'
    };
}

// ==========================================
// DASHBOARD
// ==========================================

async function buildDashboardStats() {
    await Promise.all([
        ensureProjectsTable(),
        ensureClientsTable(),
        ensureCreatorsTable(),
        ensureGraphicsTable(),
        ensureContactsTable()
    ]);
    const feedbackTable = await ensureFeedbackTable();

    const [projects, clients, creators, graphics, messages, feedback] = await Promise.all([
        db('projects').count('* as count').first(),
        db('clients').count('* as count').first(),
        db((await ensureCreatorsTable())).count('* as count').first(),
        db('graphics').count('* as count').first(),
        db('contacts').count('* as count').first(),
        db(feedbackTable).count('* as count').first()
    ]);

    const messageTable = await ensureMessagesTable();
    const [recentMessages, recentProjects] = await Promise.all([
        db(messageTable).select('*').orderBy('created_at', 'desc').limit(8),
        db('projects').select('*').orderBy('updated_at', 'desc').limit(8)
    ]);

    return {
        counts: {
            projects: parseInt(projects.count || 0, 10),
            clients: parseInt(clients.count || 0, 10),
            creators: parseInt(creators.count || 0, 10),
            graphics: parseInt(graphics.count || 0, 10),
            messages: parseInt(messages.count || 0, 10),
            feedback: parseInt(feedback.count || 0, 10)
        },
        recentMessages: recentMessages.map(normalizeMessage),
        recentProjects: recentProjects.map(normalizeProject)
    };
}

router.get('/dashboard/stats', async (req, res) => {
    try {
        const data = await buildDashboardStats();
        return res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to fetch dashboard stats' });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const data = await buildDashboardStats();
        return res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to fetch stats' });
    }
});

// ==========================================
// PROJECTS
// ==========================================

router.get('/projects', async (req, res) => {
    try {
        await ensureProjectsTable();
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
        const offset = (page - 1) * limit;

        // Get total count
        const [{ count }] = await db('projects').count('* as count');

        // Get paginated results
        const projects = await db('projects')
            .select('*')
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);

        return res.json({
            success: true,
            data: projects.map(normalizeProject),
            pagination: {
                page,
                limit,
                total: Number(count),
                totalPages: Math.ceil(Number(count) / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to fetch projects' });
    }
});

router.get('/projects/:id', async (req, res) => {
    try {
        await ensureProjectsTable();
        const { id } = req.params;

        const project = await db('projects').where({ id }).first();
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        return res.json({ success: true, data: normalizeProject(project) });
    } catch (error) {
        console.error('Error fetching project:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to fetch project' });
    }
});

router.post('/projects', upload.fields([
    { name: 'graphics', maxCount: 10 },
    { name: 'coverPhoto', maxCount: 1 }
]), async (req, res) => {
    try {
        await ensureProjectsTable();

        const {
            name,
            description,
            tag,
            youtubeLink,
            instagramLink,
            tiktokLink,
            facebookLink,
            client,
            contact
        } = req.body;

        const graphicsFiles = req.files && req.files.graphics ? req.files.graphics : [];
        const coverPhotoFile = req.files && req.files.coverPhoto ? req.files.coverPhoto[0] : null;
        const graphics = graphicsFiles.map((file) => `/uploads/projects/${file.filename}`);
        const coverPhoto = coverPhotoFile ? `/uploads/projects/${coverPhotoFile.filename}` : null;

        const [
            hasName,
            hasTitle,
            hasSlug,
            hasDescription,
            hasTag,
            hasMedia,
            hasCoverPhoto,
            hasImagePath,
            hasContact,
            hasYoutube,
            hasInstagram,
            hasTiktok,
            hasFacebook,
            hasClient,
            hasClientId,
            hasStatus
        ] = await Promise.all([
            db.schema.hasColumn('projects', 'name'),
            db.schema.hasColumn('projects', 'title'),
            db.schema.hasColumn('projects', 'slug'),
            db.schema.hasColumn('projects', 'description'),
            db.schema.hasColumn('projects', 'tag'),
            db.schema.hasColumn('projects', 'media'),
            db.schema.hasColumn('projects', 'cover_photo'),
            db.schema.hasColumn('projects', 'image_path'),
            db.schema.hasColumn('projects', 'contact'),
            db.schema.hasColumn('projects', 'youtube_link'),
            db.schema.hasColumn('projects', 'instagram_link'),
            db.schema.hasColumn('projects', 'tiktok_link'),
            db.schema.hasColumn('projects', 'facebook_link'),
            db.schema.hasColumn('projects', 'client'),
            db.schema.hasColumn('projects', 'client_id'),
            db.schema.hasColumn('projects', 'status')
        ]);

        const payload = {};
        if (hasName) payload.name = name;
        if (hasTitle) payload.title = name;
        if (hasSlug) payload.slug = slugify(name) || `project-${Date.now()}`;
        if (hasDescription) payload.description = description;
        if (hasTag) payload.tag = tag;
        if (hasMedia) payload.media = JSON.stringify(graphics);
        if (hasCoverPhoto) payload.cover_photo = coverPhoto;
        if (hasImagePath) payload.image_path = coverPhoto;
        if (hasContact) payload.contact = contact;
        if (hasYoutube) payload.youtube_link = youtubeLink;
        if (hasInstagram) payload.instagram_link = instagramLink;
        if (hasTiktok) payload.tiktok_link = tiktokLink;
        if (hasFacebook) payload.facebook_link = facebookLink;
        if (hasClient) payload.client = client;
        if (hasClientId && client && !Number.isNaN(parseInt(client, 10))) {
            payload.client_id = parseInt(client, 10);
        }
        if (hasStatus) payload.status = 'active';

        const inserted = await db('projects').insert(payload).returning('*');
        const row = Array.isArray(inserted) ? inserted[0] : inserted;

        return res.json({
            success: true,
            message: 'Project created successfully!',
            data: normalizeProject(row)
        });
    } catch (error) {
        console.error('Error creating project:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to create project' });
    }
});

router.delete('/projects/:id', async (req, res) => {
    try {
        await ensureProjectsTable();
        const { id } = req.params;

        await db('projects').where({ id }).del();
        return res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to delete project' });
    }
});

router.put('/projects/:id', upload.fields([
    { name: 'graphics', maxCount: 10 },
    { name: 'coverPhoto', maxCount: 1 }
]), async (req, res) => {
    try {
        await ensureProjectsTable();
        const { id } = req.params;

        const existing = await db('projects').where({ id }).first();
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const {
            name,
            description,
            tag,
            youtubeLink,
            instagramLink,
            tiktokLink,
            facebookLink,
            client,
            contact,
            status
        } = req.body;

        const graphicsFiles = req.files && req.files.graphics ? req.files.graphics : [];
        const coverPhotoFile = req.files && req.files.coverPhoto ? req.files.coverPhoto[0] : null;
        const graphics = graphicsFiles.map((file) => `/uploads/projects/${file.filename}`);
        const coverPhoto = coverPhotoFile ? `/uploads/projects/${coverPhotoFile.filename}` : null;

        const hasMedia = await db.schema.hasColumn('projects', 'media');
        const hasCoverPhoto = await db.schema.hasColumn('projects', 'cover_photo');
        const hasImagePath = await db.schema.hasColumn('projects', 'image_path');

        const payload = {
            ...(name !== undefined ? { name } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(tag !== undefined ? { tag } : {}),
            ...(contact !== undefined ? { contact } : {}),
            ...(youtubeLink !== undefined ? { youtube_link: youtubeLink } : {}),
            ...(instagramLink !== undefined ? { instagram_link: instagramLink } : {}),
            ...(tiktokLink !== undefined ? { tiktok_link: tiktokLink } : {}),
            ...(facebookLink !== undefined ? { facebook_link: facebookLink } : {}),
            ...(client !== undefined ? { client } : {}),
            ...(status !== undefined ? { status } : {})
        };

        if (graphics.length > 0 && hasMedia) payload.media = JSON.stringify(graphics);
        if (coverPhoto && hasCoverPhoto) payload.cover_photo = coverPhoto;
        if (coverPhoto && hasImagePath) payload.image_path = coverPhoto;
        payload.updated_at = db.fn.now();

        const updated = await db('projects').where({ id }).update(payload).returning('*');
        const row = Array.isArray(updated) ? updated[0] : updated;
        return res.json({ success: true, message: 'Project updated successfully', data: normalizeProject(row) });
    } catch (error) {
        console.error('Error updating project:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to update project' });
    }
});

// ==========================================
// CLIENTS
// ==========================================

router.get('/clients', async (req, res) => {
    try {
        await ensureClientsTable();
        const clients = await db('clients').select('*').orderBy('created_at', 'desc');
        return res.json({ success: true, data: clients });
    } catch (error) {
        console.error('Error fetching clients:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to fetch clients' });
    }
});

router.get('/clients/:id', async (req, res) => {
    try {
        await ensureClientsTable();
        const { id } = req.params;

        const client = await db('clients').where({ id }).first();
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }

        return res.json({ success: true, data: client });
    } catch (error) {
        console.error('Error fetching client:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to fetch client' });
    }
});

router.post('/clients', async (req, res) => {
    try {
        await ensureClientsTable();
        const { name, website, instagramLink, facebookLink, tiktokLink } = req.body;

        const [hasName, hasWebsite, hasInstagram, hasFacebook, hasTiktok] = await Promise.all([
            db.schema.hasColumn('clients', 'name'),
            db.schema.hasColumn('clients', 'website'),
            db.schema.hasColumn('clients', 'instagram_link'),
            db.schema.hasColumn('clients', 'facebook_link'),
            db.schema.hasColumn('clients', 'tiktok_link')
        ]);

        const payload = {};
        if (hasName) payload.name = name;
        if (hasWebsite) payload.website = website;
        if (hasInstagram) payload.instagram_link = instagramLink;
        if (hasFacebook) payload.facebook_link = facebookLink;
        if (hasTiktok) payload.tiktok_link = tiktokLink;

        const inserted = await db('clients').insert(payload).returning('*');
        const row = Array.isArray(inserted) ? inserted[0] : inserted;

        return res.json({ success: true, message: 'Client created successfully!', data: row });
    } catch (error) {
        console.error('Error creating client:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to create client' });
    }
});

router.put('/clients/:id', async (req, res) => {
    try {
        await ensureClientsTable();
        const { id } = req.params;

        const existing = await db('clients').where({ id }).first();
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }

        const { name, website, instagramLink, facebookLink, tiktokLink } = req.body;
        const payload = {
            ...(name !== undefined ? { name } : {}),
            ...(website !== undefined ? { website } : {}),
            ...(instagramLink !== undefined ? { instagram_link: instagramLink } : {}),
            ...(facebookLink !== undefined ? { facebook_link: facebookLink } : {}),
            ...(tiktokLink !== undefined ? { tiktok_link: tiktokLink } : {}),
            updated_at: db.fn.now()
        };

        const updated = await db('clients').where({ id }).update(payload).returning('*');
        const row = Array.isArray(updated) ? updated[0] : updated;
        return res.json({ success: true, message: 'Client updated successfully', data: row });
    } catch (error) {
        console.error('Error updating client:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to update client' });
    }
});

router.delete('/clients/:id', async (req, res) => {
    try {
        await ensureClientsTable();
        const { id } = req.params;

        await db('clients').where({ id }).del();
        return res.json({ success: true, message: 'Client deleted successfully' });
    } catch (error) {
        console.error('Error deleting client:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to delete client' });
    }
});

// ==========================================
// CREATORS
// ==========================================

router.get('/creators', async (req, res) => {
    try {
        const creatorsTable = await ensureCreatorsTable();
        const creators = await db(creatorsTable).select('*').orderBy('created_at', 'desc');
        return res.json({ success: true, data: creators.map(normalizeCreator) });
    } catch (error) {
        console.error('Error fetching creators:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to fetch creators' });
    }
});

router.get('/creators/:id', async (req, res) => {
    try {
        const creatorsTable = await ensureCreatorsTable();
        const { id } = req.params;

        const creator = await db(creatorsTable).where({ id }).first();
        if (!creator) {
            return res.status(404).json({ success: false, message: 'Creator not found' });
        }

        return res.json({ success: true, data: normalizeCreator(creator) });
    } catch (error) {
        console.error('Error fetching creator:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to fetch creator' });
    }
});

router.post('/creators', upload.single('photo'), async (req, res) => {
    try {
        const creatorsTable = await ensureCreatorsTable();
        const { name } = req.body;
        const photo = req.file ? `/uploads/creators/${req.file.filename}` : null;

        const [hasName, hasTitle, hasPhoto, hasImagePath] = await Promise.all([
            db.schema.hasColumn(creatorsTable, 'name'),
            db.schema.hasColumn(creatorsTable, 'title'),
            db.schema.hasColumn(creatorsTable, 'photo'),
            db.schema.hasColumn(creatorsTable, 'image_path')
        ]);

        const payload = {};
        if (hasName) payload.name = name;
        if (hasTitle) payload.title = name;
        if (hasPhoto) payload.photo = photo;
        if (hasImagePath) payload.image_path = photo;

        const inserted = await db(creatorsTable).insert(payload).returning('*');
        const row = Array.isArray(inserted) ? inserted[0] : inserted;

        return res.json({
            success: true,
            message: 'Creator added successfully!',
            data: normalizeCreator(row)
        });
    } catch (error) {
        console.error('Error creating creator:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to add creator' });
    }
});

router.put('/creators/:id', upload.single('photo'), async (req, res) => {
    try {
        const creatorsTable = await ensureCreatorsTable();
        const { id } = req.params;

        const existing = await db(creatorsTable).where({ id }).first();
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Creator not found' });
        }

        const { name, role, description } = req.body;
        const photo = req.file ? `/uploads/creators/${req.file.filename}` : null;

        const payload = {
            ...(name !== undefined ? { name } : {}),
            ...(role !== undefined ? { role } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(photo ? { photo } : {}),
            updated_at: db.fn.now()
        };

        const updated = await db(creatorsTable).where({ id }).update(payload).returning('*');
        const row = Array.isArray(updated) ? updated[0] : updated;
        return res.json({ success: true, message: 'Creator updated successfully', data: normalizeCreator(row) });
    } catch (error) {
        console.error('Error updating creator:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to update creator' });
    }
});

router.delete('/creators/:id', async (req, res) => {
    try {
        const creatorsTable = await ensureCreatorsTable();
        const { id } = req.params;

        await db(creatorsTable).where({ id }).del();
        return res.json({ success: true, message: 'Creator deleted successfully' });
    } catch (error) {
        console.error('Error deleting creator:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to delete creator' });
    }
});

// ==========================================
// GRAPHICS
// ==========================================

router.get('/graphics', async (req, res) => {
    try {
        await ensureGraphicsTable();
        const graphics = await db('graphics').select('*').orderBy('created_at', 'desc');
        return res.json({ success: true, data: graphics.map(normalizeGraphic) });
    } catch (error) {
        console.error('Error fetching graphics:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to fetch graphics' });
    }
});

router.get('/graphics/:id', async (req, res) => {
    try {
        await ensureGraphicsTable();
        const { id } = req.params;

        const graphic = await db('graphics').where({ id }).first();
        if (!graphic) {
            return res.status(404).json({ success: false, message: 'Graphic not found' });
        }

        return res.json({ success: true, data: normalizeGraphic(graphic) });
    } catch (error) {
        console.error('Error fetching graphic:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to fetch graphic' });
    }
});

router.post('/graphics', upload.single('photo'), async (req, res) => {
    try {
        await ensureGraphicsTable();
        const { name, description } = req.body;
        const photo = req.file ? `/uploads/graphics/${req.file.filename}` : null;

        if (!photo) {
            return res.status(400).json({ success: false, message: 'Photo is required' });
        }

        const mode = await getGraphicsColumnMode();
        let payload;
        if (mode === 'title_image_path') {
            payload = {
                title: name,
                description,
                image_path: photo
            };
        } else {
            payload = {
                name,
                description,
                photo
            };
        }

        const inserted = await db('graphics').insert(payload).returning('*');
        const row = Array.isArray(inserted) ? inserted[0] : inserted;

        return res.json({
            success: true,
            message: 'Graphic added successfully!',
            data: normalizeGraphic(row)
        });
    } catch (error) {
        console.error('Error adding graphic:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to add graphic' });
    }
});

router.delete('/graphics/:id', async (req, res) => {
    try {
        await ensureGraphicsTable();
        const { id } = req.params;

        const rows = await db('graphics').where({ id }).select('*').limit(1);
        const row = rows[0];
        await db('graphics').where({ id }).del();

        const photoPath = row ? (row.photo || row.image_path) : null;
        if (photoPath && photoPath.startsWith('/uploads/')) {
            const absolutePath = path.join(process.cwd(), 'public', photoPath.replace('/uploads/', 'uploads/'));
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        }

        return res.json({ success: true, message: 'Graphic deleted successfully' });
    } catch (error) {
        console.error('Error deleting graphic:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to delete graphic' });
    }
});

router.put('/graphics/:id', upload.single('photo'), async (req, res) => {
    try {
        await ensureGraphicsTable();
        const { id } = req.params;

        const existing = await db('graphics').where({ id }).first();
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Graphic not found' });
        }

        const { name, description } = req.body;
        const photo = req.file ? `/uploads/graphics/${req.file.filename}` : null;
        const mode = await getGraphicsColumnMode();

        const payload = {
            ...(description !== undefined ? { description } : {}),
            updated_at: db.fn.now()
        };

        if (mode === 'title_image_path') {
            if (name !== undefined) payload.title = name;
            if (photo) payload.image_path = photo;
        } else {
            if (name !== undefined) payload.name = name;
            if (photo) payload.photo = photo;
        }

        const updated = await db('graphics').where({ id }).update(payload).returning('*');
        const row = Array.isArray(updated) ? updated[0] : updated;
        return res.json({ success: true, message: 'Graphic updated successfully', data: normalizeGraphic(row) });
    } catch (error) {
        console.error('Error updating graphic:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to update graphic' });
    }
});

// ==========================================
// SECURE MEDIA UPLOADS
// ==========================================

router.post('/upload', requireApiAdmin, upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'image', maxCount: 1 }
]), async (req, res) => {
    try {
        const images = [
            ...(req.files?.images || []),
            ...(req.files?.image || [])
        ];

        if (!images.length) {
            return res.status(400).json({ success: false, message: 'No image files were uploaded' });
        }

        const files = images.map((file) => ({
            originalName: file.originalname,
            fileName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            url: relativeUploadUrl(file.path)
        }));

        return res.status(201).json({
            success: true,
            message: `${files.length} file(s) uploaded successfully`,
            data: files
        });
    } catch (error) {
        console.error('Error uploading files:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to upload files' });
    }
});

// ==========================================
// MESSAGES (CONTACT)
// ==========================================

router.get('/messages', async (req, res) => {
    try {
        const messagesTable = await ensureMessagesTable();
        const page = parsePositiveInt(req.query.page, 1);
        const perPage = Math.min(parsePositiveInt(req.query.perPage, 20), 100);
        const offset = (page - 1) * perPage;
        const { status, search } = req.query;

        let query = db(messagesTable);
        if (status) query = query.where({ status });
        if (search) {
            query = query.where((qb) => {
                qb.whereILike('name', `%${search}%`)
                    .orWhereILike('first_name', `%${search}%`)
                    .orWhereILike('last_name', `%${search}%`)
                    .orWhereILike('email', `%${search}%`)
                    .orWhereILike('subject', `%${search}%`)
                    .orWhereILike('message', `%${search}%`);
            });
        }

        const totalResult = await query.clone().count('* as count').first();
        const messages = await query
            .clone()
            .select('*')
            .orderBy('created_at', 'desc')
            .limit(perPage)
            .offset(offset);

        return res.json({
            success: true,
            data: messages.map(normalizeMessage),
            pagination: {
                page,
                perPage,
                total: parseInt(totalResult.count || 0, 10)
            }
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to fetch messages' });
    }
});

router.post('/messages', async (req, res) => {
    try {
        const messagesTable = await ensureMessagesTable();
        const { first_name, last_name, name, email, subject, message, status } = req.body;
        if (!email || !message) {
            return res.status(400).json({ success: false, message: 'Email and message are required' });
        }

        const payload = {
            first_name: first_name || null,
            last_name: last_name || null,
            name: name || null,
            email,
            subject: subject || null,
            message,
            status: status || 'new'
        };

        const inserted = await db(messagesTable).insert(payload).returning('*');
        const row = Array.isArray(inserted) ? inserted[0] : inserted;
        return res.status(201).json({ success: true, message: 'Message created successfully', data: normalizeMessage(row) });
    } catch (error) {
        console.error('Error creating message:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to create message' });
    }
});

router.put('/messages/:id', async (req, res) => {
    try {
        const messagesTable = await ensureMessagesTable();
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Invalid message id' });
        }

        const existing = await db(messagesTable).where({ id }).first();
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        const { first_name, last_name, name, email, subject, message, status } = req.body;
        const payload = {
            ...(first_name !== undefined ? { first_name } : {}),
            ...(last_name !== undefined ? { last_name } : {}),
            ...(name !== undefined ? { name } : {}),
            ...(email !== undefined ? { email } : {}),
            ...(subject !== undefined ? { subject } : {}),
            ...(message !== undefined ? { message } : {}),
            ...(status !== undefined ? { status } : {}),
            updated_at: db.fn.now()
        };

        const updated = await db(messagesTable).where({ id }).update(payload).returning('*');
        const row = Array.isArray(updated) ? updated[0] : updated;
        return res.json({ success: true, message: 'Message updated successfully', data: normalizeMessage(row) });
    } catch (error) {
        console.error('Error updating message:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to update message' });
    }
});

router.delete('/messages/:id', async (req, res) => {
    try {
        const messagesTable = await ensureMessagesTable();
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Invalid message id' });
        }

        await db(messagesTable).where({ id }).del();
        return res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to delete message' });
    }
});

router.get('/contacts', async (req, res) => {
    try {
        await ensureContactsTable();
        const page = parsePositiveInt(req.query.page, 1);
        const perPage = Math.min(parsePositiveInt(req.query.perPage, 20), 100);
        const offset = (page - 1) * perPage;
        const { status, search } = req.query;

        let query = db('contacts');
        if (status) query = query.where({ status });
        if (search) {
            query = query.where((qb) => {
                qb.whereILike('name', `%${search}%`)
                    .orWhereILike('first_name', `%${search}%`)
                    .orWhereILike('last_name', `%${search}%`)
                    .orWhereILike('email', `%${search}%`)
                    .orWhereILike('subject', `%${search}%`)
                    .orWhereILike('message', `%${search}%`);
            });
        }

        const totalResult = await query.clone().count('* as count').first();
        const contacts = await query
            .clone()
            .select('*')
            .orderBy('created_at', 'desc')
            .limit(perPage)
            .offset(offset);

        return res.json({
            success: true,
            data: contacts.map(normalizeMessage),
            pagination: {
                page,
                perPage,
                total: parseInt(totalResult.count || 0, 10)
            }
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to fetch contacts' });
    }
});

router.post('/contacts', async (req, res) => {
    try {
        await ensureContactsTable();
        const { first_name, last_name, name, email, subject, message, status } = req.body;
        if (!email || !message) {
            return res.status(400).json({ success: false, message: 'Email and message are required' });
        }

        const payload = {
            first_name: first_name || null,
            last_name: last_name || null,
            name: name || null,
            email,
            subject: subject || null,
            message,
            status: status || 'new'
        };

        const inserted = await db('contacts').insert(payload).returning('*');
        const row = Array.isArray(inserted) ? inserted[0] : inserted;
        return res.status(201).json({ success: true, message: 'Contact created successfully', data: normalizeMessage(row) });
    } catch (error) {
        console.error('Error creating contact:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to create contact' });
    }
});

router.put('/contacts/:id', async (req, res) => {
    try {
        await ensureContactsTable();
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Invalid contact id' });
        }

        const existing = await db('contacts').where({ id }).first();
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }

        const { first_name, last_name, name, email, subject, message, status } = req.body;
        const payload = {
            ...(first_name !== undefined ? { first_name } : {}),
            ...(last_name !== undefined ? { last_name } : {}),
            ...(name !== undefined ? { name } : {}),
            ...(email !== undefined ? { email } : {}),
            ...(subject !== undefined ? { subject } : {}),
            ...(message !== undefined ? { message } : {}),
            ...(status !== undefined ? { status } : {}),
            updated_at: db.fn.now()
        };

        const updated = await db('contacts').where({ id }).update(payload).returning('*');
        const row = Array.isArray(updated) ? updated[0] : updated;
        return res.json({ success: true, message: 'Contact updated successfully', data: normalizeMessage(row) });
    } catch (error) {
        console.error('Error updating contact:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to update contact' });
    }
});

router.delete('/contacts/:id', async (req, res) => {
    try {
        await ensureContactsTable();
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Invalid contact id' });
        }

        await db('contacts').where({ id }).del();
        return res.json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to delete contact' });
    }
});

// Frontend compatibility aliases
router.get('/contact', async (req, res) => {
    req.url = '/messages';
    return router.handle(req, res);
});

router.post('/contact', async (req, res) => {
    req.body = {
        ...req.body,
        first_name: req.body.first_name || req.body.firstName,
        last_name: req.body.last_name || req.body.lastName
    };
    req.url = '/messages';
    return router.handle(req, res);
});

// ==========================================
// FEEDBACK
// ==========================================

router.get('/feedback', async (req, res) => {
    try {
        const feedbackTable = await ensureFeedbackTable();
        const rows = await db(feedbackTable).select('*').orderBy('created_at', 'desc');
        return res.json({ success: true, data: rows.map(normalizeFeedback) });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to fetch feedback' });
    }
});

router.post('/feedback', async (req, res) => {
    try {
        const feedbackTable = await ensureFeedbackTable();
        const { name, email, rating, message, project_id, status } = req.body;
        if (!name || !message) {
            return res.status(400).json({ success: false, message: 'Name and message are required' });
        }

        const payload = {
            name,
            email: email || null,
            rating: parseInt(rating || 5, 10),
            message,
            project_id: project_id ? parseInt(project_id, 10) : null,
            status: status || 'pending'
        };

        const inserted = await db(feedbackTable).insert(payload).returning('*');
        const row = Array.isArray(inserted) ? inserted[0] : inserted;
        return res.status(201).json({ success: true, message: 'Feedback submitted successfully', data: normalizeFeedback(row) });
    } catch (error) {
        console.error('Error creating feedback:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to create feedback' });
    }
});

router.put('/feedback/:id', async (req, res) => {
    try {
        const feedbackTable = await ensureFeedbackTable();
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Invalid feedback id' });
        }

        const existing = await db(feedbackTable).where({ id }).first();
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        const { name, email, rating, message, project_id, status } = req.body;
        const payload = {
            ...(name !== undefined ? { name } : {}),
            ...(email !== undefined ? { email } : {}),
            ...(rating !== undefined ? { rating: parseInt(rating, 10) } : {}),
            ...(message !== undefined ? { message } : {}),
            ...(project_id !== undefined ? { project_id: project_id ? parseInt(project_id, 10) : null } : {}),
            ...(status !== undefined ? { status } : {}),
            updated_at: db.fn.now()
        };

        const updated = await db(feedbackTable).where({ id }).update(payload).returning('*');
        const row = Array.isArray(updated) ? updated[0] : updated;
        return res.json({ success: true, message: 'Feedback updated successfully', data: normalizeFeedback(row) });
    } catch (error) {
        console.error('Error updating feedback:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to update feedback' });
    }
});

router.delete('/feedback/:id', async (req, res) => {
    try {
        const feedbackTable = await ensureFeedbackTable();
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Invalid feedback id' });
        }

        await db(feedbackTable).where({ id }).del();
        return res.json({ success: true, message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        return res.status(500).json({ success: false, message: error.message || 'Failed to delete feedback' });
    }
});

module.exports = router;
