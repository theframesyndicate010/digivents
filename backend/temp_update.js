const fs = require('fs');

// Add dependencies to admin.routes.js
let adminRoutes = fs.readFileSync('src/routes/admin.routes.js', 'utf8');

adminRoutes = `const express = require('express');
const router = express.Router();
const { requireWebAdmin } = require('../middlewares/auth.middleware');
const dashboardController = require('../controllers/dashboardController');
const messagesController = require('../controllers/adminMessagesController');

const projectService = require('../services/projectService');
const clientService = require('../services/clientService');
const creatorService = require('../services/creatorService');
const graphicService = require('../services/graphicService');
const feedbackService = require('../services/feedbackService');

// ============================================
// APPLY AUTHENTICATION MIDDLEWARE TO ALL ROUTES
// ============================================
router.use(requireWebAdmin);

router.get('/', dashboardController.getDashboard);

router.get('/projects', async (req, res) => {
    const projects = await projectService.getAllProjects();
    res.render('admin/projects', { title: 'Projects', currentPage: 'projects', user: req.user, projects });
});
router.get('/add-project', (req, res) => res.render('admin/add-project', { title: 'Add Project', currentPage: 'projects', user: req.user }));

router.get('/clients', async (req, res) => {
    const clients = await clientService.getAllClients();
    res.render('admin/clients', { title: 'Clients', currentPage: 'clients', user: req.user, clients });
});
router.get('/add-client', (req, res) => res.render('admin/add-client', { title: 'Add Client', currentPage: 'clients', user: req.user }));

router.get('/creators', async (req, res) => {
    const creators = await creatorService.getAllCreators();
    res.render('admin/creators', { title: 'Creators', currentPage: 'creators', user: req.user, creators });
});
router.get('/add-creator', (req, res) => res.render('admin/add-creator', { title: 'Add Creator', currentPage: 'creators', user: req.user }));

router.get('/graphics', async (req, res) => {
    const graphics = await graphicService.getAllGraphics();
    res.render('admin/graphics', { title: 'Graphics', currentPage: 'graphics', user: req.user, graphics });
});
router.get('/add-graphic', (req, res) => res.render('admin/add-graphic', { title: 'Add Graphic', currentPage: 'graphics', user: req.user }));

router.get('/messages', messagesController.getMessages);
// Alias for contacts if they hit it
router.get('/contacts', messagesController.getMessages);

router.get('/feedback', async (req, res) => {
    const feedback = await feedbackService.getAllFeedback();
    res.render('admin/feedback', { title: 'Feedback', currentPage: 'feedback', user: req.user, feedback });
});

module.exports = router;
`;

fs.writeFileSync('src/routes/admin.routes.js', adminRoutes);

console.log('admin.routes.js updated');
