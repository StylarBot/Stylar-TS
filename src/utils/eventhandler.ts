import fs from 'fs';
import log from './logger';

export default async function handleEvents(client: any): Promise<void> {
    const eventsfolders: string[] = fs.readdirSync(`./src/events`);

    for (const folder of eventsfolders) {
        const files: string[] = fs.readdirSync(`./src/events/${folder}`).filter((file: string) => file.endsWith(".js"));

        for (const file of files) {
            const event = require(`../events/${folder}/${file}`);

            if(event.rest) {
                if(event.once) client.rest.once(event.name, (...args: any[]) => event.execute(...args, client));
                else client.rest.on(event.name, (...args: any[]) => event.execute(...args, client));
            } else {
                if(event.once) client.once(event.name, (...args: any[]) => event.execute(...args, client));
                else client.on(event.name, (...args: any[]) => event.execute(...args, client));
            }
        }

        continue;
    }

    log(`Evenyts Loaded.`, false);
}