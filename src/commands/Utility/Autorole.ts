import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType } from "discord.js";
import Autorole from "../../models/Autorole";
import Reply from "../../functions/Reply";

export default new Command({
    name: 'autorole',
    description: 'Setup the autorole system in your server!',
    userPermissions: ['ManageRoles'],
    clientPermissions: ['ManageRoles'],
    options: [
        {
            name: 'setup',
            description: 'Setup the autorole system in your server!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: 'The role you want to be added to users upon joining!',
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                }
            ]
        },
        {
            name: 'addrole',
            description: 'Add a role to the autorole system!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: 'The role you want to be added to users upon joining!',
                    type: ApplicationCommandOptionType.Role,
                    required: true
                }
            ]
        },
        {
            name: 'removerole',
            description: 'Remove a role from the autorole system!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'role',
                    description: 'The role you want to remove from the autorole system!',
                    required: true,
                    type: ApplicationCommandOptionType.Role
                }
            ]
        },
        {
            name: 'disable',
            description: 'Disable the autorole system!',
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],

    run: async({ interaction, guild, opts }) => {
        const sub = opts.getSubcommand();
        const role = opts.getRole('role');

        switch(sub) {
            case 'setup': {
                const validrole = await guild.roles.cache.get(role.id);
                if(!validrole) throw "That role is not a valid role in this server.";

                const ar = await Autorole.findOne({ Guild: guild.id });
                if(ar) throw "You already have an autorole set up! To add a role, run /autorole addrole.";

                await Autorole.create({
                    Guild: guild.id,
                    Roles: [validrole.id]
                });

                return Reply(interaction, `Successfully set up autorole in this server!\nUpon joining, new members will be assigned the ${role.name} role.`, `✅`, true);
            }
            break;

            case 'addrole': {
                const validrole = await guild.roles.cache.get(role.id);
                if(!validrole) throw "That role is not a valid role in this server.";

                const ar = await Autorole.findOne({ Guild: guild.id });
                if(!ar) throw "You do not have an autorole set up! To setup, run /autorole setup.";

                if(ar.Roles.includes(validrole.id)) throw "That role is already included in the autorole system!";

                await ar.Roles.push(validrole.id);
                await ar.save();

                return Reply(interaction, `Successfully added a role to the autorole in this server!\nUpon joining, new members will be assigned the ${role.name} role.`, `✅`, true);
            }
            break;

            case 'removerole': {
                const validrole = await guild.roles.cache.get(role.id);
                if(!validrole) throw "That role is not a valid role in this server.";

                const ar = await Autorole.findOne({ Guild: guild.id });
                if(!ar) throw "You do not have an autorole set up! To setup, run /autorole setup.";

                if(!ar.Roles.includes(validrole.id)) throw "That role is not included in the autorole system!";

                const index = ar.Roles.indexOf(validrole.id);

                await ar.Roles.splice(index, 1);
                await ar.save();

                return Reply(interaction, `Successfully removed a role from the autorole in this server!\nUpon joining, new members will no longer be assigned the ${role.name} role.`, `✅`, true);
            }
            break;

            case 'disable': {
                const ar = await Autorole.findOne({ Guild: guild.id });
                if(!ar) throw "You do not have an autorole set up! To setup, run /autorole setup.";

                await ar.deleteOne();

                return Reply(interaction, `Successfully disabled the autorole in this server!\nUpon joining, new members will no longer be assigned any roles.`, `✅`, true);
            }
            break;
        }
    }
})