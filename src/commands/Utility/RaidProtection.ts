import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import Antijoin from "../../models/Antijoin";
import RaidProtection from "../../models/RaidProtection";

export default new Command({
    name: 'raid-protection',
    description: 'Protect your server from raiders!',
    userPermissions: ['Administrator'],
    clientPermissions: ['ManageChannels', 'ModerateMembers'],
    options: [
        {
            name: 'enable',
            description: 'Enable the raid protection system!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'member-role',
                    description: 'Got a member role? @ it here!',
                    type: ApplicationCommandOptionType.Role,
                }
            ]
        },
        {
            name: 'disable',
            description: 'Disable raid protection system!',
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],

    run: async({ interaction, guild, opts, client }) => {
        const sub = opts.getSubcommand();
        const mr = await opts.getRole('member-role') || guild.roles.everyone;

        const validmr = await guild.roles.cache.get(mr.id);
        if(!validmr) throw "That role is not in this server.";

        switch(sub) {
            case 'enable': {
                const raidprot = await RaidProtection.findOne({ Guild: guild.id });
                if(!raidprot) {
                    await RaidProtection.create({
                        Guild: guild.id,
                        Enabled: true,
                    });
                } else {
                    if(raidprot.Enabled === true) throw "Raid Protection is already enabled!";
                    raidprot.Enabled = true;
                    raidprot.save();
                }

                const channels = await guild.channels.cache.filter((ch) => ch.permissionsFor(client.user).has('ManageChannels') && ch.isTextBased());
                if(channels.size <= 0) throw "There are no channels that give me the permission to change their permissions!";

                channels.forEach((cha) => {
                    if(!cha.isTextBased()) return;
                });
            }
            break;

            case 'disable': {

            }
            break;
        }
    }
})