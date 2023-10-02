import { EmbedBuilder, ChannelType, ApplicationCommandOptionType } from 'discord.js';
import GetUserInfo from '../../functions/GetUserInfo';
import { Command } from '../../structures/Command';
import axios from 'axios';
import Reply from '../../functions/Reply';

export default new Command({
    name: 'userinfo',
    description: 'Get information on a user!',
    options: [
        {
            name: 'user',
            description: 'The user you want to get information on!',
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'type',
            description: 'What type of information do you want to find out?',
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'ID', value: 'id' },
                { name: 'Full username + discriminator', value: 'fullusername' },
                { name: 'Username', value: 'username' },
                { name: 'Creation Date', value: 'created' },
                { name: 'Nickname', value: 'nickname' },
                { name: 'Discriminator', value: 'discriminator' },
                { name: 'Moderation Protection Status', value: 'mps'},
                { name: 'Avatar', value: 'avatar' },
                { name: 'All Badges', value: 'allbadges' },
                { name: 'Joined Date', value: 'joined' },
                { name: 'Key Permissions', value: 'keypermissions' },
                { name: 'All Permissions', value: 'allpermissions' },
                { name: 'All Roles', value: 'allroles' },
                { name: 'Voice Status', value: 'voicestatus' }
            ]
        }
    ],

    run: async({ interaction, opts, guild }) => {
        const user = opts.getUser('user') || interaction.user;
        const info = opts.getString('type');

        if(!info) {
            const member = await guild.members.cache.get(user.id);

            if(member) {
                const badges = await GetUserInfo.GetUserBadges(user);
                const roles = await GetUserInfo.SortRoles(member);
                const { id, tag, username, createdTimestamp, discriminator } = user;
                const { bannable, kickable, moderatable, joinedTimestamp, voice, permissions } = member;
                await member.fetch();
                let voiceStatus;

                if(!voice.channel) voiceStatus = 'Not connected to voice.'
                if(voice.channel) voiceStatus = `Speaking in <#${voice.channel.id}>`

                const keyPermissions = await GetUserInfo.GetKeyPermissions(member);
                const presence = await GetUserInfo.GetPresence(member);

                const discordms = Math.round(createdTimestamp / 1000);
                const discordms2 = Math.round(joinedTimestamp / 1000);

                const verificationstatus = (await axios.get(`https://stylar-dev.discordand.repl.co/api/verify/${user.id}`)).data;

                const b = '<:seperator:1156319256858865745>';

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`User Info: ${presence} ${user.tag}`)
                        .setDescription(`${badges}\n${verificationstatus}\n<@${user.id}>\n${b}${b}${b}${b}${b}${b}${b}${b}${b}${b}${b}${b}${b}${b}${b}\n${roles}`)
                        .addFields(
                            { name: 'ID', value: `${id}`, inline: true },
                            { name: `Full Username + Discriminator`, value: `${tag}`, inline: true },
                            { name: `Account Created`, value: `<t:${discordms}> (<t:${discordms}:R>)`, inline: true },
                            { name: `Moderation Protection Status`, value: `Bannable: **${bannable}**\nKickable: **${kickable}**\nModeratable: **${moderatable}**`, inline: true },
                            { name: 'Joined Date', value: `<t:${discordms2}> (<t:${discordms2}:R>)`, inline: true },
                            { name: `Voice Status`, value: `${voiceStatus}`, inline: true },
                            { name: `* Key Permissions`, value: `${keyPermissions.join(', ') || "No key permissions."}` }
                        )
                        .setFooter({ text: `* ℹ️ To see all permissions that this user has, do /info user allpermissions` })
                        .setThumbnail(user.displayAvatarURL({ size: 1024 }))
                        .setColor('Blue')
                    ]
                });
            } else {
                const badges = await GetUserInfo.GetUserBadges(user);
                const { id, tag, username, createdTimestamp, discriminator } = user;

                const discordms = Math.round(createdTimestamp / 1000);

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`:warning: User Info: ${user.tag}`)
                        .addFields(
                            { name: 'ID', value: `${id}`, inline: true },
                            { name: `Full Username + Discriminator`, value: `${tag}`, inline: true },
                            { name: `Username`, value: `${username}`, inline: true },
                            { name: `Account Created`, value: `<t:${discordms}> (<t:${discordms}:R>)`, inline: true },
                            { name: `Discriminator`, value: `${discriminator}`, inline: true },
                        )
                        .setFooter({ text: `⚠️ This command is running in Limited Mode, since the user mentioned is not in this server.` })
                        .setThumbnail(user.displayAvatarURL({ size: 1024 }))
                        .setColor('Blue')
                    ]
                });
            }
        } else {
            switch(info) {
                case 'id': {
                    return Reply(interaction, `<@${user.id}>'s ID is ${user.id}.`, '🆔', true);
                }
                break;

                case 'fullusername': {
                    return Reply(interaction, `<@${user.id}>'s Full Username + Discriminator is ${user.tag}.`, '❓', true);
                }
                break;

                case 'username': {
                    return Reply(interaction, `<@${user.id}>'s Username is ${user.username}.`, '❓', true);
                }
                break;

                case 'created': {
                    const discordms = Math.round(user.createdTimestamp / 1000);

                    return Reply(interaction, `<@${user.id}>'s account was created on <t:${discordms}> (<t:${discordms}:R>)`, '👋', true);
                }
                break;

                case 'nickname': {
                    const member = guild.members.cache.get(user.id);
                    if(!member) {
                        return Reply(interaction, `That info cannot be obtained because the user mentioned is not in this server.`, '⚠️', true)
                    } else {
                        if(!member.nickname) return Reply(interaction, `That user does not have a nickname.`,  '🚫', true);
                        else return Reply(interaction, `<@${user.id}>'s nickname is \`${member.nickname}\`.`,  '✅', true);
                    };
                }
                break;

                case 'discriminator': {
                    if(!user.discriminator || user.discriminator === '0') return Reply(interaction, `<@${user.id}> does not have a discriminator, they are using the new Discord username system.`, '✅', true);
                    else return Reply(interaction, `<@${user.id}>'s discriminator is ${user.discriminator}.`, '✅', true);
                }
                break;

                case 'mps': {
                    const member = guild.members.cache.get(user.id);
                    if(!member) {
                        return Reply(interaction, `That info cannot be obtained because the user mentioned is not in this server.`, '⚠️', true)
                    } else {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Moderation Protection Status - ${user.tag}`)
                                .addFields(
                                    { name: 'Bannable', value: `${member.bannable}`, inline: true },
                                    { name: 'Kickable', value: `${member.kickable}`, inline: true },
                                    { name: 'Moderatable', value: `${member.moderatable}`, inline: true }
                                )
                                .setColor('Blue')
                                .setThumbnail(member.displayAvatarURL({ size: 1024 }))
                            ]
                        });
                    };
                }
                break;

                case 'avatar': {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setAuthor({ name: `${user.tag} - Avatar` })
                            .setImage(user.displayAvatarURL({ size: 2048 }))
                            .setColor('Blue')
                        ]
                    });
                }
                break;

                case 'allbadges': {
                    const badges = await GetUserInfo.GetUserBadges(user);
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`* ${user.tag} - Badges`)
                            .setThumbnail(user.displayAvatarURL({ size: 2048 }))
                            .setDescription(`${badges}`)
                            .setFooter({ text: `* ℹ️ Some badges may not show, such as the "Supports Commands" badge.` })
                            .setColor('Blue')
                        ]
                    });
                }
                break;

                case 'joined': {
                    const member = guild.members.cache.get(user.id);
                    if(!member) {
                        return Reply(interaction, `That info cannot be obtained because the user mentioned is not in this server.`, '⚠️', true)
                    } else {
                        const discordms = Math.round(member.joinedTimestamp / 1000);
                        return Reply(interaction, `<@${member.id}> joined this server on <t:${discordms}> (<t:${discordms}:R>)`, '🕒', true)
                    };
                }
                break;

                case 'keypermissions': {
                    const member = guild.members.cache.get(user.id);
                    if(!member) {
                        return Reply(interaction, `That info cannot be obtained because the user mentioned is not in this server.`, '⚠️', true)
                    } else {
                        const keyPerms = await GetUserInfo.GetKeyPermissions(member);

                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`${user.tag} - Key Permissions`)
                                .setDescription(`${keyPerms.join(', ')}`)
                                .setColor('Blue')
                                .setThumbnail(user.displayAvatarURL({ size: 2048 }))
                            ]
                        });
                    };
                }
                break;

                case 'allpermissions': {
                    const member = guild.members.cache.get(user.id);
                    if(!member) {
                        return Reply(interaction, `That info cannot be obtained because the user mentioned is not in this server.`, '⚠️', true)
                    } else {
                        const allPerms = await GetUserInfo.GetAllPermissions(member);

                        if(allPerms.join(', ').length > 2048) throw "This user has too many permissions, I cannot display them.";

                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`${user.tag} - All Permissions`)
                                .setDescription(`${allPerms.join(', ')}`)
                                .setColor('Blue')
                                .setThumbnail(user.displayAvatarURL({ size: 2048 }))
                            ]
                        });
                    };
                }
                break;

                case 'allroles': {
                    const member = guild.members.cache.get(user.id);
                    if(!member) {
                        return Reply(interaction, `That info cannot be obtained because the user mentioned is not in this server.`, '⚠️', true)
                    } else {
                        const allroles = await GetUserInfo.SortRoles(member);

                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`${user.tag} - All Roles`)
                                .setDescription(`${allroles}`)
                                .setColor('Blue')
                                .setThumbnail(user.displayAvatarURL({ size: 2048 }))
                            ]
                        });
                    };
                }
                break;

                case 'voicestatus': {
                    const member = guild.members.cache.get(user.id);
                    if(!member) {
                        return Reply(interaction, `That info cannot be obtained because the user mentioned is not in this server.`, '⚠️', true)
                    } else {
                        await member.fetch();
                        const { voice } = member;
                        let voiceStatus;

                        if(!voice.channel) voiceStatus = 'Not connected to voice.'
                        if(voice.channel) voiceStatus = `Speaking in <#${voice.channel.id}> with ${voice.channel.members.size - 1} other people.`

                        return Reply(interaction, `<@${user.id}>'s voice status is: ${voiceStatus}`,  '🔉', true);
                    };
                }
                break;
            }
        }
    }
})