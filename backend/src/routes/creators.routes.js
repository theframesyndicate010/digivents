const express = require('express');
const router = express.Router();
const creatorsController = require('../controllers/creatorsController');
const { requireApiAdmin } = require('../middlewares/auth.middleware');
const { uploadMiddleware, uploadHandler, multerErrorHandler } = require('../middlewares/upload.middleware');

// Public routes
router.get('/', creatorsController.getCreators);
router.get('/:id', creatorsController.getCreatorById);

// Admin protected routes
router.post(
    '/',
    requireApiAdmin,
    uploadMiddleware.single('photo'), // multer
    uploadHandler,                    // per-file checks + logging
    creatorsController.createCreator
);

router.put(
    '/:id',
    requireApiAdmin,
    uploadMiddleware.single('photo'),
    uploadHandler,
    creatorsController.updateCreator
);

router.delete('/:id',
    requireApiAdmin,
    creatorsController.deleteCreator
);

// Global multer error handler
router.use(multerErrorHandler);

module.exports = router;