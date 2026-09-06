const webhookService = require('../services/webhookService');

const getAllWebhooks = async (req, res) => {
  try {
    const webhooks = await webhookService.getAllWebhooks();

    res.status(200).json({
      success: true,
      data: webhooks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const handleWebhook = async (req, res) => {
  try {
    console.log('handleWebhook---- controller--');
    const result = await webhookService.handleWebhook(req.body);

    res.status(200).json({
      success: true,
      data: result,
      message:"webhook received"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllWebhooks,
  handleWebhook
};