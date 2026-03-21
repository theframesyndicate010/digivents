const express = require('express');
const router = express.Router();
// Debug log for all /creators API hits
router.use((req, res, next) => {
  console.log(`[API] /creators${req.path} hit`);
  next();
});
const creatorsController = require('../controllers/creatorsController');
const { requireApiAdmin } = require('../middlewares/auth.middleware');
const { uploadMiddleware } = require('../middlewares/upload.middleware');

// Public route: Fetch all creators
router.get('/', creatorsController.getCreators);
router.get('/:id', creatorsController.getCreatorById);

// Protected routes (Admin only)
router.post(
    '/', 
    requireApiAdmin, 
    uploadMiddleware.single('photo'), 
    creatorsController.createCreator
);

router.put(
    '/:id',
    requireApiAdmin,
    uploadMiddleware.single('photo'),
    creatorsController.updateCreator
);

router.delete('/:id', requireApiAdmin, creatorsController.deleteCreator);

module.exports = router;
