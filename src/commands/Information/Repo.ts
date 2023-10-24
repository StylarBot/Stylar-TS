import { Command } from "../../structures/Command";
import commit from 'git-commit-count';
import axios from "axios";
import { EmbedBuilder } from "discord.js";

export default new Command({
    name: 'repo',
    description: 'Get information on Stylar\'s latest release!',
    
    run: async({ interaction, client }) => {
        commit();
        const count = commit('stylarbot/stylar-ts');
        const commitcount = `0.${count / 10}`;

        const { data } = await axios.get(`https://api.github.com/repos/StylarBot/Stylar-TS`);

        const creationdate = new Date(data.created_at);
        const creationms = creationdate.getTime();
        const creationdcms = Math.round(creationms / 1000);

        const pusheddate = new Date(data.pushed_at);
        const pushedms = pusheddate.getTime();
        const pusheddcms = Math.round(pushedms / 1000);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${data.full_name} - v0.${commitcount}`)
                .setURL(data.html_url)
                .setFields(
                    { name: 'Description', value: `${data.description}`, inline: true },
                    { name: 'Creation Date', value: `<t:${creationdcms}> (<t:${creationdcms}:R>)`, inline: true },
                    { name: 'Most Recent Push', value: `<t:${pusheddcms}> (<t:${pusheddcms}:R>)`, inline: true },
                    { name: 'Language', value: `${data.language}`, inline: true },
                    { name: 'License', value: `${data.license.name} (${data.license.spdx_id})`, inline: true },
                    { name: 'Default Branch', value: `${data.default_branch}`, inline: true }
                )
                .setColor('Blue')
                .setThumbnail(data.owner.avatar_url)
                .setFooter({ text: `Stylar™️`, iconURL: `${client.user.displayAvatarURL({ size: 1024 })}` })
            ]
        });
    }
})