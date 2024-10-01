import {
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    SlashCommandBuilder,
    channelMention
} from "discord.js";
import { IgnorableChannelTypes, ignoreChannel } from "../ignore.js";

export const data = new SlashCommandBuilder()
    .setName("ignorechannel")
    .setDescription("Opt a channel out of replies")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
        option
            .setName("channel")
            .setDescription("The channel to opt out. Defaults to the channel this command is used in.")
            .addChannelTypes(...IgnorableChannelTypes)
    );

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const channel = interaction.options.getChannel("channel", false, IgnorableChannelTypes);
    const channelId = channel?.id ?? interaction.channelId;
    const ignored = await ignoreChannel(interaction.guildId, channelId);
    const mention = channelMention(channelId);
    await interaction.editReply(ignored ? `Ignoring ${mention}` : `Already ignoring ${mention}`);
}
