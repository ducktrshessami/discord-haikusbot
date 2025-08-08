import {
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";
import { unignoreAllChannels } from "../ignore.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    name: "unignoreall",
    description: "Opt all channels back in to replies",
    contexts: [InteractionContextType.Guild],
    default_member_permissions: PermissionFlagsBits.ManageGuild.toString()
};

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    await unignoreAllChannels(interaction.guildId);
    await interaction.editReply("Stopped ignoring all channels");
}
