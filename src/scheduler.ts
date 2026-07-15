import cron from 'node-cron';
import { CoachBot } from './bot.js';

export function setupDailySchedule(bot: CoachBot) {
  cron.schedule('0 9 * * *', async () => {
    console.error('Sending daily reminder...');
    await bot.sendDailyReminder();
  }, { timezone: 'Europe/Berlin' });
  console.error('Daily schedule activated: 9:00 AM CET');
}
