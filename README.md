# AI Git Code Review Agent

An automated code review agent for GitHub. It listens for `push` events via a
webhook, fetches the diff for each new commit, sends the changed files to
OpenAI for review, and posts the findings back to GitHub as a comment on the
commit — so you get automatic feedback on bugs, security issues, and edge
cases as soon as code is pushed.

## How it works

1. GitHub sends a `push` webhook event to this app whenever new commits land
   on the repository.
2. The app verifies the webhook signature (`X-Hub-Signature-256`) against
   `GITHUB_WEBHOOK_SECRET` to make sure the request really came from GitHub.
3. It acknowledges the webhook immediately, then in the background:
   - Fetches the diff for each commit via the GitHub REST API.
   - Sends each changed file's patch to OpenAI for review.
   - Posts a single aggregated review comment back on the commit.

## Project structure

```
index.js                          # app entry point (loads env, starts the server)
src/
  routes/webhookRoute.js          # POST /api/webhook
  controllers/webhookcontrollers.js  # verifies signature, kicks off the review
  services/githubService.js       # GitHub API: signature check, diffs, comments
  services/aiReviewService.js     # sends diffs to OpenAI and returns the review
  services/webhookService.js      # orchestrates the push -> review -> comment flow
```

## Requirements

- Node.js 18+
- A GitHub personal access token with `repo` scope
- An OpenAI API key

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `example.env` to `.env` and fill in the values:

   ```bash
   cp example.env .env
   ```

   | Variable                | Description                                                       |
   | ------------------------ | ------------------------------------------------------------------ |
   | `PORT`                   | Port the server listens on (default `8080`)                       |
   | `GITHUB_TOKEN`            | GitHub token used to fetch commit diffs and post review comments  |
   | `GITHUB_WEBHOOK_SECRET`   | Secret shared with the GitHub webhook, used to verify payloads    |
   | `OPENAI_API_KEY`          | API key used to run the AI code review                            |
   | `OPENAI_MODEL`            | Optional: override the default model (`gpt-4o-mini`)               |

3. Start the server:

   ```bash
   npm start        # node index.js
   npm run dev      # node --watch index.js, restarts on file changes
   ```

## Configuring the GitHub webhook

In your repository: **Settings → Webhooks → Add webhook**

- **Payload URL**: `https://<your-host>/api/webhook`
- **Content type**: `application/json`
- **Secret**: same value as `GITHUB_WEBHOOK_SECRET`
- **Events**: "Just the push event"

For local development, expose your server with `ngrok` (already included as a
dependency) and use the generated URL as the payload URL.

## Testing it

Push a commit to the repository. Within a few seconds you should see a new
comment on the commit in GitHub summarizing any issues OpenAI found in the
diff. If none are found, it reports "No significant issues found."
