import Antijoin from "../models/Antijoin";
import { Event } from "../structures/Event";

export default new Event("guildMemberAdd", async(member) => {
    const aj = await Antijoin.findOne({ Guild: member.guild.id });
    if(!aj) return;

    if(aj.BotException === true && member.user.bot) return;
    else {
        switch(aj.Punishment) {
            case 'ban': {
                try {
                    await member.ban({ reason: 'Stylar Antijoin' });
                } catch (err) {
                    return;
                }
            }
            break;

            case 'kick': {
                try {
                    await member.kick('Stylar Antijoin');
                } catch (err) {
                    return;
                }
            }
            break;
        }
    }
});