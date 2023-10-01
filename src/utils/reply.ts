export default async function reply(interaction: any, message: string, emoji: string, ephemeral: boolean, actionrow: any) {
    if (!emoji) emoji = '✅';
    if (!ephemeral) ephemeral = false;

    if (actionrow) {
        const msg = await interaction.reply({
            content: `\`\`\`${emoji || "✅"} ${message}\`\`\``,
            ephemeral: ephemeral,
            components: [actionrow]
        });

        return msg;
    } else {
        const msg = await interaction.reply({
            content: `\`\`\`${emoji || "✅"} ${message}\`\`\``,
            ephemeral: ephemeral
        });

        return msg;
    }
}