const express = require('express');
const router = express.Router();
// Debug log for all /projects API hits
router.use((req, res, next) => {
  console.log(`[API] /projects${req.path} hit`);
  next();
});
const projectsController = require('../controllers/projectsController');
const { requireApiAdmin } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Public route: Fetch all projects
router.get('/', projectsController.getProjects);
router.get('/:id', projectsController.getProjectById);

// Protected routes: Create & Delete projects (Admin only)
router.post(
    '/', 
    requireApiAdmin, 
    upload.fields([
        { name: 'graphics', maxCount: 10 },
        { name: 'coverPhoto', maxCount: 1 }
    ]), 
    projectsController.createProject
);

router.put(
    '/:id',
    requireApiAdmin,
    upload.fields([
        { name: 'graphics', maxCount: 10 },
        { name: 'coverPhoto', maxCount: 1 }
    ]),
    projectsController.updateProject
);

router.delete('/:id', requireApiAdmin, projectsController.deleteProject);

module.exports = router;
