//const webhookModel = require('../models/webhookModel');
const getAllWebhooks = async () => {
  try {
    // const webhooks = await webhookModel.getAllWebhooks();
    // return webhooks;
    console.log('get all books');
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    throw error;
  }
};
const handleWebhook = async (payload) => {
  try {
    console.log('payload----------',payload);
    return true;
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
};
module.exports = {
  getAllWebhooks,
  handleWebhook
};