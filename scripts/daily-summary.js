import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function generateDailySummary() {
  const events = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/events`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json'
      }
    }
  ).then(r => r.json());

  const prs = events.filter(e => e.type === 'PullRequestEvent').length;
  const commits = events.filter(e => e.type === 'PushEvent').length;
  const issues = events.filter(e => e.type === 'IssuesEvent').length;

  const summary = `## 📊 GitHub Tageszusammenfassung\n\n**PRs:** ${prs}\n**Commits:** ${commits}\n**Issues:** ${issues}\n**Top Contributor:** ${getMostActiveUser(events)}`;

  await fetch(`${process.env.CRAFT_API_URL}/blocks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CRAFT_API_KEY}`
    },
    body: JSON.stringify({
      blocks: [{ type: 'text', markdown: summary }],
      position: { position: 'end', date: 'today' }
    })
  });

  console.log('Summary sent to Craft!');
}

function getMostActiveUser(events) {
  const counts = {};
  events.forEach(e => {
    const user = e.actor?.login;
    if (user) counts[user] = (counts[user] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || 'N/A';
}

generateDailySummary().catch(console.error);
