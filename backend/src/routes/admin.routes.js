const express = require('express');
const router = express.Router();

const { requireWebAdmin } = require('../middlewares/auth.middleware');
const dashboardController = require('../controllers/dashboardController');

// ============================================
// GLOBAL ADMIN AUTH MIDDLEWARE
// ============================================
router.use(requireWebAdmin);

// ============================================
// MESSAGES
// ============================================
router.get(['/messages', '/message'], (req, res) => {
    res.render('admin/messages', {
        title: 'Messages',
        currentPage: 'messages',
        user: req.user || null
    });
});

// ============================================
// DASHBOARD
// ============================================
router.get(['/', '/dashboard'], async (req, res) => {
    try {
        return dashboardController.getDashboard(req, res);
    } catch (err) {
        console.error('[DASHBOARD ERROR]', err);
        res.status(500).send('Dashboard error');
    }
});

// ============================================
// PROJECTS
// ============================================
router.get('/projects', (req, res) => {
    res.render('admin/projects', {
        title: 'Projects',
        currentPage: 'projects',
        user: req.user || null
    });
});

router.get('/add-project', (req, res) => {
    res.render('admin/add-project', {
        title: 'Add Project',
        currentPage: 'projects',
        user: req.user || null
    });
});

router.get('/edit-project/:id', (req, res) => {
    res.render('admin/edit-project', {
        title: 'Edit Project',
        currentPage: 'projects',
        user: req.user || null,
        id: req.params.id
    });
});

// ============================================
// CLIENTS
// ============================================
router.get('/clients', (req, res) => {
    res.render('admin/clients', {
        title: 'Clients',
        currentPage: 'clients',
        user: req.user || null
    });
});

router.get('/add-client', (req, res) => {
    res.render('admin/add-client', {
        title: 'Add Client',
        currentPage: 'clients',
        user: req.user || null
    });
});

router.get('/edit-client/:id', (req, res) => {
    res.render('admin/edit-client', {
        title: 'Edit Client',
        currentPage: 'clients',
        user: req.user || null,
        id: req.params.id
    });
});

// ============================================
// CREATORS
// ============================================
router.get('/creators', (req, res) => {
    res.render('admin/creators', {
        title: 'Creators',
        currentPage: 'creators',
        user: req.user || null
    });
});

router.get('/add-creator', (req, res) => {
    res.render('admin/add-creator', {
        title: 'Add Creator',
        currentPage: 'creators',
        user: req.user || null
    });
});

router.get('/edit-creator/:id', (req, res) => {
    res.render('admin/edit-creator', {
        title: 'Edit Creator',
        currentPage: 'creators',
        user: req.user || null,
        id: req.params.id
    });
});

// ============================================
// GRAPHICS
// ============================================
router.get('/graphics', (req, res) => {
    res.render('admin/graphics', {
        title: 'Graphics',
        currentPage: 'graphics',
        user: req.user || null
    });
});

router.get('/add-graphic', (req, res) => {
    res.render('admin/add-graphic', {
        title: 'Add Graphic',
        currentPage: 'graphics',
        user: req.user || null
    });
});

router.get('/edit-graphic/:id', (req, res) => {
    res.render('admin/edit-graphic', {
        title: 'Edit Graphic',
        currentPage: 'graphics',
        user: req.user || null,
        id: req.params.id
    });
});



module.exports = router;