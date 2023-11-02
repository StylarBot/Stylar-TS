import { ChannelType, EmbedBuilder } from "discord.js";
import Welcomer from "../models/Welcomer";
import { Event } from "../structures/Event";

export default new Event("guildMemberAdd", async(m) => {
    const wc = await Welcomer.findOne({ Guild: m.guild.id });
    if(!wc) return;

    const channel = await m.guild.channels.cache.get(wc.Channel);
    if(!channel) return;

    if(channel.type !== ChannelType.GuildText) return;

    return channel.send({
        embeds: [
            new EmbedBuilder()
            .setTitle(`🎉 New Member Joined!`)
            .setDescription(`Welcome to the server <@${m.id}>!`)
            .addFields(
                { name: 'Account Created', value: `<t:${Math.round(m.user.createdTimestamp / 1000)}> (<t:${Math.round(m.user.createdTimestamp / 1000)}:R>)`, inline: true },
                { name: 'Joined Server', value: `<t:${Math.round(m.joinedTimestamp / 1000)}> (<t:${Math.round(m.joinedTimestamp / 1000)}:R>)`, inline: true },
                { name: 'Member Number', value: `${m.guild.members.cache.filter((me) => !me.user.bot).size}`, inline: true },
            )
        ],
        content: `<@${m.id}>`
    })
});