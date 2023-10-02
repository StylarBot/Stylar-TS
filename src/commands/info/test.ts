import { Command } from "../../structures/Command";
import Reply from "../../functions/Reply";

export default new Command({
    name: "test",
    description: "replies with pong",

    run: async ({ interaction }) => {
        return Reply(interaction, `Test command works! :)`, `✅`, true);
    }
});