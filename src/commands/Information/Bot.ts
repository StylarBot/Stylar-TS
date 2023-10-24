import { Command } from "../../structures/Command";
import commit from 'git-commit-count';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import info from '../../../StylarInfo.json';

export default new Command({
    name: 'bot',
    description: 'Get the information about the bot!',

    run: async({ interaction, client }) => {
        commit();
        const count = commit(`${info.gitRepo}`);
        const commitcount = count / 10;
        const name = interaction.guild.members.me.user.username;
        const icon = `${interaction.guild.members.me.displayAvatarURL()}`;

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

        let ping = `${Date.now() - interaction.createdTimestamp}ms`;

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                .setLabel('Support Server')
                .setStyle(ButtonStyle.Link)
                .setURL(`${info.supportServer}`),

                new ButtonBuilder()
                .setLabel('Bot Invite')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=28582469824214&scope=bot%20applications.commands`),

                new ButtonBuilder()
                .setLabel('GitHub Repository')
                .setStyle(ButtonStyle.Link)
                .setURL(`${info.gitRepoURL}`)
            )

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setAuthor({
                name: name,
                iconURL: icon
            })
            .setThumbnail(`${icon}`)
            .setFooter({
                text: `Bot ID: ${interaction.guild.members.me.id}`
            })
            .setTimestamp()
            .addFields({
                name: 'Servers Joined',
                value: `${client.guilds.cache.size} servers`,
                inline: true
            }, {
                name: 'Developer',
                value: `${require('../../../package.json').author || "None"}`,
                inline: true
            }, {
                name: 'Discord Latency',
                value: `${ping}`,
                inline: true
            }, {
                name: 'Registered Commands',
                value: `${client.commands.size} commands`,
                inline: true
            }, {
                name: 'Version',
                value: `0.${commitcount}`,
                inline: true
            }, {
                name: 'discord.js version',
                value: `${require('../../../package.json').dependencies['discord.js'].replace('^', '')}`,
                inline: true
            }, {
                name: 'Uptime',
                value: `\`\`\`${uptime}\`\`\``,
            })

        return interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
})