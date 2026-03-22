const express = require('express');
const router = express.Router();
const messagesRoutes = require('./messages.routes');
const contactsRoutes = require('./contacts.routes');
const projectsRoutes = require('./projects.routes');
const creatorsRoutes = require('./creators.routes');
const { requireApiAdmin } = require('../middlewares/auth.middleware');
const adminStatsController = require('../controllers/adminStatsController');

// Mount routes
router.use('/messages', messagesRoutes);
router.use('/contacts', contactsRoutes);
router.use('/projects', projectsRoutes);
router.use('/creators', creatorsRoutes);
router.use('/clients', require('./clients.routes'));
router.use('/graphics', require('./graphics.routes'));
router.use('/feedback', require('./feedback.routes'));
router.use('/posts', require('./posts.routes'));

// Admin stats used by the SSR dashboard (JSON endpoint)
router.get('/admin/stats', requireApiAdmin, adminStatsController.getAdminStats);

module.exports = router;
