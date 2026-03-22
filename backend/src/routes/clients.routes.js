const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');
const { requireApiAdmin } = require('../middlewares/auth.middleware');
const { multerErrorHandler } = require('../middlewares/upload.middleware');

// Public route: Fetch all clients
router.get('/', clientsController.getClients);
router.get('/:id', clientsController.getClientById);

// Protected routes (Admin only)
router.post('/', requireApiAdmin, clientsController.createClient);
router.put('/:id', requireApiAdmin, clientsController.updateClient);
router.delete('/:id', requireApiAdmin, clientsController.deleteClient);


// Global multer error handler
router.use(multerErrorHandler);

module.exports = router;
