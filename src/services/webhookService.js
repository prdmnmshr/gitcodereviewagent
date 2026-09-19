const githubService = require('./githubService');
const aiReviewService = require('./aiReviewService');

const reviewCommit = async (repoFullName, commitSha) => {
  const files = await githubService.getCommitFiles(repoFullName, commitSha);

  const reviews = [];
  for (const file of files) {
    if (!file.patch) continue; // binary or too large to diff

    const review = await aiReviewService.reviewFilePatch(
      file.filename,
      file.patch
    );

    reviews.push({ filename: file.filename, review });
  }

  return reviews;
};

const formatComment = (commitSha, reviews) => {
  const header = `### 🤖 AI Code Review for \`${commitSha.slice(0, 7)}\`\n`;

  if (reviews.length === 0) {
    return `${header}\nNo reviewable text diffs found in this commit.`;
  }

  const body = reviews
    .map(({ filename, review }) => `**\`${filename}\`**\n${review}`)
    .join('\n\n---\n\n');

  return `${header}\n${body}`;
};

const handlePushEvent = async (payload) => {
  if (payload.deleted) {
    console.log('Branch deleted, skipping review');
    return;
  }

  const repoFullName = payload.repository?.full_name;
  const commits = payload.commits || [];

  if (!repoFullName || commits.length === 0) {
    console.log('No commits to review for this push');
    return;
  }

  for (const commit of commits) {
    try {
      console.log(`Reviewing commit ${commit.id} in ${repoFullName}`);

      const reviews = await reviewCommit(repoFullName, commit.id);
      const comment = formatComment(commit.id, reviews);

      await githubService.postCommitComment(repoFullName, commit.id, comment);

      console.log(`Posted review comment on commit ${commit.id}`);
    } catch (error) {
      console.error(
        `Failed to review commit ${commit.id}:`,
        error.response?.data || error.message
      );
    }
  }
};

module.exports = {
  handlePushEvent
};
