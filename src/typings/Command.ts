import {
    ChatInputApplicationCommandData,
    CommandInteraction,
    CommandInteractionOptionResolver,
    Guild,
    GuildMember,
    PermissionResolvable
} from "discord.js";
import { ExtendedClient } from "../structures/Client";

/**
 * {
 *  name: "commandname",
 * description: "any description",
 * run: async({ interaction }) => {
 *
 * }
 * }
 */

export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember;
}

export interface ExtendedGuild extends Guild {
    guild: Guild
}

interface RunOptions {
    client: ExtendedClient;
    interaction: ExtendedInteraction;
    opts: CommandInteractionOptionResolver;
    guild: ExtendedGuild;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
    userPermissions?: PermissionResolvable[];
    clientPermissions?: PermissionResolvable[];
    run: RunFunction;
} & ChatInputApplicationCommandData;
