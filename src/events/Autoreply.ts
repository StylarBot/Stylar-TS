import { Event } from "../structures/Event";
import autoreply from "../models/Autoreply";

export default new Event("messageCreate", async (message) => {
    try {
        const autoreplies = await autoreply.find({ Guild: message.guild.id });
        if (!autoreplies || autoreplies.length <= 0) return;

        for (const ar of autoreplies) {
            if (message.content.includes(ar.Phrase)) {
                await message.reply({ content: `${ar.Reply}` });
            }
        }
    } catch (error) {
        console.error("Error while handling messageCreate event:", error);
    }
});