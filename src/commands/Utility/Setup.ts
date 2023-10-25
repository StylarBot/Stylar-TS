import {
    ApplicationCommandOptionType,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} from "discord.js";
import { Command } from "../../structures/Command";
import Antijoin from "../../models/Antijoin";
import Autoreact from "../../models/Autoreact";
import Autoreply from "../../models/Autoreply";
import Autorole from "../../models/Autorole";

export default new Command({
    name: 'setup',
    description: 'Setup all the systems within Stylar!',

    run: async({ interaction, guild, opts, client }) => {
        const accept = new ButtonBuilder()
        .setCustomId('accept')
        .setEmoji('✅')
        .setLabel('Accept')
        .setStyle(ButtonStyle.Success)

        const deny = new ButtonBuilder()
        .setCustomId('deny')
        .setEmoji('❎')
        .setLabel('Deny')
        .setStyle(ButtonStyle.Success)

        const row = new ActionRowBuilder<ButtonBuilder>()
        .setComponents(accept, deny)

        const msg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Welcome to Stylar:tm:`)
                .setDescription(`Welcome to a whole new world of customisability, with Stylar.\n\nYou've ran \`/setup\` and we're here to help you do just that!\n\nBefore you continue however, please agree to our [Terms of Service](https://stylar.vercel.app/tos) and [Privacy Policy](https://stylar.vercel.app/privacy).\n\`- Stylar Developers\``)
                .setFooter({ text: `Stylar Setup` })
                .setTimestamp()
                .setColor('#7fdf67')
                .setThumbnail('https://i.imgur.com/r1Vg9ng.png')
            ], components: [row], ephemeral: true
        });

        const collector = await msg.createMessageComponentCollector({ time: 30000 });

        collector.on('collect', async(results) => {
            if(results.user.id !== interaction.user.id) {
                await msg.edit({
                    embeds: [],
                    content: `This is not your prompt!`,
                    components: []
                });
                return;
            }

            if(results.customId === 'accept') {
                const antijoinsetup = new ButtonBuilder()
                .setCustomId('antijoinsetup')
                .setLabel('Setup Antijoin')
                .setStyle(ButtonStyle.Primary)

                const setuprow = new ActionRowBuilder<ButtonBuilder>()
                .setComponents(antijoinsetup)

                const me = await msg.edit({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Welcome to Stylar:tm:`)
                        .setDescription(`Welcome to a new world of customisability, with Stylar.\n\n**✅ You have accepted our TOS and Privacy Policy.**\n\nAs you select and setup the individual categories, make sure you fill out using valid \`#channels\` and \`@roles\`!\n\nSelect a button from below and have fun customising your Discord server like no other with Stylar:tm:!`)
                        .setFooter({ text: `Stylar Setup` })
                        .setTimestamp()
                        .setColor('#7fdf67')
                        .setThumbnail('https://i.imgur.com/r1Vg9ng.png')
                    ],
                    components: [setuprow]
                });

                const collector = await me.createMessageComponentCollector({ time: 30000 });

                collector.on('collect', async(results) => {
                    if(results.customId === 'antijoinsetup') {
                        const enableaj = new ButtonBuilder()
                        .setCustomId('enableaj')
                        .setLabel('Enable Anti-Join')
                        .setEmoji('✅')
                        .setStyle(ButtonStyle.Success)

                        const disableaj = new ButtonBuilder()
                        .setCustomId('disableaj')
                        .setLabel('Disable Anti-Join')
                        .setEmoji('❎')
                        .setStyle(ButtonStyle.Success)

                        const ajrow = new ActionRowBuilder<ButtonBuilder>()
                        .setComponents(enableaj, disableaj)

                        const editmsg = await me.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Welcome to Stylar:tm:`)
                                .setDescription(`Welcome to a new world of customisability, with Stylar.\n\nNow setting up: **Stylar Anti-Join**\n\nWould you like to **enable** or **disable** the antijoin system?`)
                                .setFooter({ text: `Stylar Setup` })
                                .setTimestamp()
                                .setColor('#7fdf67')
                                .setThumbnail('https://i.imgur.com/r1Vg9ng.png')
                            ], components: [ajrow]
                        });

                        const collector = await editmsg.createMessageComponentCollector({ time: 30000 });

                        collector.on('collect', async(results) => {
                            const aj = await Antijoin.findOne({ Guild: guild.id });
                            if(results.customId === 'enableaj') {
                                if(aj) {
                                    editmsg.reply({
                                        content: `The antijoin system is already enabled!`,
                                        embeds: [],
                                        components: []
                                    });
                                    return;
                                }

                                const banbutton = new ButtonBuilder()
                                .setCustomId('ajban')
                                .setLabel('Ban New Users')
                                .setStyle(ButtonStyle.Success)
                                .setEmoji('🔨')

                                const kickbutton = new ButtonBuilder()
                                .setCustomId('ajkick')
                                .setLabel('Kick New Users')
                                .setStyle(ButtonStyle.Success)
                                .setEmoji('🥾')

                                const ajpunishmentrow = new ActionRowBuilder<ButtonBuilder>()
                                .setComponents(banbutton, kickbutton)

                                const editmsg1 = await editmsg.edit({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setTitle(`Welcome to Stylar:tm:`)
                                        .setDescription(`Welcome to a new world of customisability, with Stylar.\n\nNow setting up: **Stylar Anti-Join**\n\nWhat would you like the punishment to be for newly-joined users?\n*Please select an option below.*`)
                                        .setFooter({ text: `Stylar Setup` })
                                        .setTimestamp()
                                        .setColor('#7fdf67')
                                        .setThumbnail('https://i.imgur.com/r1Vg9ng.png')
                                    ], components: [ajpunishmentrow]
                                });

                                const collector = await editmsg1.createMessageComponentCollector({ time: 30000 });

                                collector.on('collect', async(results) => {
                                    if(results.customId === 'ajban') {
                                        const y = new ButtonBuilder()
                                        .setCustomId('y')
                                        .setStyle(ButtonStyle.Success)
                                        .setLabel('Yes')
                                        .setEmoji('✅')

                                        const n = new ButtonBuilder()
                                        .setCustomId('n')
                                        .setStyle(ButtonStyle.Success)
                                        .setLabel('No')
                                        .setEmoji('❎')

                                        const ajberow = new ActionRowBuilder<ButtonBuilder>()
                                        .setComponents(y, n)

                                        const msg = await editmsg.edit({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setTitle(`Welcome to Stylar:tm:`)
                                                .setDescription(`Welcome to a new world of customisability, with Stylar.\n\nNow setting up: **Stylar Anti-Join**\nWould you like there to be an exception for bots?`)
                                                .setFooter({ text: `Stylar Setup` })
                                                .setTimestamp()
                                                .setColor('#7fdf67')
                                                .setThumbnail('https://i.imgur.com/r1Vg9ng.png')
                                            ], components: [ajberow]
                                        });

                                        const collector = await msg.createMessageComponentCollector({ time: 30000 });
                                        
                                        collector.on('collect', async(results) => {
                                            if(results.customId === 'y') {
                                                await Antijoin.create({
                                                    Guild: guild.id,
                                                    BotException: true,
                                                    Punishment: 'Ban'
                                                });

                                                await msg.edit({
                                                    embeds: [
                                                        new EmbedBuilder()
                                                        .setTitle(`Welcome to Stylar:tm:`)
                                                        .setDescription(`Welcome to a new world of customisability, with Stylar.\n\nSuccessfully set up **Stylar Anti-Join** with the following settings:`)
                                                        .setFields(
                                                            { name: `Punishment`, value: `Ban`, inline: true },
                                                            { name: `Bot Exception`, value: 'Yes', inline: true }
                                                        )
                                                        .setFooter({ text: `Stylar Setup` })
                                                        .setTimestamp()
                                                        .setColor('#7fdf67')
                                                        .setThumbnail('https://i.imgur.com/r1Vg9ng.png')
                                                    ], components: []
                                                });
                                                return;
                                            } else if (results.customId === 'n') {
                                                await Antijoin.create({
                                                    Guild: guild.id,
                                                    BotException: false,
                                                    Punishment: 'Ban'
                                                });

                                                await msg.edit({
                                                    embeds: [
                                                        new EmbedBuilder()
                                                        .setTitle(`Welcome to Stylar:tm:`)
                                                        .setDescription(`Welcome to a new world of customisability, with Stylar.\n\nSuccessfully set up **Stylar Anti-Join** with the following settings:`)
                                                        .setFields(
                                                            { name: `Punishment`, value: `Ban`, inline: true },
                                                            { name: `Bot Exception`, value: 'No', inline: true }
                                                        )
                                                        .setFooter({ text: `Stylar Setup` })
                                                        .setTimestamp()
                                                        .setColor('#7fdf67')
                                                        .setThumbnail('https://i.imgur.com/r1Vg9ng.png')
                                                    ], components: []
                                                });
                                                return;
                                            }
                                        });
                                    } else if (results.customId === 'ajkick') {
                                        const y = new ButtonBuilder()
                                        .setCustomId('y')
                                        .setStyle(ButtonStyle.Success)
                                        .setLabel('Yes')
                                        .setEmoji('✅')

                                        const n = new ButtonBuilder()
                                        .setCustomId('n')
                                        .setStyle(ButtonStyle.Success)
                                        .setLabel('No')
                                        .setEmoji('❎')

                                        const ajberow = new ActionRowBuilder<ButtonBuilder>()
                                        .setComponents(y, n)

                                        const msg = await editmsg.edit({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setTitle(`Welcome to Stylar:tm:`)
                                                .setDescription(`Welcome to a new world of customisability, with Stylar.\n\nNow setting up: **Stylar Anti-Join**\nWould you like there to be an exception for bots?`)
                                                .setFooter({ text: `Stylar Setup` })
                                                .setTimestamp()
                                                .setColor('#7fdf67')
                                                .setThumbnail('https://i.imgur.com/r1Vg9ng.png')
                                            ], components: [ajberow]
                                        });

                                        const collector = await msg.createMessageComponentCollector({ time: 30000 });
                                        
                                        collector.on('collect', async(results) => {
                                            if(results.customId === 'y') {
                                                await Antijoin.create({
                                                    Guild: guild.id,
                                                    BotException: true,
                                                    Punishment: 'Kick'
                                                });

                                                await msg.edit({
                                                    embeds: [
                                                        new EmbedBuilder()
                                                        .setTitle(`Welcome to Stylar:tm:`)
                                                        .setDescription(`Welcome to a new world of customisability, with Stylar.\n\nSuccessfully set up **Stylar Anti-Join** with the following settings:`)
                                                        .setFields(
                                                            { name: `Punishment`, value: `Kick`, inline: true },
                                                            { name: `Bot Exception`, value: 'Yes', inline: true }
                                                        )
                                                        .setFooter({ text: `Stylar Setup` })
                                                        .setTimestamp()
                                                        .setColor('#7fdf67')
                                                        .setThumbnail('https://i.imgur.com/r1Vg9ng.png')
                                                    ], components: []
                                                });
                                                return;
                                            } else if (results.customId === 'n') {
                                                await Antijoin.create({
                                                    Guild: guild.id,
                                                    BotException: false,
                                                    Punishment: 'Kick'
                                                });

                                                await msg.edit({
                                                    embeds: [
                                                        new EmbedBuilder()
                                                        .setTitle(`Welcome to Stylar:tm:`)
                                                        .setDescription(`Welcome to a new world of customisability, with Stylar.\n\nSuccessfully set up **Stylar Anti-Join** with the following settings:`)
                                                        .setFields(
                                                            { name: `Punishment`, value: `Kick`, inline: true },
                                                            { name: `Bot Exception`, value: 'No', inline: true }
                                                        )
                                                        .setFooter({ text: `Stylar Setup` })
                                                        .setTimestamp()
                                                        .setColor('#7fdf67')
                                                        .setThumbnail('https://i.imgur.com/r1Vg9ng.png')
                                                    ], components: []
                                                });
                                                return;
                                            }
                                        });
                                    }
                                });
                            } else if (results.customId === 'disableaj') {
                                if(!aj) {
                                    editmsg.reply({
                                        content: `The antijoin system is already disabled!`,
                                        embeds: [],
                                        components: []
                                    });
                                    return;
                                }

                                await aj.deleteOne();

                                await editmsg.edit({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setTitle(`Welcome to Stylar:tm:`)
                                        .setDescription(`Welcome to a new world of customisability, with Stylar.\n\nSuccessfully disabled **Stylar Anti-Join.**`)
                                        .setFooter({ text: `Stylar Setup` })
                                        .setTimestamp()
                                        .setColor('#7fdf67')
                                        .setThumbnail('https://i.imgur.com/r1Vg9ng.png')
                                    ], components: []
                                });
                                return;
                            }
                        });
                    }
                });
            } else if (results.customId === 'deny') {
                const ms = await msg.edit({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Welcome to Stylar:tm:`)
                        .setDescription(`Welcome to a new world of customisability, with Stylar.\n\n**❌ Uh oh! To continue setting up Stylar, you must agree to the TOS and Privacy Policy.**`)
                        .setFooter({ text: `Stylar Setup` })
                        .setTimestamp()
                        .setColor('Red')
                        .setThumbnail('https://i.imgur.com/pxr57q2.png')
                    ],
                    components: []
                });

                setTimeout(() => {
                    return ms.delete();
                }, 3000);
            }
        });
    }
})