import {
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionFlagsBits,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";
import { ignoreChannels, isIgnorable } from "../ignore.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    name: "ignoreall",
    description: "Opt all channels out of replies",
    contexts: [InteractionContextType.Guild],
    default_member_permissions: PermissionFlagsBits.ManageGuild.toString()
};

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
