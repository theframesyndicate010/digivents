const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');
const { requireApiAdmin } = require('../middlewares/auth.middleware');
const { uploadMiddleware, uploadHandler, multerErrorHandler } = require('../middlewares/upload.middleware');

// Public routes
router.get('/', testimonialsController.getTestimonials);
router.get('/:id', testimonialsController.getTestimonialById);

// Admin listing includes hidden rows. Declared before /:id so "admin" is never
// treated as an id.
router.get('/admin/all', requireApiAdmin, testimonialsController.getTestimonialsAdmin);

// Protected routes (Admin only)
router.post(
    '/',
    requireApiAdmin,
    uploadMiddleware.single('photo'),
    uploadHandler,
    testimonialsController.createTestimonial
);
router.put(
    '/:id',
    requireApiAdmin,
    uploadMiddleware.single('photo'),
    uploadHandler,
    testimonialsController.updateTestimonial
);
router.delete('/:id', requireApiAdmin, testimonialsController.deleteTestimonial);

router.use(multerErrorHandler);

module.exports = router;