import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import ms from 'ms';
import punishment from "../../models/Moderation";
import tempban from "../../models/Tempban";
import reply from "../../functions/Reply";

export default new Command({
    name: "tempban",
    description: "Temporarily ban a user from the server!",
    options: [
        {
            name: 'user',
            description: 'The user you want to tempban!',
            required: true,
            type: ApplicationCommandOptionType.User
        },
        {
            name: 'duration',
            description: 'The duration of the tempban! (e.g. 2 days, 2 hours)',
            required: true,
            type: ApplicationCommandOptionType.String,
            maxLength: 1024,
        },
        {
            name: 'reason',
            description: 'The reason for temporarily banning the user!',
            type: ApplicationCommandOptionType.String,
            maxLength: 1024,
        }
    ],

    run: async ({ interaction, guild, opts }) => {
        const duration = opts.getString('duration');
        const reason = opts.getString('reason') || "No reason.";
        const user = opts.getUser('user');
        const clientMember = guild.members.me;

        const member = await guild.members.cache.get(user.id);
        if(!member) throw "That member is not in this server.";

        if(member.id === interaction.user.id) throw "You can\'t ban yourself.";

        const msduration = ms(duration);
        if(!msduration || isNaN(msduration)) throw "That is not a valid duration format. Try something like \"2 days\" or \"2d\"."

        if(member.roles.highest.position >= clientMember.roles.highest.position) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`🚫 Stylar Error - Role Position`)
                    .setDescription(`The member selected has a higher role position than me.\n<@${member.id}>'s highest position: <@&${member.roles.highest.id}>\nMy highest position: <@&${clientMember.roles.highest.id}>`)
                    .setColor('Red')
                ], ephemeral: true
            });
        }

        if(member.roles.highest.position >= interaction.member.roles.highest.position)
        throw "That member has a higher role position than you, I cannot ban them.";

        if(!member.bannable) throw "That member is not bannable by me. This may be because they are the server owner.";
            const date = new Date();
            const datetimems = date.getTime();

            await punishment.create({
                Guild: guild.id,
                DateTimeMS: datetimems,
                Moderator: interaction.user.id,
                Punishment: 'Tempban',
                Reason: reason,
                User: member.id
            });

            const dateexpiresms = datetimems + msduration;

            await tempban.create({
                Guild: guild.id,
                DateExpiresMS: dateexpiresms,
                DateGivenMS: datetimems,
                Moderator: interaction.user.id,
                Reason: reason,
                User: member.id
            });

            await member.ban({
                reason: reason,
            });

            return reply(
                interaction,
                `${member.user.tag} has successfully been banned.\nBanned by: ${interaction.user.tag}`,
                `✅`,
                true
            );
    }
});