import { Command } from "../../structures/Command";
import AntiGhostPing from "../../models/AntiGhostPing";
import { ApplicationCommandOptionType } from "discord.js";
import Reply from "../../functions/Reply";

export default new Command({
    name: 'antighostping',
    description: 'Setup anti ghost pinging!',
    options: [
        {
            name: 'enable',
            description: 'Enable anti ghost ping!',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'disable',
            description: 'Disable the anti ghost ping system!',
            type: ApplicationCommandOptionType.Subcommand
        },
    ],

    run: async({ interaction, guild, opts }) => {
        const sub = opts.getSubcommand();

        const data = await AntiGhostPing.findOne({ Guild: guild.id });

        switch(sub) {
            case 'enable': {
                if(!data) {
                    await AntiGhostPing.create({
                        Guild: guild.id
                    });

                    return Reply(interaction, `Successfully enabled anti ghost ping.`, `☑️`, true);
                } else throw "You already have the anti ghost ping system set up!";
            }
            break;

            case 'disable': {
                if(data) {
                    await data.deleteOne({ new: true });

                    return Reply(interaction, `Successfully disabled anti ghost ping.`, `☑️`, true);
                } else throw "You do not have the anti ghost ping system set up!";
            }
            break;
        }
    }
})