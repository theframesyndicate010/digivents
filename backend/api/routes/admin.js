const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const dashboardController = require('../controllers/dashboardController');
const messagesController = require('../controllers/messagesController');

// ============================================
// APPLY AUTHENTICATION MIDDLEWARE TO ALL ROUTES
// ============================================
router.use(authMiddleware);

// Dashboard - Dynamic with real data
router.get('/', dashboardController.getDashboard);

// ==========================================
// PROJECTS
// ==========================================
router.get('/projects', (req, res) => {
    res.render('admin/projects', { title: 'Projects', currentPage: 'projects', user: req.user });
});

router.get('/add-project', (req, res) => {
    res.render('admin/add-project', { title: 'Add Project', currentPage: 'projects', user: req.user });
});

// ==========================================
// CLIENTS
// ==========================================
router.get('/clients', (req, res) => {
    res.render('admin/clients', { title: 'Clients', currentPage: 'clients', user: req.user });
});

router.get('/add-client', (req, res) => {
    res.render('admin/add-client', { title: 'Add Client', currentPage: 'clients', user: req.user });
});

// ==========================================
// CREATORS (Was Authors)
// ==========================================
router.get('/creators', (req, res) => {
    res.render('admin/creators', { title: 'Creators', currentPage: 'creators', user: req.user });
});

router.get('/add-creator', (req, res) => {
    res.render('admin/add-creator', { title: 'Add Creator', currentPage: 'creators', user: req.user });
});

// ==========================================
// GRAPHICS
// ==========================================
router.get('/graphics', (req, res) => {
    res.render('admin/graphics', { title: 'Graphics', currentPage: 'graphics', user: req.user });
});

router.get('/add-graphic', (req, res) => {
    res.render('admin/add-graphic', { title: 'Add Graphic', currentPage: 'graphics', user: req.user });
});

// ==========================================
// MESSAGES & FEEDBACK
// ==========================================
router.get('/messages', messagesController.getMessages);

router.get('/contacts', (req, res) => {
    res.render('admin/contacts', { title: 'Contacts', currentPage: 'contacts', user: req.user });
});

router.get('/feedback', (req, res) => {
    res.render('admin/feedback', { title: 'Feedback', currentPage: 'feedback', user: req.user });
});

module.exports = router;
