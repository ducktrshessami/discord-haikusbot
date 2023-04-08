import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import {
    IgnorableChannel,
    IgnorableChannelTypes,
    unignoreChannel
} from "../ignore.js";

export const data = new SlashCommandBuilder()
    .setName("unignorechannel")
    .setDescription("Opt a channel back in to replies")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
        option
            .setName("channel")
            .setDescription("The channel to opt in. Defaults to the channel this command is used in.")
            .addChannelTypes(...IgnorableChannelTypes)
    );

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const channel: IgnorableChannel | null = interaction.options.getChannel("channel");
    const channelId = channel?.id ?? interaction.channelId;
    const unignored = await unignoreChannel(interaction.guildId, channelId);
    await interaction.editReply(unignored ? "" : ""); // TODO
}
