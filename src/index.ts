import dotenv from 'dotenv';
import { CoachBot } from './bot.js';
import { setupDailySchedule } from './scheduler.js';

dotenv.config();

const bot = new CoachBot(
  process.env.DISCORD_TOKEN!,
  process.env.CRAFT_API_URL!,
  process.env.CRAFT_API_KEY!,
  process.env.DISCORD_CHANNEL_ID!
);

await bot.start(process.env.DISCORD_TOKEN!);
setupDailySchedule(bot);
