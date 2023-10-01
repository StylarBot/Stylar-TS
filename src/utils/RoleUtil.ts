import { GuildMember, Role, Snowflake } from 'discord.js';

import reply from './reply';

async function AssignRole(interaction: any, member: GuildMember, role: Role, clientMember: GuildMember): Promise<void> {
    const validrole = await interaction.guild.roles.cache.get(role.id);
    if (!validrole) return reply(interaction, `That role is not in this server or is not findable.`, '🚫', true, []);

    if (role.position >= clientMember.roles.highest.position) return reply(interaction, `That role has a higher role position than my highest role.`, '🚫', true, []);

    if (role.position >= interaction.member.roles.highest.position) return reply(interaction, `That role has a higher position than your highest role position.`, '🚫', true, []);

    if (member.roles.cache.has(role.id)) return reply(interaction, `That member already has the ${role.name} role.`, '🚫', true, []);

    try {
        member.roles.add(role.id);
    } catch (err) {
        return reply(interaction, `An error occured: ${err}`, '🚫', true, []);
    }

    return reply(interaction, `Successfully added ${role.name} role to ${member.user.tag}`, '', true, []);
}

async function RemoveRole(interaction: any, member: GuildMember, role: Role, clientMember: GuildMember): Promise<void> {
    const validrole = await interaction.guild.roles.cache.get(role.id);
    if (!validrole) return reply(interaction, `That role is not in this server or is not findable.`, '🚫', true, []);

    if (role.position >= clientMember.roles.highest.position) return reply(interaction, `That role has a higher role position than my highest role.`, '🚫', true, []);

    if (role.position >= interaction.member.roles.highest.position) return reply(interaction, `That role has a higher position than your highest role position.`, '🚫', true, []);

    if (!member.roles.cache.has(role.id)) return reply(interaction, `That member already has the ${role.name} role.`, '🚫', true, []);

    try {
        member.roles.remove(role.id);
    } catch (err) {
        return reply(interaction, `An error occured: ${err}`, '🚫', true, []);
    }

    return reply(interaction, `Successfully removed ${role.name} role from ${member.user.tag}`, '', true, []);
}

async function CheckRole(interaction: any, member: GuildMember, role: Role): Promise<void> {
    const validrole = await interaction.guild.roles.cache.get(role.id);
    if (!validrole) return reply(interaction, `That role is not in this server or is not findable.`, '🚫', true, []);

    if (member.roles.cache.has(validrole.id)) return reply(interaction, `${member.user.tag} does have the ${validrole.name} role.`, '', true, []);
    else return reply(interaction, `${member.user.tag} does not have the ${validrole.name} role`, '', true, []);
}

export { AssignRole, RemoveRole, CheckRole };