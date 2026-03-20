const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const validate = require('../middlewares/validate.middleware');
const { createMessageSchema } = require('../middlewares/validation/message.schema');

// Public route to submit a new contact message
router.post('/', validate(createMessageSchema), messagesController.createMessage);

module.exports = router;
