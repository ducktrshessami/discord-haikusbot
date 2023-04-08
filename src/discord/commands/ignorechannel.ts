import {
    ChannelType,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import { IgnorableChannel, ignoreChannel } from "../ignore.js";

export const data = new SlashCommandBuilder()
    .setName("ignorechannel")
    .setDescription("Opt a channel out of replies")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
        option
            .setName("channel")
            .setDescription("The channel to opt out. Defaults to the channel this command is used in.")
            .addChannelTypes(
                ChannelType.GuildText,
                ChannelType.GuildAnnouncement,
                ChannelType.AnnouncementThread,
                ChannelType.PublicThread,
                ChannelType.PrivateThread,
                ChannelType.GuildVoice,
                ChannelType.GuildCategory,
                ChannelType.GuildForum
            )
    );

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const channel: IgnorableChannel | null = interaction.options.getChannel("channel");
    const channelId = channel?.id ?? interaction.channelId;
    const ignored = await ignoreChannel(interaction.guildId, channelId);
    await interaction.editReply(ignored ? "" : ""); // TODO
}
