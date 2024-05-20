import { Client, GatewayIntentBits } from 'discord.js';
import { getVerse } from './api/v1/functions/verse';
import 'dotenv/config';

const client = new Client({
  intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages],
});

client.once('ready', () => {
  console.log('Bible Bot is online!');
});

export default client;