import Moderation from "../../models/Moderation";
import BlacklistUser from "../../models/BlacklistUser";
import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export default new Command({
    name: 'inspect',
    description: 'Check a user\'s punishments all in one!',
    userPermissions: ['ModerateMembers'],
    options: [
        {
            name: 'user',
            description: 'The user you want to inspect!',
            type: ApplicationCommandOptionType.User,
        }
    ],

    run: async({ interaction, guild, opts, client }) => {
        const user = opts.getUser('user') || interaction.user;
        const member = await guild.members.cache.get(user.id);
        if(!member) throw "That member is not in this server.";

        let bl;

        const punishments = await Moderation.find({ User: member.id });
        const blacklisted = await BlacklistUser.findOne({ Guild: guild.id });

        if(!blacklisted) bl = 'No';
        else {
            if(blacklisted.Users.includes(member.id)) bl = 'Yes';
            else bl = 'No';
        }

        let bans;
        let kicks;
        let warnings;

        bans = punishments.filter((p) => p.Punishment === 'Ban').length;
        kicks = punishments.filter((p) => p.Punishment === 'Kick').length;
        warnings = punishments.filter((p) => p.Punishment === 'Warn').length;

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Account Inspection - ${member.user.tag}`)
                .setDescription(`Joined: <t:${Math.round(member.joinedTimestamp / 1000)}:R>\nCreated: <t:${Math.round(member.user.createdTimestamp / 1000)}:R>`)
                .setColor('Blue')
                .setFields(
                    { name: 'Bans', value: `${bans}`, inline: true },
                    { name: 'Kicks', value: `${kicks}`, inline: true },
                    { name: `Warnings`, value: `${warnings}`, inline: true }
                )
                .setFooter({ text: `https://github.com/StylarBot`, iconURL: `${client.user.avatarURL()}` })
                .setThumbnail(member.displayAvatarURL({ size: 1024 }))
            ]
        })
    }
})