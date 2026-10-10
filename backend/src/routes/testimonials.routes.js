const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');
const { requireApiAdmin } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', testimonialsController.getTestimonials);
router.get('/:id', testimonialsController.getTestimonialById);

// Protected routes (Admin only)
router.get('/admin/all', requireApiAdmin, testimonialsController.getTestimonialsAdmin);
router.post('/', requireApiAdmin, testimonialsController.createTestimonial);
router.put('/:id', requireApiAdmin, testimonialsController.updateTestimonial);
router.delete('/:id', requireApiAdmin, testimonialsController.deleteTestimonial);

module.exports = router;