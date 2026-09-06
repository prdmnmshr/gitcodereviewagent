const express = require('express');

const router = express.Router();

const webhookController = require('../controllers/webhookcontrollers');

router.get('/', webhookController.getAllWebhooks);

router.post('/handle', webhookController.handleWebhook);

module.exports = router;