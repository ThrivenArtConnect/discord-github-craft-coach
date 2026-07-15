import { Probot } from 'probot';
import { CraftClient } from './craft-client.js';

export default (app: Probot) => {
  const craft = new CraftClient(
    process.env.CRAFT_API_URL!,
    process.env.CRAFT_API_KEY!
  );

  app.on('pull_request.opened', async (context) => {
    const pr = context.payload.pull_request;
    await craft.addCheckInNote(
      `## 🔀 Neuer Pull Request\n\n**Titel:** ${pr.title}\n**URL:** ${pr.html_url}\n**Von:** @${pr.user.login}`
    );
  });

  app.on('push', async (context) => {
    for (const commit of context.payload.commits) {
      const taskMatch = commit.message.match(/#task-(\w+)/);
      if (taskMatch) {
        await craft.updateTask(taskMatch[1], 'done');
      }
    }
  });

  app.on('issues.closed', async (context) => {
    const issue = context.payload.issue;
    await craft.addCheckInNote(
      `## ✅ Issue geschlossen\n\n**#${issue.number}:** ${issue.title}\n**Assignee:** @${(issue as any).assignee?.login || 'niemand'}`
    );
  });
};
