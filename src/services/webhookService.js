//const webhookModel = require('../models/webhookModel');
const axios = require("axios");
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
    console.log('payload-----------------',payload)
    const repoFullName = payload.repository.full_name;
    const commitSha = payload.head_commit.id;
    const response = await axios.get(
        `https://api.github.com/repos/${repoFullName}/commits/${commitSha}`,
        {

            headers: {

                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,

                Accept: "application/vnd.github+json",

            },

        }

    );

    console.log("Changed files:", response.data.files);

    return response.data.files;
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
};
module.exports = {
  getAllWebhooks,
  handleWebhook
};