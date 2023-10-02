import { ApplicationCommandOptionType, EmbedBuilder, ChannelType } from "discord.js";
import GetGuildInfo from "../../functions/GetGuildInfo";
import Reply from "../../functions/Reply";
import { Command } from "../../structures/Command";

export default new Command({
    name: 'serverinfo',
    description: 'Get information about the server you\'re in!',
    options: [
        {
            name: 'type',
            description: 'The type of info you want to find out!',
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: 'ID', value: 'id' },
                { name: 'Channel Count', value: 'channelcount' },
                { name: 'Creation Date', value: 'creationdate' },
                { name: 'Description', value: 'description' },
                { name: 'Emoji Count', value: 'emojicount' },
                { name: 'Icon', value: 'icon' },
                { name: 'Server Boost Status', value: 'sbs' },
                { name: 'Maximum Bitrate', value: 'maximumbitrate' },
                { name: 'Maximum Members', value: 'maximummembers' },
                { name: 'Member Count', value: 'membercount' },
                { name: 'NSFW Level', value: 'nsfwlevel' },
                { name: 'Owner Info', value: 'ownerinfo' },
                { name: 'All Roles', value: 'allroles' },
                { name: 'Sticker Count', value: 'stickercount' },
                { name: 'Verification Level', value: 'verificationlevel' }
            ]
        }
    ],

    run: async ({ interaction, guild, opts }) => {
        const guildproperties = await GetGuildInfo(guild);

        const info = opts.getString('type');
        if (!info) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Guild Info - ${guild.name}`)
                        .addFields(
                            { name: 'ID', value: `${guildproperties.id}`, inline: true },
                            { name: 'Channel Count', value: `${guildproperties.channelCount}`, inline: true },
                            { name: 'Creation Date', value: `<t:${Math.round(guild.createdTimestamp / 1000)}> (<t:${Math.round(guild.createdTimestamp / 1000)}:R>)` },
                            { name: 'Description', value: `${guildproperties.description}`, inline: true },
                            { name: 'Emoji Count', value: `${guildproperties.emojiCount}`, inline: true },
                            { name: 'Server Boost Status', value: `${guildproperties.boostStatus}`, inline: true },
                            { name: 'Maximum Bitrate', value: `${guildproperties.maximumBitrate}`, inline: true },
                            { name: 'Maximum Members', value: `${guildproperties.maximumMembers}`, inline: true },
                            { name: 'Member Count', value: `${guildproperties.memberCount}`, inline: true },
                            { name: 'NSFW Level', value: `${guildproperties.nsfwLevel}`, inline: true },
                            { name: 'Owner Info', value: `🆔 **Owner ID**: ${guildproperties.ownerID}\n👑 **Owner**: <@${guildproperties.ownerID}>`, inline: true },
                            { name: '* Role Count', value: `${guildproperties.roleCount}`, inline: true },
                            { name: 'Sticker Count', value: `${guildproperties.stickerCount}`, inline: true },
                            { name: 'Verification Level', value: `${guildproperties.verificationLevel}`, inline: true },
                        )
                        .setThumbnail(guildproperties.icon)
                        .setColor('Blue')
                        .setFooter({ text: `* ℹ️ To view all roles, run /info server allroles` })
                ]
            });
        } else {
            switch (info) {
                case 'id': {
                    return Reply(interaction, `The ID of this server is ${guildproperties.id}`, '👥', true);
                }
                    break;

                case 'channelcount': {
                    return Reply(interaction, `There are currently ${guildproperties.channelCount} channels in the server:\n🔉 **Voice**: ${guild.channels.cache.filter((ch) => ch.type === ChannelType.GuildVoice).size}\n#️⃣ **Text**: ${guild.channels.cache.filter((ch) => ch.type === ChannelType.GuildText).size}\n📣 **Announcement**: ${guild.channels.cache.filter((ch) => ch.type === ChannelType.GuildAnnouncement).size}`, '👥', true);
                }
                    break;

                case 'creationdate': {
                    return Reply(interaction, `This guild was created on <t:${Math.round(guild.createdTimestamp / 1000)}> (<t:${Math.round(guild.createdTimestamp / 1000)}:R>)`, '👥', true)
                }
                    break;

                case 'description': {
                    return Reply(interaction, `This guild's description is \`${guild.description}\``, '👥', true);
                }
                    break;

                case 'emojicount': {
                    return Reply(interaction, `There are currently ${guildproperties.emojiCount} emojis in this server:\n**Animated**: ${guild.emojis.cache.filter((emoji) => emoji.animated).size}\n**Static**: ${guild.emojis.cache.filter((emoji) => !emoji.animated).size}`, '😂', true);
                }
                    break;

                case 'icon': {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`${guild.name} - Icon`)
                                .setThumbnail(guildproperties.icon)
                                .setColor('Blue')
                        ], ephemeral: true
                    });
                }
                    break;

                case 'sbs': {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`${guild.name} - Server Boost Status`)
                                .setDescription(`${guildproperties.boostStatus}`)
                                .setColor('Blue')
                                .setThumbnail(guildproperties.icon)
                        ], ephemeral: true
                    });
                }
                    break;

                case 'maximumbitrate': {
                    return Reply(interaction, `The maximum bitrate in this server is ${guildproperties.maximumBitrate}.`, '🔉', true);
                }
                    break;

                case 'maximummembers': {
                    return Reply(interaction, `The maximum amount of members that this server can hold is ${guildproperties.maximumMembers}.`, '👥', true);
                }
                    break;

                case 'membercount': {
                    return Reply(interaction, `The member count of this server was ${guildproperties.memberCount}.`, '', true);
                }
                    break;

                case 'nsfwlevel': {
                    return Reply(interaction, `The NSFW level of this server is ${guildproperties.nsfwLevel}`, '🔞', true);
                }
                    break;

                case 'ownerinfo': {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`${guild.name} - Owner Info`)
                                .setDescription(`This guild is owned by <@${guildproperties.ownerID}> (ID: ${guildproperties.ownerID})`)
                                .setColor('Blue')
                                .setThumbnail(guildproperties.icon)
                        ], ephemeral: true
                    });
                }
                    break;

                case 'rolecount': {
                    return Reply(interaction, `This server has ${guildproperties.roleCount} roles.`, '👥', true);
                }
                    break;

                case 'stickercount': {
                    return Reply(interaction, `This server has ${guildproperties.stickerCount} stickers.`, '👥', true);
                }
                    break;

                case 'verificationlevel': {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`${guild.name} - Verification Level`)
                                .setDescription(`This guild's verification level is ${guildproperties.verificationLevel}.`)
                                .setColor('Blue')
                                .setThumbnail(guildproperties.icon)
                        ], ephemeral: true
                    })
                }
                    break;
            }
        }
    }
});