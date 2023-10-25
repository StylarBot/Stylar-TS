import axios from "axios";
import { Command } from "../../structures/Command";
import info from '../../../StylarInfo.json';
import { EmbedBuilder } from "discord.js";
import git from 'git-commit-count';

export default new Command({
    name: 'patch',
    description: 'Get the latest Stylar update!',

    run: async({ interaction, client }) => {
        const { data } = await axios.get(`${info.gitAPIURL}/commits`);
        
        const dater = data[0];

        git();
        const count = await git(`${info.gitRepo}`);
        const version = `v0.${count / 10}`;

        const updatedate = new Date(dater.commit.committer.date);
        const updatedms = updatedate.getTime();
        const updatedcms = Math.round(updatedms / 1000);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Stylar ${version}`)
                .setDescription(`**Stylar has updated! Here's what's new:**\n${dater.commit.message}`)
                .setColor('Blue')
                .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
                .setTimestamp(updatedms)
                .setFooter({ text: `${dater.commit.committer.name}`, iconURL: `${dater.author.avatar_url}` })
            ]
        })
    }
})