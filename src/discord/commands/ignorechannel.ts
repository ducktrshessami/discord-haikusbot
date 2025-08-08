import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    channelMention
} from "discord.js";
import { IgnorableChannelTypes, ignoreChannel } from "../ignore.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    name: "ignorechannel",
    description: "Opt a channel out of replies",
    contexts: [InteractionContextType.Guild],
    default_member_permissions: PermissionFlagsBits.ManageChannels.toString(),
    options: [{
        type: ApplicationCommandOptionType.Channel,
        name: "channel",
        description: "The channel to opt out. Defaults to the channel this command is used in.",
        channel_types: IgnorableChannelTypes
    }]
};

export async function callback(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    await interaction.deferReply();
    const channel = interaction.options.getChannel("channel", false, IgnorableChannelTypes);
    const channelId = channel?.id ?? interaction.channelId;
    const ignored = await ignoreChannel(interaction.guildId, channelId);
    const mention = channelMention(channelId);
    await interaction.editReply(ignored ? `Ignoring ${mention}` : `Already ignoring ${mention}`);
}
