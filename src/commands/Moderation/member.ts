import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import reply from "../../functions/Reply";
import moderation from "../../models/Moderation"; // benji, jay & leo were here!! hello
import ms from 'ms';

export default new Command({
    name: 'member',
    description: 'Stylar\'s member management commands!',
    userPermissions: ['ModerateMembers'],
    options: [
        {
            name: 'ban',
            description: 'Ban a user from the server!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to ban!',
                    required: true,
                    type: ApplicationCommandOptionType.User,
                },
                {
                    name: 'deletemessages',
                    description: 'Delete messages from a certain amount of time from a user!',
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: 'reason',
                    description: 'The reason for banning the user',
                    maxLength: 1024,
                    type: ApplicationCommandOptionType.String,
                }
            ]
        },
        {
            name: 'kick',
            description: 'Kick a member form the server!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to kick!',
                    required: true,
                    type: ApplicationCommandOptionType.User,
                },
                {
                    name: 'reason',
                    description: 'The reason for kicking the user',
                    maxLength: 1024,
                    type: ApplicationCommandOptionType.String,
                }
            ]
        },
        {
            name: 'warn',
            description: 'Warn a user!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                { // aww :)
                    name: 'user',
                    description: 'The user you want to warn!',
                    required: true,
                    type: ApplicationCommandOptionType.User,
                },
                {
                    name: 'reason',
                    description: 'The reason for warning the user',
                    maxLength: 1024,
                    type: ApplicationCommandOptionType.String,
                }
            ]
        }
    ],

    run: async ({ interaction, guild, opts }) => {
        const clientMember = guild.members.me;
        const user = opts.getUser('user');
        const deletemessages = opts.getString('deletemessages');
        const reason = opts.getString('reason') || "No reason.";

        const sub = opts.getSubcommand();
        
        switch(sub) {
            case 'ban': {
                const member = await guild.members.cache.get(user.id);
                if(!member) throw "That member is not in this server.";

                if(member.id === interaction.user.id) throw "You can\'t ban yourself.";

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

                if(deletemessages) {
                    const deletemessagems = await ms(deletemessages);
                    if(isNaN(deletemessagems)) throw "The delete messages property is not valid. Try something like \"2 days\" or \"2 hours\"!";

                    const deletemessageseconds = deletemessagems * 60;

                    await member.ban({
                        deleteMessageSeconds: deletemessageseconds,
                        reason: reason,
                    });

                    return reply(interaction, `${member.user.tag} has successfully been banned.\nBanned by: ${interaction.user.tag}`, `✅`, true);
                } else {
                    const date = new Date();
                    const datetimems = date.getTime();

                    await moderation.create({
                        Guild: guild.id,
                        DateTimeMS: datetimems,
                        Moderator: interaction.user.id,
                        moderation: 'Ban',
                        Reason: reason,
                        User: member.id
                    });

                    await member.ban({
                        reason: reason,
                    });

                    return reply(interaction, `${member.user.tag} has successfully been banned.\nBanned by: ${interaction.user.tag}`, `✅`, true);
                }
            }
            break;

            case 'kick': {
                const member = await guild.members.cache.get(user.id);
                if(!member) throw "That member is not in this server.";

                if(member.id === interaction.user.id) throw "You can\'t ban yourself.";

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
                throw "That member has a higher role position than you, I cannot kick them.";

                if(!member.kickable) throw "That member is not kickable by me. This may be because they are the server owner.";
                
                const date = new Date();
                const datetimems = date.getTime();

                await moderation.create({
                    Guild: guild.id,
                    DateTimeMS: datetimems,
                    Moderator: interaction.user.id,
                    Punishment: 'Kick',
                    Reason: reason,
                    User: member.id
                });
                
                await member.kick(reason);

                return reply(interaction, `${member.user.tag} has successfully been kicked.\nKicked by: ${interaction.user.tag}`, `✅`, true);
            }
            break;

            case 'warn': {
                const member = await guild.members.cache.get(user.id);
                if(!member) throw "That member is not in this server.";

                if(member.id === interaction.user.id) throw "You can\'t warn yourself.";

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
                throw "That member has a higher role position than you, I cannot warn them.";
                
                const date = new Date();
                const datetimems = date.getTime();

                await moderation.create({
                    Guild: guild.id,
                    DateTimeMS: datetimems,
                    Moderator: interaction.user.id,
                    Punishment: 'Warn',
                    Reason: reason,
                    User: member.id
                });

                return reply(interaction, `${member.user.tag} has successfully been warned.\nWarned by: ${interaction.user.tag}`, `✅`, true);
            }
            break;
        }
    }
})
