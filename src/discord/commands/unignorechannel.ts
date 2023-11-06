import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    channelMention
} from "discord.js";
import { IgnorableChannelTypes, unignoreChannel } from "../ignore.js";

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
    const channel = interaction.options.getChannel("channel", false, IgnorableChannelTypes);
    const channelId = channel?.id ?? interaction.channelId;
    const unignored = await unignoreChannel(interaction.guildId, channelId);
    const mention = channelMention(channelId);
    await interaction.editReply(unignored ? `Stopped ignoring ${mention}` : `Not ignoring ${mention}`);
}
