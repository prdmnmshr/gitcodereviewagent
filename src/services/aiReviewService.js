const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_PATCH_CHARS = 6000;

const reviewFilePatch = async (filename, patch) => {
  const truncatedPatch = patch.length > MAX_PATCH_CHARS
    ? `${patch.slice(0, MAX_PATCH_CHARS)}\n... (diff truncated)`
    : patch;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 700,
    system:
      'You are a senior code reviewer. You are given a single file\'s unified git diff. ' +
      'Point out real defects: bugs, security issues, edge cases, and bad practices introduced by the diff. ' +
      'Ignore purely stylistic nitpicks unless they cause real problems. ' +
      'Reply in concise GitHub-flavored markdown bullet points. ' +
      'If the diff looks correct and has no notable issues, reply with exactly: "No significant issues found."',
    messages: [
      {
        role: 'user',
        content: `File: ${filename}\n\nDiff:\n\`\`\`diff\n${truncatedPatch}\n\`\`\``
      }
    ]
  });

  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim();
};

module.exports = {
  reviewFilePatch
};
