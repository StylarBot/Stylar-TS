import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import ar from '../../models/Autoreact';
import Reply from "../../functions/Reply";

export default new Command({
    name: 'autoreact',
    description: 'Manage autoreactions in your server!',
    userPermissions: ['ManageChannels'],
    options: [
        {
            name: 'addchannel',
            description: 'Add a channel to the auto reaction system!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to add!',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
                {
                    name: 'emoji',
                    description: 'The emoji you want messages to be reacted with!',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
        },
        {
            name: 'addemoji',
            description: 'Add another auto reaction to a channel!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to add the emoji to!',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
                {
                    name: 'emoji',
                    description: 'The emoji you want messages to be reacted with!',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
        },
        {
            name: 'removeemoji',
            description: 'Remove an emoji from an auto reaction!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to remove the emoji from!',
                    type: ApplicationCommandOptionType.Channel,
                },
                {
                    name: 'emoji',
                    description: 'The emoji that you want to remove!',
                    type: ApplicationCommandOptionType.String,
                }
            ]
        },
        {
            name: 'removechannel',
            description: 'Remove a channel from the auto reaction system!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to remove!',
                    type: ApplicationCommandOptionType.Channel,
                }
            ]
        },
        {
            name: 'removeall',
            description: 'Remove all auto reactions from the server!',
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],

    run: async({ interaction, guild, opts }) => {
        const sub = opts.getSubcommand();
        const channel = opts.getChannel('channel') || interaction.channel;
        const validchannel = await guild.channels.cache.get(channel.id);
        if(!validchannel) throw "That is not a valid channel in the server.";
        const emoji = opts.getString('emoji');

        switch(sub) {
            case 'addchannel': {
                const autoreactions = await ar.find({ Guild: guild.id });

                autoreactions.forEach((autoreaction) => {
                    if(autoreaction.Channel === channel.id) throw "That channel already has an auto reaction system set up! If you want to add another emoji, use /autoreact addemoji!";
                });

                await ar.create({
                    Guild: guild.id,
                    Channel: channel.id,
                    Emojis: [emoji]
                });

                return Reply(interaction, `Autoreaction system set up in ${channel.name}. All messages will be reacted with ${emoji}.`, '✅', false);
            }
            break;

            case 'addemoji': {
                const autoreactions = await ar.find({ Guild: guild.id });
                if(!autoreactions || autoreactions.length <= 0) throw "There are no autoreactions in this server to add an emoji to!";

                autoreactions.forEach((autoreaction) => {
                    if(autoreaction.Channel === channel.id) {
                        if(autoreaction.Emojis.includes(emoji)) throw "That emoji is already included in this autoreaction channel!";

                        autoreaction.Emojis.push(emoji);
                    }
                });

                return Reply(interaction, `Successfully added ${emoji} as an autoreaction in ${channel.name}.`, '✅', false);
            }
            break;

            case 'removeemoji': {
                const autoreactions = await ar.find({ Guild: guild.id });
                if(!autoreactions || autoreactions.length <= 0) throw "There are no autoreactions in this server to add an emoji to!";

                autoreactions.forEach((autoreaction) => {
                    if(autoreaction.Channel === channel.id) {
                        if(!autoreaction.Emojis.includes(emoji)) throw "That emoji is not included in this autoreaction channel!";

                        const index = autoreaction.Emojis.indexOf(emoji);

                        autoreaction.Emojis.splice(index, 1);
                    }
                });

                return Reply(interaction, `Successfully removed ${emoji} as an autoreaction from ${channel.name}.`, '✅', false);
            }
            break;

            case 'removechannel': {
                const autoreactions = await ar.find({ Guild: guild.id });

                const autoreactionchannel = await ar.findOne({ Guild: guild.id, Channel: channel.id });
                if(!autoreactionchannel) throw "That channel does not have an auto reaction system set up! If you want to add another emoji, use /autoreact addemoji!";

                await autoreactionchannel.deleteOne();
                await autoreactionchannel.save();

                return Reply(interaction, `Autoreaction system removed from ${channel.name}. All messages sent in this channel will not receive a reaction from now on..`, '✅', false);
            }
            break;

            case 'removeall': {
                const allars = await ar.find({ Guild: guild.id });
                if(!allars || allars.length <= 0) throw "There are no auto reactions set up in this server!";

                const button1 = new ButtonBuilder()
                .setCustomId('confirm')
                .setLabel('Confirm')
                .setEmoji('✅')
                .setStyle(ButtonStyle.Success)
                
                const button2 = new ButtonBuilder()
                .setCustomId('abort')
                .setLabel('Abort')
                .setEmoji('❌')
                .setStyle(ButtonStyle.Danger)

                const row = new ActionRowBuilder<ButtonBuilder>()
                .setComponents(button1, button2)
                
                const msg = await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`⚠️ Confirmation Required.`)
                        .setDescription(`Are you sure you want to remove all autoreactions from this server? This cannot be undone.`)
                        .setColor('Orange')
                    ], components: [row]
                });

                const collector = await msg.createMessageComponentCollector();

                collector.on('collect', async(results) => {
                    if(results.customId === 'confirm') {
                        await ar.deleteMany({ Guild: guild.id });

                        await msg.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`✅ All Autoreactions Removed`)
                                .setDescription(`All autoreactions have been removed from this server.`)
                                .setColor('Green')
                            ], components: []
                        });
                    } else {
                        await msg.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`❌ Operation Aborted`)
                                .setDescription(`The operation has been cancelled.`)
                                .setColor('Red')
                            ], components: []
                        });
                    }
                })
            }
            break;
        }
    }
})