const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MAX_PATCH_CHARS = 6000;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const reviewFilePatch = async (filename, patch) => {
  const truncatedPatch = patch.length > MAX_PATCH_CHARS
    ? `${patch.slice(0, MAX_PATCH_CHARS)}\n... (diff truncated)`
    : patch;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    max_tokens: 700,
    messages: [
      {
        role: 'system',
        content:
          'You are a senior code reviewer. You are given a single file\'s unified git diff. ' +
          'Point out real defects: bugs, security issues, edge cases, and bad practices introduced by the diff. ' +
          'Ignore purely stylistic nitpicks unless they cause real problems. ' +
          'Reply in concise GitHub-flavored markdown bullet points. ' +
          'If the diff looks correct and has no notable issues, reply with exactly: "No significant issues found."'
      },
      {
        role: 'user',
        content: `File: ${filename}\n\nDiff:\n\`\`\`diff\n${truncatedPatch}\n\`\`\``
      }
    ]
  });

  return completion.choices[0]?.message?.content?.trim() || 'No significant issues found.';
};

module.exports = {
  reviewFilePatch
};
