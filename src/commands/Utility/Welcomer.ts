import { Command } from '../../structures/Command';
import Welcomer from '../../models/Welcomer';
import { ApplicationCommandOptionType, ChannelType } from 'discord.js';
import Reply from '../../functions/Reply';

export default new Command({
    name: 'welcomer',
    description: 'Setup the welcome system!',
    options: [
        {
            name: 'setup',
            description: 'Setup the welcome system!',
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want welcome messages to be sent to!',
                    required: true,
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText]
                }
            ],
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'disable',
            description: 'Disable the welcome system!',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'editchannel',
            description: 'Edit the channel used in the welcome system!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The new welcome channel!',
                    required: true,
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText]
                }
            ]
        }
    ],

    run: async({ interaction, guild, opts, client }) => {
        const sub = opts.getSubcommand();
        const channel = opts.getChannel('channel') || interaction.channel;
        const validchannel = await guild.channels.cache.get(channel.id);

        switch(sub) {
            case 'setup': {
                const wc = await Welcomer.findOne({ Guild: guild.id });
                if(wc) throw "The welcome system is already set up.";

                await Welcomer.create({
                    Guild: guild.id,
                    Channel: validchannel.id,
                });

                return Reply(interaction, `Successfully set <#${validchannel.id}> as the welcome channel.`, '✅', true);
            }
            break;

            case 'disable': {
                const wc = await Welcomer.findOne({ Guild: guild.id });
                if(!wc) throw "The welcome system is not set up.";

                await wc.deleteOne();

                return Reply(interaction, `Successfully disabled the Welcomer system.`, '✅', true);
            }
            break;

            case 'editchannel': {
                const wc = await Welcomer.findOne({ Guild: guild.id });
                if(!wc) throw "The welcome system is not set up.";

                wc.Channel = validchannel.id;
                wc.save();

                return Reply(interaction, `Successfully set the new welcome channel to <#${validchannel.id}>.`, '✅', true);
            }
            break;
        }
    }
})