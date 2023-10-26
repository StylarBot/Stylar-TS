import { Event } from "../structures/Event";
import Templock from "../models/Templock";

let voicechannels = [
    'GuildVoice',
    'GuildStageVoice',
]

let textchannels = [
    'GuildText',
    'PrivateThread',
    'PublicThread',
    'GuildAnnouncement',
    'GuildForum'
]

export default new Event("ready", async(client) => {
    setInterval(async() => {
        const date = new Date();
        const alltemplocks = await Templock.find();

        if(alltemplocks.length <= 0) return;
        else {
            alltemplocks.forEach(async(tl) => {
                if(parseInt(tl.EndMS) >= date.getTime()){
                    const guild = await client.guilds.cache.get(tl.Guild);
                    if(!guild) {
                        await tl.deleteOne();
                        await tl.save();
                    } else {
                        const channel = await guild.channels.cache.get(tl.Channel);
                        if(!channel) {
                            await tl.deleteOne();
                            await tl.save();
                        } else {
                            const role = await guild.roles.cache.get(tl.Role);
                            if(!role) {
                                await tl.deleteOne();
                                await tl.save();
                            } else {
                                if(voicechannels.includes(channel.type.toString())) {
                                    channel.permissionsFor(role.id).add(
                                        [
                                            'SendMessages',
                                            'EmbedLinks',
                                            'AttachFiles',
                                            'AddReactions',
                                            'UseExternalEmojis',
                                            'Speak',
                                            'Connect'
                                        ]
                                    )

                                    await tl.deleteOne();
                                    await tl.save();

                                    return;
                                } else {
                                    channel.permissionsFor(role.id).add(
                                        [
                                            'SendMessages',
                                            'EmbedLinks',
                                            'AttachFiles',
                                            'AddReactions',
                                            'UseExternalEmojis',
                                        ]
                                    )

                                    await tl.deleteOne();
                                    await tl.save();

                                    return;
                                }
                            }
                        }
                    }
                } else return;
            });
        }
    }, 5000);
});