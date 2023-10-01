import { Guild, ChannelType } from 'discord.js';

interface GuildProperties {
    id: string;
    channelCount: string;
    description: string;
    emojiCount: number;
    icon: string | null;
    boostStatus: string;
    maximumBitrate: number | null;
    maximumMembers: number | null;
    memberCount: string;
    nsfwLevel: string;
    ownerID: string | null;
    roleCount: string;
    stickerCount: string;
    verificationLevel: string;
}

const GetGuildInfo = async (guild: Guild): Promise<GuildProperties> => {
    await guild.fetchOwner();
    await guild.members.fetch();

    let guildproperties: GuildProperties = {
        id: guild.id,
        channelCount: `🔉 **Voice**: ${guild.channels.cache.filter((ch) => ch.type === ChannelType.GuildVoice).size}\n#️⃣ **Text**: ${guild.channels.cache.filter((ch) => ch.type === ChannelType.GuildText).size}\n📣 **Announcement**: ${guild.channels.cache.filter((ch) => ch.type === ChannelType.GuildAnnouncement).size}`,
        description: `${guild.description || "No description."}`,
        emojiCount: guild.emojis.cache.size,
        icon: guild.iconURL({ size: 1024 }),
        boostStatus: `<:server_boost:1147641611111649382> **Boost Count**: ${guild.premiumSubscriptionCount}\n<a:boosttier:1147643005398950008> **Boost Tier**: ${guild.premiumTier}`,
        maximumBitrate: guild.maximumBitrate,
        maximumMembers: guild.maximumMembers,
        memberCount: `👤 **Members**: ${guild.members.cache.filter((mem) => !mem.user.bot).size}\n🤖 **Bots**: ${guild.members.cache.filter((mem) => mem.user.bot).size}\n👥 **Total Members**: ${guild.memberCount}`,
        nsfwLevel: `${guild.nsfwLevel}`,
        ownerID: guild.ownerId || null,
        roleCount: `${guild.roles.cache.size}`,
        stickerCount: `${guild.stickers.cache.size}`,
        verificationLevel: `${guild.verificationLevel.toString()}`
    }

    return guildproperties;
}

export default GetGuildInfo;