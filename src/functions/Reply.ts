import { EmbedBuilder } from "discord.js";
import { ExtendedInteraction } from "../typings/Command";

export default async function Reply(interaction: ExtendedInteraction, message: string, emoji: string, ephemeral: boolean) {
    switch(ephemeral) {
        case true: {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`${emoji || "✅"} | ${message}`)
                    .setColor('Blue')
                ], ephemeral: true
            });
        }
        break;

        case false: {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`${emoji || "✅"} | ${message}`)
                    .setColor('Blue')
                ]
            });
        }
        break;

        default: {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`${emoji || "✅"} | ${message}`)
                    .setColor('Blue')
                ], ephemeral: true
            });
        }
        break;
    }
}