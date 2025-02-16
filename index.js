const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildExpressions
    ]
});

const GUILD_IDS = [
    'putaguildidhere',
    'putaguildidhere',
    'putaguildidhere',
    'putaguildidhere'
];

async function compareImages(url1, url2) {
    try {
        const [response1, response2] = await Promise.all([
            axios.get(url1, { responseType: 'arraybuffer' }),
            axios.get(url2, { responseType: 'arraybuffer' })
        ]);
        
        // Compare the raw image data
        return Buffer.from(response1.data).toString('base64') === Buffer.from(response2.data).toString('base64');
    } catch (error) {
        console.error('Error comparing images:', error);
        return false;
    }
}

async function processGuildEmojis() {
    try {
        const guildCache = new Map();
        const emojiStore = [];

        for (const guildId of GUILD_IDS) {
            const guild = await client.guilds.fetch(guildId);
            guildCache.set(guildId, guild);
            const emojis = await guild.emojis.fetch();
            
            emojis.forEach(emoji => {
                emojiStore.push({
                    id: emoji.id,
                    name: emoji.name,
                    url: emoji.url,
                    guildId: guildId,
                    emoji: emoji
                });
            });
        }

        console.log(`Found ${emojiStore.length} total emojis`);

        const duplicateGroups = await findDuplicateGroups(emojiStore);
        console.log(`Found ${duplicateGroups.length} groups of duplicates`);

        for (const group of duplicateGroups) {
            console.log(`\nProcessing duplicate group:`);
            
            // Keep the first emoji, delete the rest
            const keepEmoji = group[0];
            console.log(`Keeping: ${keepEmoji.name} in guild ${keepEmoji.guildId}`);
            
            // Delete all other emojis in the group
            for (let i = 1; i < group.length; i++) {
                const deleteEmoji = group[i];
                try {
                    const guild = guildCache.get(deleteEmoji.guildId);
                    const guildEmoji = await guild.emojis.fetch(deleteEmoji.id);
                    await guildEmoji.delete();
                    console.log(`Deleted: ${deleteEmoji.name} from guild ${deleteEmoji.guildId}`);
                } catch (error) {
                    console.error(`Failed to delete emoji ${deleteEmoji.name}:`, error.message);
                }
            }
        }

        console.log('\nDuplicate removal complete!');

    } catch (error) {
        console.error('Error processing emojis:', error);
    } finally {
        client.destroy();
    }
}

async function findDuplicateGroups(emojis) {
    const groups = [];
    const processed = new Set();

    for (let i = 0; i < emojis.length; i++) {
        if (processed.has(i)) continue;
        
        const group = [emojis[i]];

        for (let j = i + 1; j < emojis.length; j++) {
            if (processed.has(j)) continue;
            
            if (await compareImages(emojis[i].url, emojis[j].url)) {
                group.push(emojis[j]);
                processed.add(j);
            }
        }

        if (group.length > 1) {
            groups.push(group);
        }
    }

    return groups;
}

client.once('ready', () => {
    console.log('Bot is ready! Starting emoji processing...');
    processGuildEmojis();
});

client.login(process.env.DISCORD_TOKEN); 
