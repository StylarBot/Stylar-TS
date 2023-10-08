import backup from '@outwalk/discord-backup';
import { Command } from '../../structures/Command';
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export default new Command({
    name: 'backup',
    description: 'Setup the configuration for server backups!',
    userPermissions: ['Administrator'],
    clientPermissions: ['ManageChannels', 'ManageGuild', 'ManageRoles'],
    options: [
        {
            name: 'create',
            description: 'Create a server backup to load later!',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'load',
            description: 'Load a server backup using its ID!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'backup-id',
                    description: 'The ID of the backup!',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'delete',
                    description: 'Do you want the backup to be deleted after it is loaded?',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: 'Don\'t delete backup after it has loaded', value: 'dontdelete' },
                        { name: 'Delete backup after it has loaded', value: 'delete' }
                    ]
                }
            ]
        },
        {
            name: 'info',
            description: 'Get information on a backup using its ID!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'backup-id',
                    description: 'The ID of the backup!',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
        },
        {
            name: 'delete',
            description: 'Delete a backup using its ID!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'backup-id',
                    description: 'The ID of the backup!',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
        },
        {
            name: 'list',
            description: 'List all server backups!',
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],

    run: async({ interaction, guild, opts }) => {
        const sub = opts.getSubcommand();
        const backupid = opts.getString('backup-id');
        const del = opts.getString('delete') || 'delete';

        switch(sub) {
            case 'create': {
                const backupData = await backup.create(guild, {
                    backupMembers: true,
                    jsonBeautify: true,
                    saveImages: true,
                    speed: 250,
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Server Backup Created`)
                        .setDescription(`A server backup has been created. More information visible below.`)
                        .setColor('Blue')
                        .setFields(
                            { name: 'ID', value: `${backupData.id}` },
                            { name: 'What was backed up?', value: `AFK Data\nAutomod Rules\nBanner\nBans\nChannels\nEmojis\nIcon\nMembers\nRoles` }
                        )
                        .setThumbnail(guild.iconURL({ size: 1024 }))
                    ], ephemeral: true,
                });
            }
            break;

            case 'load': {
                const sb = await backup.fetch(backupid);
                if(!sb) throw "There is no backup with that ID.";
                
                if(sb.data.guildID !== guild.id) throw "You cannot restore a backup from a different server.";

                const button1 = new ButtonBuilder()
                .setCustomId('confirm')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅')
                .setLabel('Confirm')

                const button2 = new ButtonBuilder()
                .setCustomId('abort')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('❌')
                .setLabel('Abort')

                const row = new ActionRowBuilder<ButtonBuilder>()
                .setComponents(button1, button2)

                const msg = await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Server Backup Confirmation`)
                        .setDescription(`Are you sure you want to load this server backup?\nThis server will be cleared before restore.`)
                        .setColor('Blue')
                    ], components: [row], ephemeral: true
                });

                const collector = await msg.createMessageComponentCollector({ time: 30000 });

                collector.on('collect', async(results) => {
                    if(results.customId === 'confirm') {
                        msg.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Server Backup Loading`)
                                .setDescription(`The server backup will be loaded in 10 seconds.`)
                                .setColor('Blue')
                            ], components: []
                        });

                        await backup.load(backupid, guild, { clearGuildBeforeRestore: true });

                        if(del === 'delete') {
                            await backup.remove(backupid);
                        }
                        return;
                    } else if (results.customId === 'abort') {
                        msg.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Operation Aborted.`)
                                .setDescription(`The operation has been aborted by the user.`)
                                .setColor('Red')
                            ], components: []
                        });
                        return;
                    } else {
                        msg.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Operation Aborted.`)
                                .setDescription(`The operation has been aborted by the user.`)
                                .setColor('Red')
                            ], components: []
                        });
                        return;
                    }
                });
            }
            break;

            case 'info': {
                const backupData = await backup.fetch(backupid);
                if(!backupData) throw "That backup was not found.";

                if(backupData.data.guildID !== guild.id) throw "You cannot view another servers backup!";
                const { data } = backupData;

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Backup Information (${data.id})`)
                        .setThumbnail(guild.iconURL({ size: 1024 }))
                        .setFields(
                            { name: 'Guild ID', value: `${data.guildID}`, inline: true },
                            { name: 'Channel Count', value: `${data.channels.categories.length + data.channels.others.length}`, inline: true },
                            { name: 'Created', value: `<t:${Math.round(data.createdTimestamp / 1000)}> (<t:${Math.round(data.createdTimestamp / 1000)}:R>)`, inline: true },
                            { name: 'Role Count', value: `${data.roles.length}`, inline: true },
                            { name: 'Emojis Count', value: `${data.emojis.length}`, inline: true },
                            { name: 'Guild Name', value: `${data.name}`, inline: true },
                        )
                    ]
                });
            }
            break;

            case 'delete': {
                const backupData = await backup.fetch(backupid);
                if(!backupData) throw "That backup was not found.";

                if(backupData.data.guildID !== guild.id) throw "You cannot delete another servers backup!";

                await backup.remove(backupid);

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Server backup removed`)
                        .setDescription(`The backup with ID ${backupid} has been removed.`)
                        .setColor('Blue')
                        .setThumbnail(guild.iconURL({ size: 1024 }))
                    ]
                })
            }
            break;
        }
    }
})