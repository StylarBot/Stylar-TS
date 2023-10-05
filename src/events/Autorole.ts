import Autorole from "../models/Autorole";
import { Event } from "../structures/Event";

export default new Event("guildMemberAdd", async(member) => {
    const ar = await Autorole.findOne({ Guild: member.guild.id });
    if(!ar) return;

    const validroles = [];

    ar.Roles.forEach(async (role) => {
        const checkrole = await member.guild.roles.cache.get(role);
        if(checkrole) validroles.push(checkrole);
    });

    validroles.forEach(async(vr) => {
        await member.roles.add(vr);
    });
});