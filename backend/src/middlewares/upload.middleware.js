const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');


const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const VIDEO_MAX_SIZE = 100 * 1024 * 1024; // 100MB
const uploadRoot = path.join(__dirname, '../../public/uploads');

function ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function sanitizeFilenamePart(value) {
    return String(value || '').replace(/[^a-z0-9]/gi, '_').toLowerCase();
}


function getUploadSubfolderByType(file) {
    const imageTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
    const videoTypes = new Set(['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']);
    if (imageTypes.has(file.mimetype)) return 'images';
    if (videoTypes.has(file.mimetype)) return 'videos';
    return 'other';
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const subfolder = getUploadSubfolderByType(file);
        const target = path.join(uploadRoot, subfolder);
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


function fileFilter(req, file, cb) {
    const imageMimeTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
    const imageExts = new Set(['.jpeg', '.jpg', '.png', '.webp']);
    const videoMimeTypes = new Set(['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']);
    const videoExts = new Set(['.mp4', '.mov', '.avi', '.mkv']);
    const extname = path.extname(file.originalname || '').toLowerCase();

    if (imageMimeTypes.has(file.mimetype) && imageExts.has(extname)) {
        file._fileType = 'image';
        return cb(null, true);
    }
    if (videoMimeTypes.has(file.mimetype) && videoExts.has(extname)) {
        file._fileType = 'video';
        return cb(null, true);
    }
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only JPG, PNG, WEBP images and MP4, MOV, AVI, MKV videos are allowed'));
}

function limitsByFileType(req, file, cb) {
    // This function is for reference; multer only supports global limits, so we check size in a custom middleware after upload
    cb();
}

const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: { fileSize: VIDEO_MAX_SIZE }, // Max possible size, will check per file after upload
});

// Logging utility
function logUpload(file, req) {
    const logMsg = `[UPLOAD] ${new Date().toISOString()} | ${file._fileType || 'unknown'} | ${file.originalname} -> ${file.filename} | ${file.size} bytes | ${req.ip}`;
    console.log(logMsg);
}

// Middleware to check per-file size limits and log uploads
function uploadHandler(req, res, next) {
    // Support both single and multiple file uploads
    const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : (req.file ? [req.file] : []);
    for (const file of files) {
        // Log upload
        logUpload(file, req);
        // Enforce per-type size limits
        if (file._fileType === 'image' && file.size > IMAGE_MAX_SIZE) {
            return res.status(400).json({ success: false, message: `Image file too large (max 5MB): ${file.originalname}` });
        }
        if (file._fileType === 'video' && file.size > VIDEO_MAX_SIZE) {
            return res.status(400).json({ success: false, message: `Video file too large (max 100MB): ${file.originalname}` });
        }
    }
    next();
}

module.exports = {
    uploadMiddleware,
    uploadHandler,
};