import Channel from "../../functions/Channel";
import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType } from "discord.js";

export default new Command({
    name: 'channel',
    description: 'Channel management commands!',
    options: [
        {
            name: 'text',
            description: 'Text channel management commands!',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'lock',
                    description: 'Lock a text channel!',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'channel',
                            description: 'The channel you want to lock!',
                            required: true,
                            type: ApplicationCommandOptionType.Channel,
                        },
                    ]
                },
            ]
        },
        {
            name: 'lock',
            description: 'Lock a channel!',
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],

    run: async({ interaction, client, guild, opts }) => {
        
    }
})