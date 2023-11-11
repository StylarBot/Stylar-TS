import { Command } from "../../structures/Command";
import { EmbedBuilder } from "discord.js";
import GetGitCommitInfo from "../../functions/GetGitCommitInfo";

export default new Command({
    name: 'about',
    description: 'Stylar Information!',
    
    run: async({ interaction, client }) => {
        const info = await GetGitCommitInfo();

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Stylar Information`)
                .setDescription(`Version:\n\`\`\`${info.Version}\`\`\``)
                .setFields(
                    { name: 'Creation', value: `<t:${Math.round(info.CreationMS / 1000)}> (<t:${Math.round(info.CreationMS / 1000)}:R>)`, inline: true },
                    { name: '', value: ``, inline: true },
                    { name: '', value: ``, inline: true },
                )
                .setColor('Blue')
                .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
            ]
        })
    }
})