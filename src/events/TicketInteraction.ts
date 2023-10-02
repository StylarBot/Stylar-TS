import {
    EmbedBuilder,
    ChannelType,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} from 'discord.js';
import ticket from '../models/Ticket';
import ticketsystem from '../models/TicketSystem';
import reply from '../functions/Reply';
import { Event } from '../structures/Event';

export default new Event("interactionCreate", async(interaction) => {
    const clientMember = interaction.guild.members.me;
    if(interaction.isButton() && interaction.customId === 'openticket') {
        const validsystem = await ticketsystem.findOne({ Guild: interaction.guildId, Channel: interaction.channelId });
        if(!validsystem) {
            interaction.reply({
                content: "Ticket system not found error. Contact admin and tell them to reinstate the ticket system in this channel.",
                ephemeral: true
            });
            return interaction.message.delete();
        }

        const existingticket = await interaction.guild.channels.cache.find((ch) => ch.name === `${interaction.user.username}-${interaction.user.discriminator}`);
        if(existingticket) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Existing Ticket`)
                .setDescription(`You already have a ticket open! Ask a staff member to close it.`)
                .setColor('Red')
            ], ephemeral: true
        });
        else {
            if(!clientMember.permissions.has('ManageChannels')) return reply(interaction, `I need the Manage Channels permission!`, '🚫', true);

            const ticketchannel = await interaction.guild.channels.create({
                name: `${interaction.user.username}-${interaction.user.discriminator}`,
                permissionOverwrites: [
                    {
                        id: validsystem.StaffRoleID,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "EmbedLinks", "ReadMessageHistory", "UseApplicationCommands"],
                    },
                    {
                        id: interaction.user.id,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "EmbedLinks", "ReadMessageHistory", "UseApplicationCommands"],
                    },
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: ["ViewChannel"]
                    },
                    {
                        id: clientMember.user.id,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "EmbedLinks", "ReadMessageHistory", "UseApplicationCommands"],
                    }
                ],
                type: ChannelType.GuildText,
                topic: `Ticket requested by ${interaction.user.tag} - Stylar Ticket System`,
                reason: `Stylar Ticket System - Ticket Created`
            });

            let contributors = [];

            const allcontributors = await interaction.guild.members.cache.filter((members) => members.roles.cache.has(validsystem.StaffRoleID));
            allcontributors.forEach((contributor) => {
                contributors.push(`<@${contributor.id}>`)
            });

            const validticket = await ticket.create({
                Guild: interaction.guildId,
                Active: true,
                Channel: ticketchannel.id,
                Contributors: [contributors.join('\n')],
                Transcript: [],
                User: interaction.user.id,
                AllUsers: [clientMember.user.id, interaction.user.id, contributors.join(", ")]
            });

            await interaction.reply({
                content: `Ticket created! Check out <#${ticketchannel.id}> to see your ticket!`,
                ephemeral: true
            });

            const date = new Date();
            const nowms = date.getTime();

            const discordms = Math.round(nowms / 1000);

            const button1 = new ButtonBuilder()
            .setCustomId('closeticketx')
            .setEmoji('💀')
            .setLabel('Close Ticket')
            .setStyle(ButtonStyle.Danger)

            const row = new ActionRowBuilder<ButtonBuilder>()
            .setComponents(button1)

            const button2 = new ButtonBuilder()
            .setCustomId('deletech')
            .setEmoji('🗑️')
            .setLabel('Delete Ticket Channel')
            .setStyle(ButtonStyle.Danger)

            const row2 = new ActionRowBuilder<ButtonBuilder>()
            .setComponents(button2)
            
            const message = await ticketchannel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`A new ticket has been created.`)
                    .setDescription(`**Ticket Created By:**\n${interaction.user}\n**Time/Date Created:**\n<t:${discordms}>\n**Contributors:**\n${contributors.join('\n')}`)
                    .setColor('Blue')
                ],
                components: [row],
                content: `${contributors.join(', ')}`
            });

            const collector = await message.createMessageComponentCollector();

            collector.on('collect', async(results) => {
                if(results.customId === 'close') {
                    const channel = await interaction.guild.channels.cache.get(validticket.Channel);
                    if(!channel) {
                        await validticket.deleteOne();
                        throw "That channel was not found. Ticket closing automatically.";
                    }
    
                    await validticket.deleteOne();
    
                    const mes = await results.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`Ticket Successfully Closed`)
                            .setDescription(`This ticket has successfully been closed.\nClosed by: ${interaction.user}.`)
                            .setColor('Blue')
                        ], components: [row2]
                    });

                    const collector = await mes.createMessageComponentCollector();

                    collector.on('collect', async(results) => {
                        if(results.customId === 'deletech') {
                            await results.channel.delete();
                        } else return;
                    });
                } else return;
            });
        }
    } else if(interaction.isButton() && interaction.customId === 'closeticketx') {
        interaction.message.edit({
            content: `${interaction.message.content}`,
            components: [],
        });
        const validticket = await ticket.findOne({ Guild: interaction.guildId, Channel: `${interaction.channelId}` });
        if(!validticket) {
            interaction.reply({ content: `This ticket doesn't exist. Closing channel.` });

            setTimeout(() => {
                interaction.channel.delete();
            }, 15000);
            return;
        }

        validticket.Active = false;
        validticket.save();

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Ticket Successfully Closed`)
                .setDescription(`This ticket has successfully been closed.\nClosed by: ${interaction.user}.`)
                .setColor('Blue')
            ]
        });
    }
});