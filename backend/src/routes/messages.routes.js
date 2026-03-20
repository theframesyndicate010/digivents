const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const { requireApiAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createMessageSchema, updateMessageSchema } = require('../middlewares/validation/message.schema');

// Public route to submit a new message
router.post('/', validate(createMessageSchema), messagesController.createMessage);

// Protected routes (Admin only)
router.get('/', requireApiAdmin, messagesController.getMessages);
router.put('/:id', requireApiAdmin, validate(updateMessageSchema), messagesController.updateMessage);
router.delete('/:id', requireApiAdmin, messagesController.deleteMessage);

module.exports = router;
