import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import tempban from "../../models/Tempban";
import moderation from "../../models/Moderation";

export default new Command({
    name: 'punishment',
    description: 'Stylar\'s punishment management commands!',
    userPermissions: ['ModerateMembers'],
    options: [
        {
            name: 'remove',
            description: 'Remove a punishment from a user!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'id',
                    description: 'The ID of the punishment! (obtainable through /punishment view all)',
                    required: true,
                    type: ApplicationCommandOptionType.String,
                    maxLength: 24,
                },
            ]
        },
        {
            name: 'info',
            description: 'Get information about a specific punishment!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'id',
                    description: 'The ID of the punishment! (obtainable through /punishment view all)',
                    required: true,
                    type: ApplicationCommandOptionType.String,
                    maxLength: 24,
                },
            ]
        },
        {
            name: 'view',
            description: 'View selected punishments that a user has received!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user whos punishments you want to check!',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'type',
                    description: 'The type of punishment you want to check!',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: 'All', value: 'all' },
                        { name: 'Bans', value: 'bans' },
                        { name: 'Kicks', value: 'kicks' },
                        { name: 'Mutes', value: 'mutes' },
                        { name: 'Tempbans', value: 'tempbans' },
                        { name: 'Warnings', value: 'warnings' }
                    ]
                }
            ]
        }
    ],

    run: async({ interaction, guild, opts }) => {
        const user = opts.getUser('user') || interaction.user;
        const type = opts.getString('type');
        const id = opts.getString('id');
        const sub = opts.getSubcommand();

        switch(sub) {
            case 'remove': {
                const punishment = await moderation.findById(id);
                if(!punishment) throw "That ID does not lead to a valid punishment.";
                if(punishment.Guild !== guild.id) throw "That ID does not lead to a valid punishment in this server.";

                await punishment.deleteOne();
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`✅ Punishment Removed`)
                        .setDescription(`The punishment issued to <@${punishment.User}> has been removed.`)
                        .addFields(
                            { name: 'User', value: `<@${punishment.User}>`, inline: true },
                            { name: 'Moderator', value: `<@${punishment.Moderator}>`, inline: true },
                            { name: 'Punishment', value: `${punishment.Punishment}`, inline: true },
                            { name: 'Guild ID', value: `${punishment.Guild}`, inline: true },
                            { name: 'Reason', value: `${punishment.Reason}`, inline: true },
                            { name: 'Date + Time Given', value: `<t:${Math.round(parseInt(punishment.DateTimeMS) / 1000)}> (<t:${Math.round(parseInt(punishment.DateTimeMS) / 1000)}:R>)`, inline: true },
                        )
                        .setColor('Blue')
                        .setFooter({ text: `https://github.com/StylarBot` })
                    ]
                });
            }
            break;

            case 'view': {
                switch(type) {
                    case 'all': {
                        const punishments = await moderation.find({ Guild: guild.id, User: user.id });
                        if(!punishments || punishments.length <= 0) throw "That user has no punishments!";

                        const bans = await punishments.filter((punish) => punish.Punishment === 'Ban');
                        const kicks = await punishments.filter((punish) => punish.Punishment === 'Kick');
                        const mutes = await punishments.filter((punish) => punish.Punishment === 'Mute');
                        const tempbans = await punishments.filter((punish) => punish.Punishment === 'Tempban');
                        const warnings = await punishments.filter((punish) => punish.Punishment === 'Warning');
                    }
                    break;

                    case 'bans': {
                        const punishments = await moderation.find({ Guild: guild.id, User: user.id });
                        if(!punishments || punishments.length <= 0) throw "That user has no punishments!";

                        const bans = await punishments.filter((punish) => punish.Punishment === 'Ban');
                        if(bans.length <= 0) throw "That user has had no bans!";

                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Punishment History - Bans`)
                                .setDescription(`<@${user.id}> has had ${bans.length} bans.`)
                                .setColor('Blue')
                                .setFooter({ text: `https://github.com/StylarBot` })
                            ]
                        });
                    }
                    break;

                    case 'kicks': {
                        const punishments = await moderation.find({ Guild: guild.id, User: user.id });
                        if(!punishments || punishments.length <= 0) throw "That user has no punishments!";

                        const kicks = await punishments.filter((punish) => punish.Punishment === 'Kick');
                        if(kicks.length <= 0) throw "That user has had no bans!";

                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Punishment History - Kicks`)
                                .setDescription(`<@${user.id}> has had ${kicks.length} kicks.`)
                                .setColor('Blue')
                                .setFooter({ text: `https://github.com/StylarBot` })
                            ]
                        });
                    }
                    break;

                    case 'mutes': {
                        const punishments = await moderation.find({ Guild: guild.id, User: user.id });
                        if(!punishments || punishments.length <= 0) throw "That user has no punishments!";

                        const mutes = await punishments.filter((punish) => punish.Punishment === 'Mute');
                        if(mutes.length <= 0) throw "That user has had no bans!";

                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Punishment History - Mutes`)
                                .setDescription(`<@${user.id}> has had ${mutes.length} mutes.`)
                                .setColor('Blue')
                                .setFooter({ text: `https://github.com/StylarBot` })
                            ]
                        });
                    }
                    break;

                    case 'tempbans': {
                        const punishments = await moderation.find({ Guild: guild.id, User: user.id });
                        if(!punishments || punishments.length <= 0) throw "That user has no punishments!";

                        const tempbans = await punishments.filter((punish) => punish.Punishment === 'Tempban');
                        if(tempbans.length <= 0) throw "That user has had no bans!";

                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Punishment History - Tempbans`)
                                .setDescription(`<@${user.id}> has had ${tempbans.length} tempbans.`)
                                .setColor('Blue')
                                .setFooter({ text: `https://github.com/StylarBot` })
                            ]
                        });
                    }
                    break;

                    case 'warnings': {
                        const punishments = await moderation.find({ Guild: guild.id, User: user.id });
                        if(!punishments || punishments.length <= 0) throw "That user has no punishments!";

                        const warnings = await punishments.filter((punish) => punish.Punishment === 'Warning');
                        if(warnings.length <= 0) throw "That user has had no bans!";

                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Punishment History - Warnings`)
                                .setDescription(`<@${user.id}> has had ${warnings.length} warnings.`)
                                .setColor('Blue')
                                .setFooter({ text: `https://github.com/StylarBot` })
                            ]
                        });
                    }
                    break;
                }
            }
            break;

            case 'info': {
                const punishment = await moderation.findById(id);
                if(!punishment) throw "That ID does not lead to a valid punishment.";
                if(punishment.Guild !== guild.id) throw "That ID does not lead to a valid punishment in this server.";

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Punishment Information - ${id}`)
                        .setDescription(`The punishment issued to <@${punishment.User}> has been removed.`)
                        .addFields(
                            { name: 'User', value: `<@${punishment.User}>`, inline: true },
                            { name: 'Moderator', value: `<@${punishment.Moderator}>`, inline: true },
                            { name: 'Punishment', value: `${punishment.Punishment}`, inline: true },
                            { name: 'Guild ID', value: `${punishment.Guild}`, inline: true },
                            { name: 'Reason', value: `${punishment.Reason}`, inline: true },
                            { name: 'Date + Time Given', value: `<t:${Math.round(parseInt(punishment.DateTimeMS) / 1000)}> (<t:${Math.round(parseInt(punishment.DateTimeMS) / 1000)}:R>)`, inline: true },
                        )
                        .setColor('Blue')
                        .setFooter({ text: `https://github.com/StylarBot` })
                    ]
                });
            }
            break;
        }
    }
})