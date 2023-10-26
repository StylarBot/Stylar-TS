import ConvertDiscordMS from "../../functions/ConvertDiscordMS";
import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export default new Command({
    name: 'channelinfo',
    description: 'Get information on a channel!',
    options: [
        {
            name: 'channel',
            description: 'The channel you want to get information on!',
            type: ApplicationCommandOptionType.Channel,
        }
    ],
    
    run: async({ interaction, guild, client, opts }) => {
        const ch = opts.getChannel('channel') || interaction.channel;
        const channel = await guild.channels.cache.get(ch.id);
        if(!channel) throw "That channel isn\'t in this server.";

        if(!channel.permissionsFor(interaction.member).has('ViewChannel'))
        throw "That channel is not visible to you.";

        if(!channel.permissionsFor(client.user).has('ViewChannel'))
        throw "That channel is not visible to me.";

        const creationms = await ConvertDiscordMS(channel.createdTimestamp);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Channel Information - ${channel.name}`)
                .setDescription(`Below is the information regarding: <#${channel.id}>`)
                .setFields(
                    { name: 'Creation', value: `<t:${creationms}> (<t:${creationms}:R>)`, inline: true },
                    { name: 'ID', value: `${channel.id}`, inline: true },
                    { name: 'Type', value: `${channel.type}`, inline: true },
                    { name: 'Parent ID', value: `${channel.parentId || "No Assigned Parent."}`, inline: true },
                    { name: 'Viewable?', value: `${channel.viewable}`, inline: true },
                    { name: 'Manageable?', value: `${channel.manageable}`, inline: true }
                )
                .setColor('Blue')
                .setThumbnail(guild.iconURL({ size: 1024 }))
            ]
        });
    }
})