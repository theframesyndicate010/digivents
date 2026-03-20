const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { requireApiAdmin } = require('../middlewares/auth.middleware');

// Public route: submit feedback
router.post('/', feedbackController.createFeedback);

// Protected routes (Admin only)
router.get('/', requireApiAdmin, feedbackController.getFeedback);
router.put('/:id', requireApiAdmin, feedbackController.updateFeedback);
router.delete('/:id', requireApiAdmin, feedbackController.deleteFeedback);

module.exports = router;
