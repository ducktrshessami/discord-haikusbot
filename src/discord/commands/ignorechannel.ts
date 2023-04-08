import {
    ChannelType,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

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
