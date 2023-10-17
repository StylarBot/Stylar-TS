import { Command } from "../../structures/Command";
import {
    ChannelType,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ApplicationCommandOptionType
} from 'discord.js';

export default new Command({
    name: 'purge',
    description: 'Remove a certain amount of messages from a channel!',
    userPermissions: ['ManageMessages'],
    options: [
        {
            name: 'amount',
            description: 'The amount of messages you want to remove!',
            type: ApplicationCommandOptionType.Integer,
            maxValue: 100,
            required: true
        },
        {
            name: 'channel',
            description: 'The channel you want to remove the messages from!',
            type: ApplicationCommandOptionType.Channel,
        },
        {
            name: 'user',
            description: 'The user whos messages you want to clear!',
            type: ApplicationCommandOptionType.User,
        },
    ],

    run: async({ interaction, guild, opts }) => {
        const amount = opts.getInteger('amount');
        const channel = opts.getChannel('channel') || interaction.channel;
        const user = opts.getUser('user');

        const validchannel = await guild.channels.cache.get(channel.id);
        if(!validchannel) throw "That channel is not of type GuildText.";
        if(validchannel.type !== ChannelType.GuildText) throw "That channel is not of type GuildText.";

        const messages = await validchannel.messages.fetch({
            limit: amount + 1,
        });

        const button = new ButtonBuilder()
        .setCustomId('delete')
        .setStyle(ButtonStyle.Primary)
        .setLabel('🗑️')

        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(button)

        if(user) {
            let i = 0;
            const filtered = [];

            await messages.filter((msg) => {
                if(msg.author.id === user.id && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });

            await validchannel.bulkDelete(filtered).then(async messages => {
                const msg = await interaction.reply({
                    content: `\`\`\`✅ Deleted ${messages.size} sent by ${user.tag}\`\`\``,
                    ephemeral: false,
                    components: [row]
                });

                const collector = await msg.createMessageComponentCollector();

                collector.on('collect', async(results) => {
                    if(results.customId === 'delete') {
                        await msg.delete();
                    } else return;
                });
            });
        } else {
            await validchannel.bulkDelete(amount, true).then(async messages => {
                const msg = await interaction.reply({
                    content: `\`\`\`✅ Deleted ${messages.size} from ${channel.name}\`\`\``,
                    ephemeral: false,
                    components: [row]
                });

                const collector = await msg.createMessageComponentCollector();

                collector.on('collect', async(results) => {
                    if(results.customId === 'delete') {
                        await msg.delete();
                    } else return;
                });
            });
        }
    }
})