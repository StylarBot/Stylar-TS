import { Event } from "../structures/Event";
import log from "../functions/logger";
import { ActivityType } from "discord.js";

export default new Event("ready", async (client) => {
    await client.user.setActivity({
        name: `stylar.vercel.app`,
        type: ActivityType.Custom,
    })
    return log(`${client.user.tag} logged in!`, false);
});