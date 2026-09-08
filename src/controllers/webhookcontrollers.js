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

        console.log("Webhook Payload:", req.body);

        const files = await await webhookService.handleWebhook(req.body);
        return res.status(200).json({
            success: true,

            message: "Webhook processed successfully",

            files

        });

    } catch (error) {

        console.error("Webhook Error:", error.message);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {
  getAllWebhooks,
  handleWebhook
};