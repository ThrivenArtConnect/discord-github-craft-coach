import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { CraftClient } from './craft-client.js';

export class CoachBot {
  private client: Client;
  private craft: CraftClient;
  private checkInChannelId: string;

  constructor(
    token: string,
    craftApiUrl: string,
    craftApiKey: string,
    channelId: string
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });
    this.craft = new CraftClient(craftApiUrl, craftApiKey);
    this.checkInChannelId = channelId;
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on('ready', () => {
      console.error(`Bot logged in as ${this.client.user?.tag}`);
    });

    this.client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      if (message.content.startsWith('!checkin')) await this.handleCheckIn(message);
      if (message.content.startsWith('!done')) await this.handleTaskDone(message);
      if (message.content.startsWith('!today')) await this.handleTodaySummary(message);
    });
  }

  private async handleCheckIn(message: any) {
    const content = message.content.replace('!checkin', '').trim();
    await this.craft.addCheckInNote(
      `## Discord Check-in (${new Date().toLocaleTimeString('de-DE')})\n\n${content}`
    );
    await message.reply('✅ Check-in gespeichert in deinen Daily Notes!');
  }

  private async handleTaskDone(message: any) {
    const taskDescription = message.content.replace('!done', '').trim();
    const tasksData = await this.craft.getTodaysTasks();
    const matchingTask = tasksData.items?.find((task: any) =>
      task.markdown?.includes(taskDescription)
    );
    if (matchingTask) {
      await this.craft.updateTask(matchingTask.id, 'done');
      await message.reply(`✅ Task "${taskDescription}" als erledigt markiert!`);
    } else {
      await message.reply(`❌ Task nicht gefunden. Nutze !today um Tasks zu sehen.`);
    }
  }

  private async handleTodaySummary(message: any) {
    const [tasks, notes] = await Promise.all([
      this.craft.getTodaysTasks(),
      this.craft.getTodaysNotes()
    ]);
    let summary = '📋 **Deine heutige Übersicht:**\n\n**Aktive Tasks:**\n';
    (tasks.items || []).forEach((task: any) => { summary += `- ${task.markdown}\n`; });
    summary += '\n**Notizen:**\n' + (notes.markdown?.substring(0, 500) || 'Keine Notizen');
    await message.reply(summary);
  }

  async sendDailyReminder() {
    const channel = await this.client.channels.fetch(this.checkInChannelId) as TextChannel;
    const tasks = await this.craft.getTodaysTasks();
    let msg = '🌅 **Guten Morgen! Zeit für deinen Daily Check-in**\n\n';
    msg += `Du hast ${tasks.items?.length || 0} offene Tasks heute.\n\n`;
    msg += 'Nutze `!checkin <dein text>` für dein Update!';
    await channel.send(msg);
  }

  async start(token: string) {
    await this.client.login(token);
  }
}
