import axios from "axios";
import { Command } from "../../structures/Command";
import { ApplicationCommandOptionType } from "discord.js";
import Reply from "../../functions/Reply";

export default new Command({
    name: 'steal',
    description: 'Steal a given emoji!',
    userPermissions: ['ManageEmojisAndStickers'],
    clientPermissions: ['ManageEmojisAndStickers'],
    options: [
        {
            name: 'emoji',
            description: 'The emoji you want to steal!',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'name',
            description: 'The name of the emoji when it is added to this server!',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],

    run: async({ interaction, opts, guild }) => {
        let emoji = await opts.getString('emoji')?.trim();
        const name = await opts.getString('name');

        if(emoji.startsWith("<") && emoji.endsWith(">")) {
            const id = emoji.match(/\d{15,}/g)[0];

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
            .then(image => {
                if(image) return "gif";
                else return "png";
            }).catch(err => {
                return "png";
            });

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;
        }

        if(!emoji.startsWith("http")) {
            throw "You cannot steal default emojis!"
        }

        if(!emoji.startsWith("http")) {
            throw "You cannot steal default emojis!"
        }

        guild.emojis.create({ attachment: `${emoji}`, name: `${name}` })
        .then(emoji => {
            return Reply(interaction, `Successfully added emoji ${emoji} with name ${emoji.name}.`, '✅', false);
        }).catch(err => {
            throw err;
        });
    }
})