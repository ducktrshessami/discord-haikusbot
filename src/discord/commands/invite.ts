import {
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
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
    await interaction.reply({
        components: [{
            type: ComponentType.ActionRow,
            components: [{
                type: ComponentType.Button,
                style: ButtonStyle.Link,
                label: "Invite",
                url: interaction.client.generateInvite({
                    scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
                    permissions: PermissionFlagsBits.ViewChannel | PermissionFlagsBits.SendMessages
                })
            }]
        }]
    });
}
