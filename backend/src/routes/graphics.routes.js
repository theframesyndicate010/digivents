const express = require('express');
const router = express.Router();
const graphicsController = require('../controllers/graphicsController');
const { requireApiAdmin } = require('../middlewares/auth.middleware');
const { uploadMiddleware } = require('../middlewares/upload.middleware');

// Public route: Fetch all graphics
router.get('/', graphicsController.getGraphics);
router.get('/:id', graphicsController.getGraphicById);

// Protected routes (Admin only)
router.post(
    '/', 
    requireApiAdmin, 
    uploadMiddleware.single('photo'), 
    graphicsController.createGraphic
);

router.put(
    '/:id',
    requireApiAdmin,
    uploadMiddleware.single('photo'),
    graphicsController.updateGraphic
);

router.delete('/:id', requireApiAdmin, graphicsController.deleteGraphic);

module.exports = router;
