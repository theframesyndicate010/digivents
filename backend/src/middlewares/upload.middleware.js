const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const MAX_UPLOAD_SIZE = parseInt(process.env.MAX_FILE_SIZE || String(5 * 1024 * 1024), 10);
const uploadRoot = path.join(__dirname, '../../public/uploads');

function ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function sanitizeFilenamePart(value) {
    return String(value || '').replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function getUploadSubfolder(req) {
    const urlPath = req.originalUrl || req.url;
    if (urlPath.includes('/creators')) return 'creators';
    if (urlPath.includes('/graphics')) return 'graphics';
    if (urlPath.includes('/projects')) return 'projects';
    return 'general';
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

const uploadMiddleware = multer({
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

module.exports = uploadMiddleware;