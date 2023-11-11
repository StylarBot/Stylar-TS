import { BaseGuildVoiceChannel, ChannelType, Client, Guild, GuildBasedChannel, GuildChannel, GuildMember, GuildTextBasedChannel, Role, VoiceChannel } from "discord.js";

let voicechannels = [
    2
]

let textchannels = [
    0,
    12,
    11,
    5,
    15,
]

import Templock from "../models/Templock";
import ms from 'ms';

async function KickFromVC(client: Client, member: GuildMember) {
    if(!member.voice.channel) throw "That member is not in a voice channel.";
    const vc = member.voice.channel;
    if(!vc.permissionsFor(client.user).has('MoveMembers')) throw "I do not have permissions to disconnect this member.";

    try {
        await member.voice.disconnect();
        return true;
    } catch (err) {
        return err;
    }
}

async function SetUserLimit(channel: BaseGuildVoiceChannel, client: Client, member: GuildMember, users: number) {
    if(!channel.permissionsFor(client.user).has('ManageChannels')) throw "I do not have permissions to change this channel's permissions.";
    if(!channel.permissionsFor(member).has('ManageChannels')) throw "You do not have permissions to change this channel's permissions.";

    if(!voicechannels.includes(channel.type)) throw "The channel selected is not a voice channel.";

    try {
        await channel.setUserLimit(users);
        return true;
    } catch (err) {
        return err;
    }
}

async function TempLock(channel: GuildChannel, client: Client, member: GuildMember, role: Role, duration: string) {
    const durationms = ms(duration);
    if(!durationms || isNaN(durationms)) throw "That is not a valid duration format.";

    if(!channel.permissionsFor(client.user).has('ManageChannels')) throw "I do not have permissions to change this channel's permissions.";
    if(!channel.permissionsFor(member).has('ManageChannels')) throw "You do not have permissions to change this channel's permissions.";

    if(voicechannels.includes(channel.type)) {
        try {
            channel.permissionOverwrites.edit(role.id, {
                SendMessages: false,
                EmbedLinks: false,
                AttachFiles: false,
                AddReactions: true,
                UseExternalEmojis: true,
                Speak: false,
                Connect: false,
            });
        } catch (err) {
            return err;
        }
    } else {
        try {
            channel.permissionOverwrites.edit(role.id, {
                SendMessages: false,
                EmbedLinks: false,
                AttachFiles: false,
                AddReactions: true,
                UseExternalEmojis: true,
            });

        } catch (err) {
            return err;
        }
    }

    const date = new Date();
    const nowms = date.getTime();
    const expiryms = nowms + durationms;

    await Templock.create({
        Guild: channel.guild.id,
        Channel: channel.id,
        Duration: duration,
        BeginMS: nowms,
        EndMS: expiryms,
        Moderator: member.id,
        Role: role.id,
    });
    return;
}

async function Lock(channel: GuildChannel, client: Client, member: GuildMember, role: Role) {
    if(!channel.permissionsFor(client.user).has('ManageChannels')) throw "I do not have permissions to change this channel's permissions.";
    if(!channel.permissionsFor(member).has('ManageChannels')) throw "You do not have permissions to change this channel's permissions.";

    if(voicechannels.includes(channel.type)) {
        try {
            channel.permissionOverwrites.edit(role.id, {
                SendMessages: false,
                EmbedLinks: false,
                AttachFiles: false,
                AddReactions: true,
                UseExternalEmojis: true,
                Speak: false,
                Connect: false,
            });

            return true;
        } catch (err) {
            return err;
        }
    } else {
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

async function Lockdown(client: Client, member: GuildMember, guild: Guild, role: Role) {
    const channels = await guild.channels.cache.filter((ch) =>
        ch.permissionsFor(client.user).has('ManageChannels')
        && ch.permissionsFor(member).has('ManageChannels')
        && ch.manageable
        && voicechannels.includes(ch.type) || textchannels.includes(ch.type)
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
        && voicechannels.includes(ch.type) || textchannels.includes(ch.type)
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

export default { Lock, Unlock, SetUserLimit, Lockdown, LiftLockdown, TempLock, KickFromVC };
