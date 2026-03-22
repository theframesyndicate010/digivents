const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const { requireApiAdmin } = require('../middlewares/auth.middleware');
const { uploadMiddleware, uploadHandler, multerErrorHandler } = require('../middlewares/upload.middleware');

// Public routes
router.get('/', postsController.getPosts);
router.get('/:id', postsController.getPostById);

// Admin protected routes
router.post(
    '/',
    requireApiAdmin,
    uploadMiddleware.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'video', maxCount: 1 }
    ]),
    uploadHandler,
    postsController.createPost
);

router.put(
    '/:id',
    requireApiAdmin,
    uploadMiddleware.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'video', maxCount: 1 }
    ]),
    uploadHandler,
    postsController.updatePost
);

router.delete('/:id',
    requireApiAdmin,
    postsController.deletePost
);

// Global multer error handler
router.use(multerErrorHandler);

module.exports = router;
