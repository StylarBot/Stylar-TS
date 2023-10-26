import Channel from "../../functions/Channel";
import Reply from "../../functions/Reply";
import { Command } from "../../structures/Command";
import {
    ApplicationCommandOptionType,
    BaseGuildTextChannel,
    BaseGuildVoiceChannel,
    ChannelType,
    GuildChannel,
    ButtonStyle,
    ButtonBuilder,
    ActionRowBuilder
} from "discord.js";

export default new Command({
    name: 'channel',
    description: 'Channel management commands!',
    userPermissions: ['ManageChannels'],
    options: [
        {
            name: 'voice',
            description: 'Voice channel management commands!',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'setuserlimit',
                    description: 'Set a limit for the amount of users that can connect to a voice channel!',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'vc',
                            description: 'The voice channel you want to lock!',
                            required: true,
                            type: ApplicationCommandOptionType.Channel,
                            channel_types: [ChannelType.GuildVoice]
                        },
                        {
                            name: 'users',
                            description: 'The amount of users you want to limit connection to!',
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                            maxValue: 99,
                            minValue: 0,
                        }
                    ]
                },
                {
                    name: 'kick',
                    description: 'Kick a user from the voice channel!',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'user',
                            description: 'The user you want to kick from the voice channel!',
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        }
                    ]
                }
            ]
        },
        {
            name: 'lock',
            description: 'Lock/unlock a channel!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to lock!',
                    type: ApplicationCommandOptionType.Channel
                },
                {
                    name: 'role',
                    description: 'The role you want to lock the channel for!',
                    type: ApplicationCommandOptionType.Role,
                },
                {
                    name: 'duration',
                    description: 'The duration that the channel will stay locked for!',
                    type: ApplicationCommandOptionType.String,
                }
            ]
        },
        {
            name: 'lockdown',
            description: 'Lock/unlock all channels in the server!',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'nuke',
            description: 'Wipe a channel of all of its messages!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to nuke!',
                    type: ApplicationCommandOptionType.Channel,
                }
            ]
        },
        {
            name: 'purge',
            description: 'Purge a channel of a specified amount of its messages!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'amount',
                    description: 'The amount of messages you want to remove!',
                    type: ApplicationCommandOptionType.Integer,
                    maxValue: 100,
                    required: true
                },
                {
                    name: 'channel',
                    description: 'The channel you want to remove the messages from!',
                    type: ApplicationCommandOptionType.Channel,
                },
                {
                    name: 'user',
                    description: 'The user whos messages you want to clear!',
                    type: ApplicationCommandOptionType.User,
                },
            ],
        },
        {
            name: 'slowmode',
            description: 'Set a slowmode for a channel in the server!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'duration',
                    description: 'The duration of the slowmode (3s, 3m, 3h)',
                    required: true,
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: 'channel',
                    description: 'The channel you want to set the slowmode for!',
                    type: ApplicationCommandOptionType.Channel,
                }
            ]
        }
    ],

    run: async({ interaction, client, guild, opts }) => {
        const subgroup = opts.getSubcommandGroup();
        const sub = opts.getSubcommand();
        const duration = opts.getString('duration');
        const channel = opts.getChannel('channel') || interaction.channel;
        const role = opts.getRole('role') || guild.roles.everyone;
        const user = opts.getUser('user');
        const amount = opts.getInteger('amount');
        const vc = opts.getChannel('vc');
        const users = opts.getInteger('users');

        switch(subgroup) {
            case 'voice': {
                switch(sub) {
                    case 'setuserlimit': {
                        const ch = await guild.channels.cache.get(vc.id) as BaseGuildVoiceChannel;
                        if(!ch) throw "That is not a valid channel in this server.";

                        await Channel.SetUserLimit(ch, client, interaction.member, users);

                        return Reply(
                            interaction,
                            `Successfully set the user limit of <#${ch.id}> to ${users} users.`,
                            '✅',
                            false,
                        );
                    }
                    break;

                    case 'kick': {
                        const member = await guild.members.cache.get(user.id);
                        if(!member) throw "That member is not in this server.";

                        if(!member.voice.channel) throw "That member is not in a voice channel.";
                        const vc = member.voice.channel;

                        await Channel.KickFromVC(client, member);
                        return Reply(
                            interaction,
                            `Successfully disconnected <@${member.id}> from <#${vc.id}>`,
                            '✅',
                            false,
                        )
                    }
                    break;
                }
            }
            break;
        }

        switch(sub) {
            case 'lock': {
                const ch = await guild.channels.cache.get(channel.id) as GuildChannel;
                if(!ch) throw "That is not a valid channel in this server.";

                const vr = await guild.roles.cache.get(role.id);
                if(!vr) throw "That is not a valid role in this server.";

                if(duration) {
                    if(!ch.permissionsFor(vr).has('SendMessages')) {
                        await Channel.Unlock(ch, client, interaction.member, vr);
                        return Reply(
                            interaction,
                            `Successfully unlocked <#${ch.id}> for <@&${vr.id}>.`,
                            `✅`,
                            false
                        );
                    }
                    await Channel.TempLock(ch, client, interaction.member, vr, duration);
                    return Reply(
                        interaction,
                        `Successfully locked <#${ch.id}> for <@&${vr.id}> for \`${duration}\`.`,
                        `✅`,
                        false
                    );          
                } else {
                    if(!ch.permissionsFor(vr).has('SendMessages')) {
                        await Channel.Unlock(ch, client, interaction.member, vr);
                        return Reply(
                            interaction,
                            `Successfully unlocked <#${ch.id}> for <@&${vr.id}>.`,
                            `✅`,
                            false
                        );
                    }
                    await Channel.Lock(ch, client, interaction.member, vr);
                    return Reply(
                        interaction,
                        `Successfully locked <#${ch.id}> for <@&${vr.id}>.`,
                        `✅`,
                        false
                    );
                }
            }
            break;

            case 'lockdown': {
                const vr = await guild.roles.cache.get(role.id);
                if(!vr) throw "This role is not valid in this server.";

                await Channel.Lockdown(client, interaction.member, guild, vr);
                return Reply(
                    interaction, 
                    `Successfully locked down the server.`,
                    '✅',
                    false,
                );
            }
            break;

            case 'nuke': {
                const ch = await guild.channels.cache.get(channel.id) as BaseGuildTextChannel;
                if(!ch) throw "That is not a valid channel in this server.";

                if(![0, 12, 11, 5, 15].includes(ch.type)) throw "That is not a valid text channel.";

                const button = new ButtonBuilder()
                .setCustomId('delete')
                .setStyle(ButtonStyle.Primary)
                .setLabel('🗑️')
    
                const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(button)
    
                await ch.clone().then(async (chan) => {
                    const msg = await chan.send({
                        content: `\`\`\`${channel.name} has been cleared all of all of its messages.\`\`\``,
                        components: [row]
                    });
    
                    await ch.delete();
    
                    const collector = await msg.createMessageComponentCollector();
    
                    collector.on('collect', async (results) => {
                        if (results.customId === 'delete') {
                            await msg.delete();
                        } else return;
                    });
                });
            }
            break;
        }
    }
})