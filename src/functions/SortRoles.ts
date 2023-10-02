import { GuildMember } from "discord.js";

export default async function SortRoles(member: GuildMember): Promise<string> {
    await member.fetch();

    const allroles: string[] = [];

    member.roles.cache.forEach((role: any) => {
        allroles.push(`${role}`);
    });

    return allroles.join(', ');
}