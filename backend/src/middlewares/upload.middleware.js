const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const VIDEO_MAX_SIZE = 100 * 1024 * 1024; // 100MB

// Use relative path for cPanel compatibility
// If UPLOAD_DIR is absolute, use it; otherwise use relative path from project root
const uploadRoot = process.env.UPLOAD_DIR 
    ? (path.isAbsolute(process.env.UPLOAD_DIR) 
        ? process.env.UPLOAD_DIR 
        : path.join(__dirname, '../../', process.env.UPLOAD_DIR))
    : path.join(__dirname, '../../public/uploads');

// Log upload configuration on startup
console.log(`[UPLOAD] Upload directory configured: ${uploadRoot}`);
console.log(`[UPLOAD] Absolute path: ${path.resolve(uploadRoot)}`);
console.log(`[UPLOAD] Image max size: ${IMAGE_MAX_SIZE / 1024 / 1024}MB`);
console.log(`[UPLOAD] Video max size: ${VIDEO_MAX_SIZE / 1024 / 1024}MB`);

// Verify upload directory is accessible
try {
    if (!fs.existsSync(uploadRoot)) {
        console.warn(`[UPLOAD] Upload root does not exist: ${uploadRoot}`);
        console.warn(`[UPLOAD] Please create the directory manually with proper permissions`);
    } else {
        // Test write permissions
        const testFile = path.join(uploadRoot, '.write-test');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        console.log(`[UPLOAD] Upload directory is writable: ${uploadRoot}`);
    }
} catch (err) {
    console.error(`[UPLOAD] CRITICAL: Upload directory is not writable: ${uploadRoot}`, err);
    console.error(`[UPLOAD] File uploads will fail until this is resolved!`);
}

// Sanitize filename
function sanitizeFilenamePart(value) {
    return String(value || '').replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

// Determine subfolder
function getUploadSubfolderByType(file) {
    const imageTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
    const videoTypes = new Set(['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']);
    if (imageTypes.has(file.mimetype)) return 'graphics';
    if (videoTypes.has(file.mimetype)) return 'videos';
    return 'other';
}

// Multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            const subfolder = getUploadSubfolderByType(file);
            const target = path.join(uploadRoot, subfolder);
            // Directory should already exist - don't try to create it
            console.log(`[UPLOAD] Saving ${file.originalname} to ${target}`);
            cb(null, target);
        } catch (err) {
            console.error(`[UPLOAD] Error setting destination:`, err);
            cb(err);
        }
    },
    filename: function (req, file, cb) {
        try {
            const ext = path.extname(file.originalname || '').toLowerCase();
            // Use the 'name' field from the form, fallback to 'file' if not present
            let userName = req.body && req.body.name ? req.body.name : 'file';
            userName = sanitizeFilenamePart(userName);
            const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, '');
            const finalName = `${userName}-${dateStr}${ext}`;
            console.log(`[UPLOAD] Final filename: ${finalName}`);
            cb(null, finalName);
        } catch (err) {
            console.error(`[UPLOAD] Error generating filename:`, err);
            cb(err);
        }
    }
});

// File filter with debug
function fileFilter(req, file, cb) {
    const imageMimeTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
    const imageExts = new Set(['.jpeg', '.jpg', '.png', '.webp']);
    const extname = path.extname(file.originalname || '').toLowerCase();

    if (imageMimeTypes.has(file.mimetype) && imageExts.has(extname)) {
        file._fileType = 'image';
        console.log(`[UPLOAD] Accepting image: ${file.originalname}`);
        return cb(null, true);
    }

    console.warn(`[UPLOAD] Rejecting file: ${file.originalname} (${file.mimetype})`);
    const error = new Error('Only JPG, PNG, WEBP images are allowed');
    error.code = 'INVALID_FILE_TYPE';
    return cb(error, false);
}


// Multer middleware (fields, single, array supported)
const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: { fileSize: VIDEO_MAX_SIZE } // max possible; per-file checked later
});

// Log utility
function logUpload(file, req) {
    const logMsg = `[UPLOAD] ${new Date().toISOString()} | ${file._fileType || 'unknown'} | ${file.originalname} -> ${file.filename} | ${file.size} bytes | IP: ${req.ip}`;
    console.log(logMsg);
}

// Middleware to enforce per-file size limits & log
function uploadHandler(req, res, next) {
    let files = [];
    if (req.files) {
        if (Array.isArray(req.files)) {
            files = req.files;
        } else {
            // Multer .fields() produces an object: { field: [file, ...], ... }
            files = Object.values(req.files).flat();
        }
    } else if (req.file) {
        files = [req.file];
    }
    for (const file of files) {
        logUpload(file, req);
        if (file._fileType === 'image' && file.size > IMAGE_MAX_SIZE) {
            return res.status(400).json({ success: false, message: `Image file too large (max 5MB): ${file.originalname}` });
        }
        if (file._fileType === 'video' && file.size > VIDEO_MAX_SIZE) {
            return res.status(400).json({ success: false, message: `Video file too large (max 100MB): ${file.originalname}` });
        }
    }
    next();
}

// Middleware to handle multer errors globally
function multerErrorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        console.error(`[UPLOAD ERROR] MulterError: ${err.message}`, err);
        return res.status(400).json({ 
            success: false, 
            message: err.message,
            data: null 
        });
    }
    if (err && err.code === 'INVALID_FILE_TYPE') {
        console.error(`[UPLOAD ERROR] Invalid file type: ${err.message}`);
        return res.status(400).json({ 
            success: false, 
            message: err.message,
            data: null 
        });
    }
    if (err && err.message) {
        // Catch any other upload-related errors
        console.error(`[UPLOAD ERROR] Upload error:`, err);
        return res.status(400).json({ 
            success: false, 
            message: `Upload failed: ${err.message}`,
            data: null 
        });
    }
    next(err);
}

module.exports = {
    uploadMiddleware,
    uploadHandler,
    multerErrorHandler,
};