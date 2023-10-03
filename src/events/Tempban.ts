import { Event } from "../structures/Event";
import tempban from "../models/Tempban";

export default new Event("ready", async(client) => {
    setInterval(async () => {
        const date = new Date();
        const nowMS = date.getTime();
        client.guilds.cache.forEach(async(guild) => {
            const validtempbans = await tempban.find({ Guild: guild.id });

            if(validtempbans.length <= 0) return;

            validtempbans.forEach(async(tban) => {
                if(parseInt(tban.DateExpiresMS) >= nowMS) {
                    const server = await client.guilds.cache.get(tban.Guild);
                    if(!server) {
                        tban.deleteOne();
                        tban.save();
                    } else {
                        const member = await server.bans.cache.find((ban) => ban.user.id === tban.User);
                        if(!member) {
                            tban.deleteOne();
                            tban.save();
                        } else {
                            await server.bans.remove(tban.User);
                            tban.deleteOne();
                            tban.save();
                        }
                    }
                } else return;
            });
        })
    }, 10000);
});