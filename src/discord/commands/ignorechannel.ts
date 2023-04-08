import {
    ChannelType,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import { IgnoreChannel } from "../../models/index.js";

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
    const channel = interaction.options.getChannel("channel");
    const channelId = channel?.id ?? interaction.channelId;
    const [_, created] = await IgnoreChannel.findOrCreate({
        where: { id: channelId },
        defaults: {
            id: channelId,
            GuildId: interaction.guildId
        }
    });
    await interaction.editReply(created ? "" : ""); // TODO
}
