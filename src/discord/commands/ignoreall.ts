import {
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import { ignoreChannels, isIgnorable } from "../ignore.js";

export const data = new SlashCommandBuilder()
    .setName("ignoreall")
    .setDescription("Opt all channels out of replies")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    await interaction.guild.channels.fetchActiveThreads();
    await ignoreChannels(interaction.guildId, interaction.guild.channels.cache.reduce((channelIds, channel) => {
        if (isIgnorable(channel)) {
            channelIds.push(channel.id);
        }
        return channelIds;
    }, new Array<string>()));
    await interaction.editReply("Ignoring all channels");
}
