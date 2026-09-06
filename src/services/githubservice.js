//const webhookModel = require('../models/webhookModel');

const getAllWebhooks = async () => {
  try {
    //const webhooks = await webhookModel.getAllWebhooks();
    console.log('webhook services getAllWebhooks');
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    throw error;
  }
};

const handleWebhook = async (payload) => {
  try {
    // Business logic goes here

    //const webhook = await webhookModel.createWebhook(payload);

    //return webhook;
    console.log('handleWebhook----------');
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
};

module.exports = {
  getAllWebhooks,
  handleWebhook
};