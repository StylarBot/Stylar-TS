import {
    PermissionFlagsBits,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ApplicationCommandOptionType,
    ChannelType
} from "discord.js";
import { Command } from "../../structures/Command";
import reply from "../../functions/Reply";

export default new Command({
    name: 'clear',
    description: 'Clear all messages from a channel.',
    userPermissions: ['ManageMessages'],
    options: [
        {
            name: 'channel',
            description: 'The channel you want to clear messages from.',
            type: ApplicationCommandOptionType.Channel,
        }
    ],

    run: async ({ interaction, guild, opts }) => {
        const c = opts.getChannel('channel') || interaction.channel;
        const channel = await guild.channels.cache.find((ch) => ch.type === ChannelType.GuildText && ch.id === c.id);
        if(!channel) throw "That channel is not in this server.";
        if (channel.type !== ChannelType.GuildText) throw "That channel is not of type GuildText.";

        const button = new ButtonBuilder()
            .setCustomId('delete')
            .setStyle(ButtonStyle.Primary)
            .setLabel('🗑️')

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(button)

        await channel.clone().then(async (ch) => {
            const msg = await ch.send({
                content: `\`\`\`${channel.name} has been cleared all of all of its messages.\`\`\``,
                components: [row]
            });

            await channel.delete();

            const collector = await msg.createMessageComponentCollector();

            collector.on('collect', async (results) => {
                if (results.customId === 'delete') {
                    await msg.delete();
                } else return;
            });
        });
    }
})