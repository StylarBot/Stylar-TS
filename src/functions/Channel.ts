import { BaseGuildVoiceChannel, ChannelType, Client, Guild, GuildChannel, GuildMember, Role } from "discord.js";

let voicechannels = [
    'GuildVoice',
    'GuildStageVoice',
]

let textchannels = [
    'GuildText',
    'PrivateThread',
    'PublicThread',
    'GuildAnnouncement',
    'GuildForum'
]

async function Lock(channel: GuildChannel, client: Client, member: GuildMember, role: Role) {
    if(!channel.permissionsFor(client.user).has('ManageChannels')) throw "I do not have permissions to change this channel's permissions.";
    if(!channel.permissionsFor(member).has('ManageChannels')) throw "You do not have permissions to change this channel's permissions.";

    try {
        channel.permissionOverwrites.edit(role.id, {
            SendMessages: false,
            EmbedLinks: false,
            AttachFiles: false,
            AddReactions: true,
            UseExternalEmojis: true,
        });

        return true;
    } catch (err) {
        return err;
    }
}

async function Unlock(channel: GuildChannel, client: Client, member: GuildMember, role: Role) {
    if(!channel.permissionsFor(client.user).has('ManageChannels')) throw "I do not have permissions to change this channel's permissions.";
    if(!channel.permissionsFor(member).has('ManageChannels')) throw "You do not have permissions to change this channel's permissions.";

    try {
        channel.permissionOverwrites.edit(role.id, {
            SendMessages: true,
            EmbedLinks: true,
            AttachFiles: true,
        });

        return true;
    } catch (err) {
        return err;
    }
}

async function SetUserLimit(channel: BaseGuildVoiceChannel, client: Client, member: GuildMember, users: number) {
    if(!channel.permissionsFor(client.user).has('ManageChannels')) throw "I do not have permissions to change this channel's permissions.";
    if(!channel.permissionsFor(member).has('ManageChannels')) throw "You do not have permissions to change this channel's permissions.";

    if(!voicechannels.includes(channel.type.toString())) throw "The channel selected is not a voice channel.";

    try {
        await channel.setUserLimit(users);
        return true;
    } catch (err) {
        return err;
    }
}

async function Lockdown(client: Client, member: GuildMember, guild: Guild, role: Role) {
    const channels = await guild.channels.cache.filter((ch) =>
        ch.permissionsFor(client.user).has('ManageChannels')
        && ch.permissionsFor(member).has('ManageChannels')
        && ch.manageable
        && voicechannels.includes(ch.type.toString()) || textchannels.includes(ch.type.toString())
    );

    if(channels.size <= 0) throw "There are no channels available for lockdown!";

    try {
        channels.forEach((ch) => {
            ch.permissionsFor(role).remove('SendMessages');
            ch.permissionsFor(role).remove('EmbedLinks');
            ch.permissionsFor(role).remove('AttachFiles');
        });
    
        return true;
    } catch (err) {
        return err;
    }
}

async function LiftLockdown(client: Client, member: GuildMember, guild: Guild, role: Role) {
    const channels = await guild.channels.cache.filter((ch) =>
        ch.permissionsFor(client.user).has('ManageChannels')
        && ch.permissionsFor(member).has('ManageChannels')
        && ch.manageable
        && voicechannels.includes(ch.type.toString()) || textchannels.includes(ch.type.toString())
    );

    if(channels.size <= 0) throw "There are no channels available for lifting lockdown!";

    try {
        channels.forEach((ch) => {
            ch.permissionsFor(role).add('SendMessages');
            ch.permissionsFor(role).add('EmbedLinks');
            ch.permissionsFor(role).add('AttachFiles');
        });
    
        return true;
    } catch (err) {
        return err;
    }
}

export default { Lock, Unlock, SetUserLimit, Lockdown, LiftLockdown };