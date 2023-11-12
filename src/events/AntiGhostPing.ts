import { Event } from "../structures/Event";
import AntiGhostPing from "../models/AntiGhostPing";

export default new Event("messageDelete", async(msg) => {
    if(msg.author.bot) return;
    const data = await AntiGhostPing.findOne({ Guild: msg.guildId });
    if(!data) return;
    else {
        if(msg.mentions.members.first()) {
            const mes = await msg.channel.send({
                content: `<@${msg.author.id}>, you cannot ghost ping!`,
            });
    
            setTimeout(() => {
                mes.delete();
            }, 3000);
        }
    }
});