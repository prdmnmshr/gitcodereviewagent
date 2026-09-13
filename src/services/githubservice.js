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

const getFileContent = async (repoFullName, filePath) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${repoFullName}/contents/${filePath}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        }
      }
    );

    const content = Buffer.from(
      response.data.content,
      'base64'
    ).toString('utf-8');

    return content;

  } catch (error) {
    console.error(
      'Error fetching file content:',
      error.response?.data || error.message
    );

    throw error;
  }
};

const handleWebhook = async (payload) => {
  try {
    const repoFullName = payload.repository.full_name;

    const files = payload.head_commit?.modified || [];

    for (const filePath of files) {
      const content = await getFileContent(
        repoFullName,
        filePath
      );

      console.log('File:', filePath);
      console.log('Content:', content);
    }

  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
};

module.exports = {
  getAllWebhooks,
  handleWebhook,
  getFileContent
};