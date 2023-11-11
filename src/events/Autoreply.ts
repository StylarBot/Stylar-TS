import { Event } from "../structures/Event";
import autoreply from "../models/Autoreply";

export default new Event("messageCreate", async (message) => {
    if(message.author.bot) return;
    try {
        const autoreplies = await autoreply.find({ Guild: message.guild.id });
        if (!autoreplies || autoreplies.length <= 0) return;

        for (const ar of autoreplies) {
            if (message.content.toLowerCase() === ar.Phrase) {
                await message.reply({ content: `${ar.Reply}` });
            }
        }
    } catch (error) {
        console.error("Error while handling messageCreate event:", error);
    }
});