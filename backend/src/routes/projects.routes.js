const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');
const { requireApiAdmin } = require('../middlewares/auth.middleware');
const { uploadMiddleware, uploadHandler, multerErrorHandler } = require('../middlewares/upload.middleware');

// Public route: Fetch all projects
router.get('/', projectsController.getProjects);
router.get('/:id', projectsController.getProjectById);

// Protected routes: Create & Delete projects (Admin only)

router.post(
    '/',
    requireApiAdmin,
    uploadMiddleware.fields([
        { name: 'graphics', maxCount: 10 },
        { name: 'coverPhoto', maxCount: 1 }
    ]),
    uploadHandler,
    projectsController.createProject
);


router.put(
    '/:id',
    requireApiAdmin,
    uploadMiddleware.fields([
        { name: 'graphics', maxCount: 10 },
        { name: 'coverPhoto', maxCount: 1 }
    ]),
    uploadHandler,
    projectsController.updateProject
);
// Global multer error handler
router.use(multerErrorHandler);

router.delete('/:id', requireApiAdmin, projectsController.deleteProject);

module.exports = router;
