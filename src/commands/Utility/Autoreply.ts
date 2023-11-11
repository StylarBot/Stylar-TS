import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import autoreply from "../../models/Autoreply";
import reply from "../../functions/Reply";

export default new Command({
    name: 'autoreply',
    description: 'Setup an autoreply function in your server!',
    userPermissions: ['ManageChannels'],
    options: [
        {
            name: 'add',
            description: 'Add an autoreply!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'phrase',
                    description: 'What do you want to trigger the bot?',
                    required: true,
                    type: ApplicationCommandOptionType.String,
                    maxLength: 1024,
                },
                {
                    name: 'reply',
                    description: 'What do you want the bot to reply with?',
                    required: true,
                    type: ApplicationCommandOptionType.String,
                    maxLength: 1024,
                }
            ]
        },
        {
            name: 'remove',
            description: 'Remove an autoreply!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'phrase',
                    description: 'What was the phrase that triggered the autoreply?',
                    required: true,
                    maxLength: 1024,
                    type: ApplicationCommandOptionType.String,
                }
            ]
        },
        {
            name: 'removeall',
            description: 'Remove all autoreplies in the server!',
            type: ApplicationCommandOptionType.Subcommand
        }
    ],

    run: async({ interaction, guild, opts }) => {
        const sub = opts.getSubcommand();
        const phrase = opts.getString('phrase');
        const reply_a = opts.getString('reply');

        switch(sub) {
            case 'add': {
                const exists = await autoreply.findOne({ Guild: guild.id, Phrase: phrase });
                if(exists) throw "An autoreply with that trigger already exists!";

                await autoreply.create({
                    Guild: guild.id,
                    Phrase: phrase,
                    Reply: reply_a,
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`✅ Autoreply set up`)
                        .setDescription('An autoreply has been set up in the server.')
                        .setColor('Blue')
                        .addFields(
                            { name: 'Phrase (trigger)', value: `"${phrase}"` },
                            { name: 'Response', value: `"${reply_a}"` },
                            { name: 'Added By', value: `<@${interaction.user.id}>` }
                        )
                        .setThumbnail(guild.iconURL({ size: 1024 }))
                    ]
                });
            }
            break;

            case 'remove': {
                const exists = await autoreply.findOne({ Guild: guild.id, Phrase: phrase });
                if(!exists) throw "That autoreply doesn't exist! Make sure you got the phrase right.";

                await exists.deleteOne();
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`✅ Autoreply removed`)
                        .setDescription('An autoreply has been removed from the server.')
                        .setColor('Blue')
                        .addFields(
                            { name: 'Phrase (trigger)', value: `"${phrase}"` },
                            { name: 'Response', value: `"${reply_a}"` },
                            { name: 'Removed By', value: `<@${interaction.user.id}>` }
                        )
                        .setThumbnail(guild.iconURL({ size: 1024 }))
                    ]
                });
            }
            break;

            case 'removeall': {
                const allreplies = await autoreply.find({ Guild: guild.id });
                if(!allreplies || allreplies.length <= 0) throw "There are no autoreplies set up in this server.";

                const button1 = new ButtonBuilder()
                .setCustomId('confirm')
                .setEmoji('✅')
                .setLabel('Confirm')
                .setStyle(ButtonStyle.Success)

                const button2 = new ButtonBuilder()
                .setCustomId('abort')
                .setEmoji('❌')
                .setLabel('Abort')
                .setStyle(ButtonStyle.Danger)

                const row = new ActionRowBuilder<ButtonBuilder>()
                .setComponents(button1, button2)

                const msg = await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`⚠️ Confirmation Needed.`)
                        .setDescription(`Are you sure you want to remove ALL autoreplies from the server?\nThis cannot be undone.`)
                        .setColor('Orange')
                    ], components: [row], ephemeral: true
                });

                const collector = await msg.createMessageComponentCollector({ time: 30000 });

                collector.on('collect', async(results) => {
                        if(results.user.id !== interaction.user.id) {
                            results.reply({ content: `This is not your prompt!`, ephemeral: true });
                            return;
                        }
                        if(results.customId === 'confirm') {
                            let phrases = [];
                            let replies = [];
    
                            allreplies.forEach((autoreply) => {
                                phrases.push(`"${autoreply.Phrase}"`);
                                replies.push(`"${autoreply.Reply}"`);
                            });
    
                            await autoreply.deleteMany({ Guild: guild.id });
    
                            results.update({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle(`✅ All autoreplies removed`)
                                    .setDescription('All autoreplies have been removed from the server.')
                                    .setColor('Blue')
                                    .addFields(
                                        { name: 'Phrase (trigger)', value: `${phrases.join(', ')}` },
                                        { name: 'Response', value: `${replies.join(', ')}` },
                                        { name: 'Removed By', value: `<@${interaction.user.id}>` }
                                    )
                                    .setThumbnail(guild.iconURL({ size: 1024 }))
                                ], components: []
                            });
                            return;
                        } else if (results.customId === 'abort') {
                            results.update({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle(`❌ Operation Aborted`)
                                    .setDescription(`The operation has been cancelled due to inactivity.`)
                                    .setColor('Red')
                                ], components: []
                            });
                            return;
                        }
                    });
                    
                    collector.on('end', async() => {
                        msg.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`❌ Operation Aborted`)
                                .setDescription(`The operation has been cancelled due to inactivity.`)
                                .setColor('Red')
                            ], components: []
                        });
                        return;
                    })
            }
            break;
        }
    }
})