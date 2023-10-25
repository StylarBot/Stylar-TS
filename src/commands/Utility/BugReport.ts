import { Command } from "../../structures/Command";
import Reply from "../../functions/Reply";

export default new Command({
    name: 'bugreport',
    description: 'Report a bug to the Stylar team!',

    run: async({ interaction, client }) => {
        const stylaremoji = await client.emojis.cache.get('1156061363660140555');
        return Reply(interaction, `If you want to report a bug, head to Stylar's Github Page!\nhttps://github.com/StylarBot/Stylar-TS/issues`, `${stylaremoji}`, false);
    }
})