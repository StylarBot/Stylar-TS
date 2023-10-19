import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import Antijoin from "../../models/Antijoin";
import RaidProtection from "../../models/RaidProtection";
import Reply from "../../functions/Reply";

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

                const channels = await guild.channels.cache.filter((ch) => ch.permissionsFor(guild.members.me).has('ManageChannels') && ch.isTextBased() && ch.permissionsFor(mr.id).has('SendMessages'));
                if(channels.size <= 0) throw "There are no channels that give me the permission to change their permissions!";

                let allowedchannels = [];

                channels.forEach((cha) => {
                    cha.permissionsFor(mr.id).remove('SendMessages');
                    allowedchannels.push(cha.id);
                });

                const aj = await Antijoin.findOne({ Guild: guild.id });
                if(!aj) {
                    await Antijoin.create({
                        Guild: guild.id,
                        BotException: false,
                        Punishment: 'Ban',
                    });
                } else {
                    aj.Punishment = 'Ban';
                    aj.save();
                }

                return Reply(interaction, `Raid protection enabled!\n${allowedchannels.length} channels have been locked.\nAntijoin has been enabled.`, `✅`, false);
            }
            break;

            case 'disable': {
                const raidprot = await RaidProtection.findOne({ Guild: guild.id });
                if(!raidprot) {
                    throw "The raid protection isn't enabled!";
                } else {
                    if(raidprot.Enabled === false) throw "Raid Protection is already disabled!";
                    raidprot.Enabled = false;
                    raidprot.save();
                }

                const channels = await guild.channels.cache.filter((ch) => ch.permissionsFor(guild.members.me).has('ManageChannels') && ch.isTextBased() && ch.permissionsFor(mr.id).has('SendMessages'));
                if(channels.size <= 0) throw "There are no channels that give me the permission to change their permissions!";

                let allowedchannels = [];

                channels.forEach((cha) => {
                    cha.permissionsFor(mr.id).add('SendMessages');
                    allowedchannels.push(cha.id);
                });

                const aj = await Antijoin.findOne({ Guild: guild.id });
                if(aj) {
                    await aj.deleteOne({ new: true });
                }

                return Reply(interaction, `Raid protection disabled!\n${allowedchannels.length} channels have been unlocked.\nAntijoin has been disabled.`, `✅`, false);
            }
            break;
        }
    }
})