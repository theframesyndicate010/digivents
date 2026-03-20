const express = require('express');
const router = express.Router();
// Debug log for all /clients API hits
router.use((req, res, next) => {
  console.log(`[API] /clients${req.path} hit`);
  next();
});
const clientsController = require('../controllers/clientsController');
const { requireApiAdmin } = require('../middlewares/auth.middleware');

// Public route: Fetch all clients
router.get('/', clientsController.getClients);
router.get('/:id', clientsController.getClientById);

// Protected routes (Admin only)
router.post('/', requireApiAdmin, clientsController.createClient);
router.put('/:id', requireApiAdmin, clientsController.updateClient);
router.delete('/:id', requireApiAdmin, clientsController.deleteClient);

module.exports = router;
