import Autoreact from "../models/Autoreact";
import { Event } from "../structures/Event";

export default new Event("messageCreate", async(message) => {
    const ars = await Autoreact.findOne({ Guild: message.guildId, Channel: message.channel.id });
    if(!ars) return;

    ars.Emojis.forEach(async(emoji) => {
        try {
            await message.react(emoji);
        } catch (err) {
            return;
        }
    });
});