import { Client, GatewayIntentBits } from 'discord.js';
import { getVerse } from './api/v1/functions/verse';
import 'dotenv/config';
import { getVotd } from './api/v1/functions/votd';

const client = new Client({
  intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages],
});

const { EmbedBuilder } = require('discord.js');
const PREFIX = '!';

client.once('ready', () => {
  console.log('Bible Bot is online!');
});

client.on('messageCreate', async fetchBibleVerse => {
  if (fetchBibleVerse.author.bot) return;

  if (fetchBibleVerse.content.toLowerCase().startsWith(PREFIX + "getverse")) {
    const args = fetchBibleVerse.content.slice('!getverse'.length).trim().split(/ +/);

    if (args.length < 3) {
      const embed = new EmbedBuilder()
          .setColor('#f46d75')
          .setTitle('Invalid Request Format')
          .setDescription('Please provide `chapter`, `verse` and `translation (optional)` accordingly')
          .addFields({name: 'Usage', value: '`!getVerse John 3 16` or `!getVerse John 3 16 NLT`'})
          fetchBibleVerse.reply({ embeds: [embed] });
          return;
    }

    const book = args?.[0];
    const chapter = args?.[1];
    const verse = args?.[2];
    const translation = args?.[3] ?? "NIV";

    try {
      const fetchVerse = await getVerse(book, chapter, verse, translation);
      console.log(fetchVerse?.code)
      if (fetchVerse?.code === 400) {
         const embed = new EmbedBuilder()
        .setColor('#f46d75')
        .setTitle('Verse Not Found')
        .setDescription('Please provide existing book, chapter or verse reference from the bible')
        await fetchBibleVerse.reply({ embeds: [embed] });
          return;
      }
      else if (fetchVerse?.passage == undefined) {
        const embed = new EmbedBuilder()
          .setColor('#f46d75')
          .setTitle('Invalid Request Format')
          .setDescription('Please provide `chapter`, `verse` and `translation (optional)` accordingly')
          .addFields({name: 'Usage', value: '`!getVerse John 3 16` or `!getVerse John 3 16 NLT`'})
          await fetchBibleVerse.reply({ embeds: [embed] });
          return;
      }
      else {
        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle(fetchVerse?.citation)
          .setDescription(fetchVerse?.passage)
          await fetchBibleVerse.reply({ embeds: [embed] });
      }
    } catch (error) {
      await fetchBibleVerse.reply(`Error fetching bible verse...`);
    }

  }

});

client.on('messageCreate', async votd =>{
  if (votd.author.bot) return;

  if (votd.content.toLowerCase().startsWith(PREFIX + "getvotd")) {
    try {
      console.log("fetching votd...")
     const fetchVotd = await getVotd();
     const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle(fetchVotd?.citation)
          .setDescription(fetchVotd?.passage)
      // Check if there's an image to display
      if (fetchVotd?.image && fetchVotd?.image.length > 0) {
        embed.setImage(fetchVotd?.image[0]); // Use the first image from the array
      }
          await votd?.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching verse:', error);
      await votd.reply('Error fetching verse of the day...');
    };
  }
});

client.on('messageCreate', async help => {
  if (help.author.bot) return;

  const embed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('BibleBot Help')
          .setDescription('Welcome to BibleBot! Here are the commands you can use:')
          .addFields(
            { name: '!getVotd', value: 'Retrieves the Verse of the Day.' },
            { name: '!getVerse <Book> <Chapter> <Verse> <Translation>', value: 'Searches for a specific verse in the Bible.\nExample Usage:\n`!getVerse John 3 16`\n`!getVerse John 3 16 KJV`' },
          )

  if (help.content.toLowerCase() === PREFIX + "help") {
    await help.reply({ embeds: [embed]});
  }
});

client.on('messageCreate', async info => {
  if (info.author.bot) return;

  const embed = new EmbedBuilder()
          .setColor('#A020F0')
          .setTitle('BibleBot Overview')
          .setDescription('Welcome to the BibleBot! This bot is designed to help you explore and engage with the Bible in a convenient and interactive way. Whether you are looking for the verse of the day, searching for specific Bible verses, or need a quick reference, BibleBot is here to assist you.')

  if (info.content.toLowerCase() === PREFIX + "info") {
    await info.reply({ embeds: [embed]});
  }
});


export default client;