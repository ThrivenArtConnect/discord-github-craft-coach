import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { CraftClient } from './craft-client.js';

const craft = new CraftClient(
  process.env.CRAFT_API_URL!,
  process.env.CRAFT_API_KEY!
);

const server = new McpServer({ name: 'craft-coach', version: '1.0.0' });

server.registerTool(
  'get_daily_summary',
  {
    description: "Get summary of today's notes and tasks from Craft",
    inputSchema: {
      date: z.string().optional().describe('Date in YYYY-MM-DD or "today"')
    }
  },
  async ({ date = 'today' }) => {
    const [tasks, notes] = await Promise.all([
      craft.getTodaysTasks(),
      craft.getTodaysNotes(date)
    ]);
    return {
      content: [{
        type: 'text',
        text: `Tasks: ${tasks.items?.length || 0}\nNotes: ${notes.markdown?.length || 0} chars`
      }]
    };
  }
);

server.registerTool(
  'add_checkin',
  {
    description: 'Add a check-in note to Craft daily notes',
    inputSchema: { content: z.string().describe('Check-in content') }
  },
  async ({ content }) => {
    await craft.addCheckInNote(content);
    return { content: [{ type: 'text', text: 'Check-in added successfully' }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server running...');
}

main();
