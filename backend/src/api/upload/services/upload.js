const path = require('path');
const fs = require('fs-extra');

const uploadDir = path.join(__dirname, '..', '..', '..', '..', 'public', 'uploads');

// Configuration
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

module.exports = {
  validateFile(file) {
    if (!file) {
      return 'No file provided';
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`;
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return `File type ${file.mimetype} is not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`;
    }

    return null; // No errors
  },

  async uploadImage(file) {
    const validationError = this.validateFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    try {
      await fs.ensureDir(uploadDir);

      const filename = `${Date.now()}_${file.name}`;
      const filePath = path.join(uploadDir, filename);

      await fs.copy(file.path, filePath);
      await fs.unlink(file.path); // Clean up temp file

      return `/uploads/${filename}`;
    } catch (err) {
      throw new Error(`Failed to upload image: ${err.message}`);
    }
  },
};