import { Event } from "../structures/Event";
import log from "../functions/logger";

export default new Event("ready", async (client) => {
    return log(`${client.user.tag} logged in!`, false);
});