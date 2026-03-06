const path = require('path');
const fs = require('fs-extra');

const uploadDir = path.join(__dirname, '..', '..', '..', '..', 'public', 'uploads');

module.exports = {
  async uploadImage(file) {
    if (!file) throw new Error('No file provided');

    await fs.ensureDir(uploadDir);

    const filename = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadDir, filename);

    await fs.copy(file.path, filePath);

    return `/uploads/${filename}`;
  },
};