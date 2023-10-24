import axios from "axios";
import { Command } from "../../structures/Command";
import info from '../../../StylarInfo.json';
import { EmbedBuilder } from "discord.js";
import git from 'git-commit-count';

export default new Command({
    name: 'patch',
    description: 'Get the latest Stylar update!',

    run: async({ interaction }) => {
        const { data } = await axios.get(`${info.gitAPIURL}/commits`);
        
        return console.log(data);

        git();
        const count = await git(`${info.gitRepo}`);
        const version = `v0.${count / 10}`;

        const updatedate = new Date(data.commit.committer.date);
        const updatedms = updatedate.getTime();
        const updatedcms = Math.round(updatedms / 1000);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Stylar ${version}`)
                .setDescription(`${data.commit.message}\n\nCommitted by: @[${data.commit.committer.name}](https://github.com/${data.commit.committer.name})`)
                .setColor('Blue')
                .setFooter({ text: `Committed on <t:${updatedcms}> (<t:${updatedcms}:R>)` })
            ]
        })
    }
})