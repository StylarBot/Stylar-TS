import { Command } from "../../structures/Command";
import RoleUtil from "../../functions/RoleUtil";
import { ApplicationCommandOptionType } from "discord.js";

export default new Command({
    name: 'role',
    description: 'Stylar\'s incredible role management features!',
    userPermissions: ['ManageRoles'],
    options: [
        {
            name: 'add',
            description: 'Add a role to a user!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to add the role to!',
                    required: true,
                    type: ApplicationCommandOptionType.User
                },
                {
                    name: 'role',
                    description: 'The role you want to add to the user!',
                    required: true,
                    type: ApplicationCommandOptionType.Role,
                }
            ]
        },
        {
            name: 'remove',
            description: 'Remove a role from a user!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to remove the role from!',
                    required: true,
                    type: ApplicationCommandOptionType.User
                },
                {
                    name: 'role',
                    description: 'The role you want to remove from the user!',
                    required: true,
                    type: ApplicationCommandOptionType.Role,
                }
            ]
        },
        {
            name: 'check',
            description: 'Check if a user has a role!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to check the role for!',
                    required: true,
                    type: ApplicationCommandOptionType.User
                },
                {
                    name: 'role',
                    description: 'The role you want to check the user has!',
                    required: true,
                    type: ApplicationCommandOptionType.Role,
                }
            ]
        }
    ],

    run: async({ interaction, guild, opts }) => {
        const user = opts.getUser('user');
        const role = opts.getRole('role');
        const clientMember = guild.members.me;

        const sub = opts.getSubcommand();
        
        const member = await guild.members.cache.get(user.id);
        if(!member) throw "That is not a valid member in this server.";

        const validrole = await guild.roles.cache.get(role.id);
        if(!validrole) throw "That is not a valid role in this server.";

        switch(sub) {
            case 'add': {
                await RoleUtil.AssignRole(interaction, member, validrole, clientMember)
            }
            break;

            case 'remove': {
                await RoleUtil.RemoveRole(interaction, member, validrole, clientMember)
            }
            break;

            case 'check': {
                await RoleUtil.CheckRole(interaction, member, validrole);
            }
            break;
        }
    }
})