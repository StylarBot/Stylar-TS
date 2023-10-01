import fs from 'fs';
import log from './logger';

export default async function handleCmds(client: any): Promise<void> {
    let commandsArray: any[] = [];

    const folders: string[] = fs.readdirSync(`./src/Commands`);

    for (const folder of folders) {
        const files: string[] = fs.readdirSync(`./src/Commands/${folder}`).filter((file: string) => file.endsWith(".js"));

        for (const file of files) {
            const command = require(`../Commands/${folder}/${file}`);

            client.commands.set(command.data.name, command);

            commandsArray.push(command.data.toJSON());

            continue;
        }
    }

    client.application.commands.set(commandsArray);

    log(`Commands Loaded.`, false);
}