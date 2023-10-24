import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import BlacklistCommand from "../../models/BlacklistCommand";
import BlacklistUser from "../../models/BlacklistUser";
import Reply from "../../functions/Reply";

export default new Command({
    name: 'blacklist',
    description: 'Blacklist system in Stylar!',
    options: [
        {
            name: 'command',
            description: 'Blacklist a command to stop users from using them!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'cmd',
                    description: 'The command you want to blacklist!',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
        },
        {
            name: 'user',
            description: 'Stop a user from using commands!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'member',
                    description: 'The member you want to blacklist!',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'The reason for blacklisting the user!',
                    type: ApplicationCommandOptionType.String,
                    maxLength: 1024,
                }
            ]
        }
    ],

    run: async({ interaction, opts, guild, client }) => {
        const sub = opts.getSubcommand();
        const bu = await BlacklistUser.findOne({ Guild: guild.id });
        const bc = await BlacklistCommand.findOne({ Guild: guild.id });
        const cmd = await opts.getString('cmd');
        const member = await opts.getUser('member') || interaction.user;
        const m = await guild.members.cache.get(member.id);
        if(!m) throw "This member isn't in this server!";
        const reason = opts.getString('reason') || "No Reason.";

        switch(sub) {
            case 'command': {
                const command = client.commands.get(cmd);

                const notallowed = [
                    'blacklistcmd',
                ]
        
                if(notallowed.includes(cmd)) throw 'You cannot blacklist the command you selected, as it is a Core command.';
        
                if(!command) throw `This command is outdated or is not in the bot.`;

                if(!bc) {
                    await BlacklistCommand.create({
                        Guild: guild.id,
                        Commands: [
                            cmd
                        ]
                    });

                    return Reply(interaction, `${cmd} will no longer be able to be used unless an admin removes the whitelist.`, '✅', true);
                } else {
                    if(bc.Commands.includes(cmd)) {
                        const index = await bc.Commands.indexOf(cmd);
                        await bc.Commands.splice(index, 1);

                        await bc.save();

                        return Reply(interaction, `Successfully removed /${cmd} from the blacklist.`, '✅', true);
                    }
                    bc.Commands.push(cmd);
                    bc.save();
                    return Reply(interaction, `${cmd} will no longer be able to be used unless an admin removes the whitelist.`, '✅', true);
                }
            }
            break;

            case 'user': {
                if(m.id === interaction.user.id) throw "You cannot blacklist/whitelist yourself!";
                if (bu) {
                    if (bu.Users.includes(m.id)) {
                        const index = bu.Users.indexOf(m.id);
                        await bu.Users.splice(index, 1);

                        await bu.save();

                        return Reply(interaction, `${m} has been removed from the blacklist. They are now able to use commands!`, `✅`, true);
                    }
                    bu.Users.push(m.id);
                    bu.save();
                    Reply(interaction, `Successful! ${m} will not be able to use commands unless the blacklist is lifted.`, `✅`, true);
                    return interaction.channel.send({ embeds: [
                        new EmbedBuilder()
                        .setTitle(`You have been blacklisted!`)
                        .setDescription(`<@${m.id}>, you have been blacklisted.\nYou will not be able to run commands unless your blacklist is lifted.`)
                        .setColor('Red')
                        .addFields(
                            { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                            { name: 'Reason', value: `${reason}`, inline: true }
                        )
                    ], content: `<@${m.id}>` })
                } else {
                    await BlacklistUser.create({
                        Guild: guild.id,
                        Users: [m.id]
                    });

                    Reply(interaction, `Successful! ${m} will not be able to use commands unless the blacklist is lifted.`, `✅`, true);
                    return interaction.channel.send({ embeds: [
                        new EmbedBuilder()
                        .setTitle(`You have been blacklisted!`)
                        .setDescription(`<@${m.id}>, you have been blacklisted.\nYou will not be able to run commands unless your blacklist is lifted.`)
                        .setColor('Red')
                        .addFields(
                            { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
                            { name: 'Reason', value: `${reason}`, inline: true }
                        )
                    ], content: `<@${m.id}>` })
                }
            }
            break;
        }
    }
})