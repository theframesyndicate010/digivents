const express = require('express');
const path = require('path');
const router = express.Router();
const { requireWebAdmin } = require('../middlewares/auth.middleware');
const dashboardController = require('../controllers/dashboardController');
const messagesController = require('../controllers/adminMessagesController');

// ============================================
// APPLY AUTHENTICATION MIDDLEWARE TO ALL ROUTES
// ============================================
router.use(requireWebAdmin);

router.get('/', dashboardController.getDashboard);
router.get('/dashboard', dashboardController.getDashboard);

router.get('/projects', (req, res) => {
    res.render('admin/projects', { title: 'Projects', currentPage: 'projects', user: req.user });
});
router.get('/add-project', (req, res) => res.render('admin/add-project', { title: 'Add Project', currentPage: 'projects', user: req.user }));
router.get('/edit-project/:id', (req, res) => res.render('admin/edit-project', { title: 'Edit Project', currentPage: 'projects', user: req.user }));

router.get('/clients', (req, res) => {
    res.render('admin/clients', { title: 'Clients', currentPage: 'clients', user: req.user });
});
router.get('/add-client', (req, res) => res.render('admin/add-client', { title: 'Add Client', currentPage: 'clients', user: req.user }));
router.get('/edit-client/:id', (req, res) => res.render('admin/edit-client', { title: 'Edit Client', currentPage: 'clients', user: req.user }));

router.get('/creators', (req, res) => {
    res.render('admin/creators', { title: 'Creators', currentPage: 'creators', user: req.user });
});
router.get('/add-creator', (req, res) => res.render('admin/add-creator', { title: 'Add Creator', currentPage: 'creators', user: req.user }));
router.get('/edit-creator/:id', (req, res) => res.render('admin/edit-creator', { title: 'Edit Creator', currentPage: 'creators', user: req.user }));

router.get('/graphics', (req, res) => {
    res.render('admin/graphics', { title: 'Graphics', currentPage: 'graphics', user: req.user });
});
router.get('/add-graphic', (req, res) => res.render('admin/add-graphic', { title: 'Add Graphic', currentPage: 'graphics', user: req.user }));
router.get('/edit-graphic/:id', (req, res) => res.render('admin/edit-graphic', { title: 'Edit Graphic', currentPage: 'graphics', user: req.user }));

router.get('/messages', messagesController.getMessages);
// Alias for contacts if they hit it
router.get('/contacts', messagesController.getMessages);

router.get('/feedback', (req, res) => {
    res.render('admin/feedback', { title: 'Feedback', currentPage: 'feedback', user: req.user });
});

// ============================================
// STANDALONE HTML ADMIN PANEL ROUTES
// ============================================
router.get('/html/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/dashboard.html'));
});

router.get('/html/client', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/client.html'));
});

router.get('/html/project', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/project.html'));
});

router.get('/html/creator', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/creator.html'));
});

router.get('/html/graphics', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/graphics.html'));
});

router.get('/html/message', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/message.html'));
});

module.exports = router;
