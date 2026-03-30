const express = require('express');
const router = express.Router();
const graphicsController = require('../controllers/graphicsController');
const { requireApiAdmin } = require('../middlewares/auth.middleware');
const { uploadMiddleware, uploadHandler } = require('../middlewares/upload.middleware');

// Public
router.get('/', graphicsController.getGraphics);
router.get('/:id', graphicsController.getGraphicById);

// Admin
router.post(
    '/',
    requireApiAdmin,
    uploadMiddleware.single('photo'),
    uploadHandler,
    graphicsController.createGraphic
);
router.put(
    '/:id',
    requireApiAdmin,
    uploadMiddleware.single('photo'),
    uploadHandler,
    graphicsController.updateGraphic
);
router.delete('/:id', requireApiAdmin, graphicsController.deleteGraphic);

module.exports = router;