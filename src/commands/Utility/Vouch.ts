import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import Vouch from "../../models/Vouch";

export default new Command({
    name: 'vouch',
    description: 'Vouch for a user!',
    options: [
        {
            name: 'add',
            description: 'Add a vouch to a user!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to vouch for!',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'The reason for vouching this user!',
                    type: ApplicationCommandOptionType.String,
                    max_length: 1024,
                    required: true,
                }
            ]
        },
        {
            name: 'remove',
            description: 'Remove a vouch from a user!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to vouch for!',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
            ]
        },
        {
            name: 'check',
            description: 'Check a user\'s vouches!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user whos vouches you want to check!',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                }
            ]
        }
    ],

    run: async({ interaction, guild, opts }) => {
        const sub = opts.getSubcommand();
        const user = opts.getUser('user') || interaction.user;
        const member = await guild.members.cache.get(user.id);
        if(!member) throw "That member is not in this server.";
        const reason = opts.getString('reason') || "No reason.";

        switch(sub) {
            case 'add': {
                await Vouch.create({
                    Guild: guild.id,
                    Reason: reason,
                    User: interaction.user.id,
                    UserGiven: member.id
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`🙌 Vouch Given`)
                        .setDescription(`You have given a vouch.`)
                        .setFields(
                            { name: 'User', value: `<@${member.id}> (${member.id})`, inline: true },
                            { name: 'Reason', value: `${reason}`, inline: true }
                        )
                        .setColor('Blue')
                        .setThumbnail(member.displayAvatarURL({ size: 1024 }))
                    ]
                });
            }
            break;

            case 'remove': {
                const uservouches = await Vouch.find({ User: interaction.user.id, UserGiven: member.id });
                if(!uservouches) throw "You have not given that user any vouches.";

                
            }
            break;

            case 'check': {

            }
            break;
        }
    }
})