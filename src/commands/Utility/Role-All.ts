import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export default new Command({
    name: 'role-all',
    description: 'Assign a role to all users in the server!',
    clientPermissions: ['ManageRoles'],
    userPermissions: ['ManageRoles'],
    options: [
        {
            name: 'role',
            description: 'The role you want to add to all users!',
            required: true,
            type: ApplicationCommandOptionType.Role,
        }
    ],

    run: async({ interaction, opts, guild }) => {
        const role = opts.getRole('role');
        const validrole = await guild.roles.cache.get(role.id);
        if(!validrole) throw "That is not a valid role in this server.";

        if(validrole.position >= guild.members.me.roles.highest.position) throw "I cannot assign that role because its position is higher than my role's highest position.";

        const msg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Assigning Role-All`)
                .setDescription(`<a:discloading:1159379929499185173> I am assigning a role (<&@${validrole.id}>) to all users in this server.\nPlease do not assign/remove any roles during this process.`)
                .setColor('Blue')
                .setFooter({ text: `Stylar Role-All` })
            ]
        });

        let rolenotassigned = [];
        let roleassigned = [];

        const validmembers = await guild.members.cache.filter((mem) => mem.roles.highest.position < guild.members.me.roles.highest.position);
        const nonvalidmembers = await guild.members.cache.filter((mem) => mem.roles.highest.position >= guild.members.me.roles.highest.position);

        if(!validmembers || validmembers.size <= 0) throw "There are no valid members that can be assigned that role. Please make sure my highest role position is above the role you want to assign.";

        if(nonvalidmembers.size > 0) {
            nonvalidmembers.forEach((nvm) => {
                rolenotassigned.push(`<@${nvm.id}>`);
            });

            validmembers.forEach(async (vm) => {
                await vm.roles.add(validrole.id);
                roleassigned.push(`<@${vm.id}>`);
            });

            await msg.edit({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`⚠️ Assigned Role-All`)
                    .setDescription(`✅ I have assigned a role (<&@${validrole.id}>) to ${roleassigned.length} users in this server.\nI was not able to apply the role to ${rolenotassigned.length} users however.`)
                    .setColor('Blue')
                    .setFooter({ text: `Stylar Role-All` })
                ]
            });
        } else {
            validmembers.forEach(async (vm) => {
                await vm.roles.add(validrole.id);
                roleassigned.push(`<@${vm.id}>`);
            });

            await msg.edit({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`⚠️ Assigned Role-All`)
                    .setDescription(`✅ I have assigned a role (<&@${validrole.id}>) to ${roleassigned.length} users in this server.`)
                    .setColor('Blue')
                    .setFooter({ text: `Stylar Role-All` })
                ]
            });
        }
    }
})