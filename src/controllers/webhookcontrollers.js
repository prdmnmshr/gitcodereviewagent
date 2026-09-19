const githubService = require('../services/githubService');
const webhookService = require('../services/webhookService');

const handleWebhook = async (req, res) => {
  const signature = req.headers['x-hub-signature-256'];

  if (!githubService.isSignatureValid(req.rawBody, signature)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid webhook signature'
    });
  }


  const event = req.headers['x-github-event'];

  // Ack immediately so GitHub doesn't time out; review runs in the background.
  res.status(202).json({
    success: true,
    message: 'Webhook received, review in progress'
  });

  if (event !== 'push') {
    console.log(`Ignoring unsupported event: ${event}`);
    return;
  }

  try {
    await webhookService.handlePushEvent(req.body);
  } catch (error) {
    console.error('Webhook processing error:', error.message);
  }
};

module.exports = {
  handleWebhook
};
