const crypto = require('crypto');
const axios = require('axios');

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
  }
});

const isSignatureValid = (rawBody, signatureHeader) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) return true; // no secret configured, skip verification
  if (!signatureHeader || !rawBody) return false;

  const expected = `sha256=${crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')}`;

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signatureHeader);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
};

const getCommitFiles = async (repoFullName, commitSha) => {
  const { data } = await githubApi.get(
    `/repos/${repoFullName}/commits/${commitSha}`
  );
  return data.files || [];
};

const postCommitComment = async (repoFullName, commitSha, body) => {
  await githubApi.post(
    `/repos/${repoFullName}/commits/${commitSha}/comments`,
    { body }
  );
};

module.exports = {
  isSignatureValid,
  getCommitFiles,
  postCommitComment
};
