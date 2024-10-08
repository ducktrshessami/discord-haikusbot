import {
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import { unignoreAllChannels } from "../ignore.js";

export const data = new SlashCommandBuilder()
    .setName("unignoreall")
    .setDescription("Opt all channels back in to replies")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    await unignoreAllChannels(interaction.guildId);
    await interaction.editReply("Stopped ignoring all channels");
}
