import { Client, IntentsBitField } from 'discord.js';
import { Collection } from 'discord.js';
import { config } from 'dotenv';
import handleEvents from './eventhandler';
import handleCmds from './commandhandler';
import handleMongo from './mongohandler';

class StylarClient {
    async init({ token }: { token: string }) {
        config(); // Load environment variables from .env

        const client = new Client({
            intents: [
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.MessageContent,
                IntentsBitField.Flags.GuildEmojisAndStickers,
                IntentsBitField.Flags.GuildModeration,
                IntentsBitField.Flags.GuildPresences,
                IntentsBitField.Flags.Guilds,
            ],
        });

        client.commands = new Collection();

        client.login(process.env.TOKEN).then(() => {
            handleEvents(client);
            handleCmds(client);
            handleMongo(process.env.MONGO);
        });
    }
}

export { StylarClient };