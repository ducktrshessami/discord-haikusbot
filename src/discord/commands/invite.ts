import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    InteractionContextType,
    OAuth2Scopes,
    PermissionFlagsBits,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from "discord.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    name: "invite",
    description: "Send my invite link",
    contexts: [
        InteractionContextType.Guild,
        InteractionContextType.BotDM,
        InteractionContextType.PrivateChannel
    ]
};

export async function callback(interaction: ChatInputCommandInteraction): Promise<void> {
    const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Invite")
        .setURL(interaction.client.generateInvite({
            scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
            permissions: PermissionFlagsBits.ViewChannel | PermissionFlagsBits.SendMessages
        }));
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(button);
    await interaction.reply({ components: [row] });
}
