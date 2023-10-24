import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import ga from "../../models/GlobalAnnouncements";
import axios from 'axios';

export default new Command({
    name: 'announcements',
    description: 'Get notified of Stylar\'s status!',
    options: [
        {
            name: 'setchannel',
            description: 'Set the channel you want updates to be sent to.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want updates to be sent to.',
                    required: true,
                    type: ApplicationCommandOptionType.Channel,
                    channel_types: [ChannelType.GuildText],
                }
            ]
        },
        {
            name: 'disable',
            description: 'Disable Stylar announcements. (NOT RECOMMENDED)',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'send',
            description: 'Send a global announcement! (DEV ONLY)',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'status',
                    description: 'The status of the announcement',
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: 'Normal', value: 'normal' },
                        { name: 'Error', value: 'crash' },
                        { name: 'Update', value: 'update' }
                    ],
                    required: true
                },
                {
                    name: 'message',
                    description: 'The message to be included in the announcement!',
                    type: ApplicationCommandOptionType.String,
                },
            ]
        }
    ],

    run: async({ interaction, guild, client, opts }) => {

        const sub = opts.getSubcommand();
        const channel = opts.getChannel('channel') || interaction.channel;
        if(!channel) throw "That channel is not in this server.";
        const status = opts.getString('status');
        const message = opts.getString('message') || "No message from developers.";

        switch(sub) {
            case 'setchannel': {
                const validanc = await ga.findOne({ Guild: guild.id });
                if(validanc) {
                    validanc.Channel = channel.id;
                    await validanc.save();

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`✅ Channel Updated`)
                            .setDescription(`The channel that Stylar's global announcements will be sent to has been changed.`)
                            .addFields(
                                { name: 'New Channel', value: `<#${channel.id}>` },
                                { name: `Changed By`, value: `<@${interaction.user.id}>` }
                            )
                            .setColor('Blue')
                            .setFooter({ text: `https://github.com/StylarBot` })
                        ]
                    });
                } else {
                    await ga.create({
                        Guild: guild.id,
                        Channel: channel.id
                    });

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`✅ Channel Set`)
                            .setDescription(`The channel that Stylar's global announcements will be sent to has been set.`)
                            .addFields(
                                { name: 'Channel', value: `<#${channel.id}>` },
                                { name: `Changed By`, value: `<@${interaction.user.id}>` }
                            )
                            .setColor('Blue')
                            .setFooter({ text: `https://github.com/StylarBot` })
                        ]
                    });
                }
            }
            break;

            case 'disable': {
                const button1 = new ButtonBuilder()
                .setCustomId('confirm')
                .setEmoji('✅')
                .setLabel('Confirm')
                .setStyle(ButtonStyle.Success)
                
                const button2 = new ButtonBuilder()
                .setCustomId('abort')
                .setEmoji('❌')
                .setLabel('Abort')
                .setStyle(ButtonStyle.Danger)

                const row = new ActionRowBuilder<ButtonBuilder>()
                .setComponents(button1, button2)

                const msg = await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`⚠️ Confirmation Needed.`)
                        .setDescription(`Are you sure you want to turn OFF the global announcements system?\nYou will not receive status notifications if Stylar goes down or updates.`)
                        .setColor('Orange')
                    ], components: [row], ephemeral: true
                });

                const collector = await msg.createMessageComponentCollector({ time: 30000 });

                collector.on('collect', async(results) => {
                    if(results.user.id !== interaction.user.id){
                        results.reply({ content: `This is not your prompt!`, ephemeral: true });
                        return;
                    }

                    if(results.customId === 'confirm') {
                        const global = await ga.findOne({ Guild: guild.id });
                        if(!global) {
                            await msg.edit({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle(`✅ Disabled Global Announcements`)
                                    .setDescription(`You will **no longer** receive status updates about Stylar.\n:warning: This may result in the bot going down/updating without your knowledge.`)
                                    .setColor('Blue')
                                ], components: []
                            });
                        } else {
                            await global.deleteOne();

                            await msg.edit({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle(`✅ Disabled Global Announcements`)
                                    .setDescription(`You will **no longer** receive status updates about Stylar.\n:warning: This may result in the bot going down/updating without your knowledge.`)
                                    .setColor('Blue')
                                ], components: []
                            });
                        }
                    } else if (results.customId === 'abort') {
                        await msg.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`❌ Operation Aborted`)
                                .setDescription(`The operation has been cancelled.`)
                                .setColor('Red')
                            ], components: []
                        });
                    }
                }).on('end', async() => {
                    await msg.edit({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`❌ Operation Aborted`)
                            .setDescription(`The operation has been cancelled.`)
                            .setColor('Red')
                        ], components: []
                    });
                });
            }
            break;

            case 'send': {
                const developers = (await axios.get(`https://stylar-dev.discordand.repl.co/api/developers`)).data.developers;

                if(!developers.includes(interaction.user.id)) throw "This is a DEVELOPER ONLY command!";

                const global = await ga.find();

                global.forEach(async(gas) => {
                    const guild = await client.guilds.cache.get(gas.Guild);
                    if(!guild) {
                        return gas.deleteOne();
                    } else {
                        const channel = await guild.channels.cache.get(gas.Channel);
                        if(!channel) {
                            return gas.deleteOne();
                        } else {
                            if(!channel.permissionsFor(client.user).has('SendMessages')) return;
                            if(!channel.permissionsFor(client.user).has('EmbedLinks')) return;
                            if(channel.type !== ChannelType.GuildText) return;

                            let emoji;
                            let color;
                            let basemsg;

                            switch(status) {
                                case 'error': {
                                    emoji = '❌';
                                    color = 'Red';
                                    basemsg = 'Stylar is experiencing an error.';
                                }
                                break;

                                case 'update': {
                                    emoji = '<:update:1156624941245009960>';
                                    color = 'Green';   
                                    basemsg = 'Stylar is updating.';
                                }
                                break;

                                case 'downtime': {
                                    emoji = '🕒';
                                    color = 'Blue';
                                    basemsg = 'Stylar is undergoing downtime.';
                                }
                                break;
                            }

                            channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle(`${emoji} ${basemsg}`)
                                    .setDescription(`${message}`)
                                    .setColor(color)
                                ]
                            });
                        }
                    }
                });

                return interaction.reply({ embeds: [
                    new EmbedBuilder()
                    .setTitle(`Global Announcement Sent`)
                    .setDescription(`A global announcement has been sent to all servers with this bot.`)
                    .setColor('Blue')
                    .addFields(
                        { name: `Sender`, value: `<@${interaction.user.id}>` },
                        { name: `Status`, value: `${status}` },
                        { name: `Message`, value: `${message}` }
                    )
                ], ephemeral: true });
            }
            break;
        }
    }
})