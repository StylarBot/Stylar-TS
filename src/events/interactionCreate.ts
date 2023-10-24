import { CommandInteractionOptionResolver, EmbedBuilder } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { ExtendedGuild, ExtendedInteraction } from "../typings/Command";
import BlacklistCommand from "../models/BlacklistCommand";
import BlacklistUser from "../models/BlacklistUser";

export default new Event("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return interaction.reply({ content: "You have used a non existent command" });

        const bc = await BlacklistCommand.findOne({ Guild: interaction.guildId });
        const bu = await BlacklistUser.findOne({ Guild: interaction.guildId });

        if(bc && bc.Commands.includes(command.name)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Command Blacklisted.`)
                    .setDescription(`This command has been blacklisted by an admin.\nIt will not be able to be used until it is whitelisted.`)
                    .setColor('Red')
                ]
            });
        }

        if(bu && bu.Users.includes(interaction.user.id)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`User Blacklisted.`)
                    .setDescription(`You have been blacklisted from using commands by an admin.\nYou will not be able to use commands until you are whitelisted.`)
                    .setColor('Red')
                ]
            });
        }

        try {
            await command.run({
                opts: interaction.options as CommandInteractionOptionResolver,
                client,
                guild: interaction.guild as ExtendedGuild,
                interaction: interaction as ExtendedInteraction
            });
        } catch (err) {
            console.log(err);
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`❌ Error`)
                    .setDescription(`${err}`)
                    .setColor('Red')
                ]
            });
        }
    }
});
