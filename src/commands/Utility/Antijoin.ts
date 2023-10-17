import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import Antijoin from "../../models/Antijoin";
import { Command } from "../../structures/Command";
import Reply from "../../functions/Reply";

export default new Command({
    name: 'antijoin',
    description: 'Stop members from joining your server for security!',
    userPermissions: ['ManageGuild'],
    options: [
        {
            name: 'enable',
            description: 'Enable the antijoin system!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'botexception',
                    description: 'Do you want to still be able to add bots without them being banned?',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: 'Enable Bot Exception', value: 'enablebotexception' },
                        { name: 'Disable Bot Exception', value: 'disablebotexception' }
                    ]
                },
                {
                    name: 'punishment',
                    description: 'What do you want the punishment issued to new members be?',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: 'Ban new members', value: 'ban' },
                        { name: 'Kick new members', value: 'kick' },
                    ]
                }
            ]
        },
        {
            name: 'disable',
            description: 'Disable the antijoin system!',
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: 'editexception',
            description: 'Edit the antijoin system!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'botexception',
                    description: 'Do you want to still be able to add bots without them being banned?',
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: 'Enable Bot Exception', value: 'enablebotexception' },
                        { name: 'Disable Bot Exception', value: 'disablebotexception' }
                    ],
                    required: true,
                },
            ]
        },
        {
            name: 'editpunishment',
            description: 'Edit the punishment that the user will receive!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'punishment',
                    description: 'What do you want the punishment issued to new members be?',
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: 'Ban new members', value: 'ban' },
                        { name: 'Kick new members', value: 'kick' },
                    ],
                    required: true,
                }
            ]
        }
    ],
    
    run: async({ interaction, guild, opts }) => {
        const sub = opts.getSubcommand();
        const botexception = opts.getString('botexception') || 'enablebotexception';
        const punishment = opts.getString('punishment');

        switch(sub) {
            case 'enable': {
                const aj = await Antijoin.findOne({ Guild: guild.id });
                if(aj) throw "The antijoin system is already enabled!";

                let be: boolean;
                switch(botexception) {
                    case 'enablebotexception': {
                        be = true;
                    }
                    break;

                    case 'disablebotexception': {
                        be = false;
                    }
                    break;
                }

                await Antijoin.create({
                    Guild: guild.id,
                    BotException: be,
                    Punishment: punishment,
                });

                Reply(interaction, `Successfully enabled Antijoin. New members will not be able to join your server until this is disabled.\nBot Exception Status: ${be}`, `✅`, false);
            }
            break;

            case 'disable': {
                const aj = await Antijoin.findOne({ Guild: guild.id });
                if(!aj) throw "The antijoin system is already disabled!";

                await aj.deleteOne();

                Reply(interaction, `Successfully disabled Antijoin. New members are now able to join your server until this is enabled.`, `✅`, false);
            }
            break;

            case 'editexception': {
                const aj = await Antijoin.findOne({ Guild: guild.id });
                if(!aj) throw "The antijoin system is not enabled!";

                let be: boolean;
                switch(botexception) {
                    case 'enablebotexception': {
                        be = true;
                    }
                    break;

                    case 'disablebotexception': {
                        be = false;
                    }
                    break;
                }

                if(aj.BotException === be) throw "The bot exception is already set to that setting!";
                
                aj.BotException = be;
                aj.save();

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`✅ Edited Antijoin`)
                        .setDescription(`The antijoin system has been edited. Here's what's new.`)
                        .addFields(
                            { name: 'Bot Exception Status', value: `${be}` }
                        )
                        .setColor('Blue')
                        .setThumbnail(guild.iconURL({ size: 1024 }))
                    ]
                })
            }
            break;

            case 'editpunishment': {
                const aj = await Antijoin.findOne({ Guild: guild.id });
                if(!aj) throw "The antijoin system is not enabled!";

                if(aj.Punishment === punishment) throw "The punishment is already set to that setting!";
                
                aj.Punishment = punishment;
                aj.save();

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`✅ Edited Antijoin`)
                        .setDescription(`The antijoin system has been edited. Here's what's new.`)
                        .addFields(
                            { name: 'Punishment', value: `${punishment}` }
                        )
                        .setColor('Blue')
                        .setThumbnail(guild.iconURL({ size: 1024 }))
                    ]
                })
            }
            break;
        }
    }
})