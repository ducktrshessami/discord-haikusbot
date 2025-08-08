import { ChatInputCommandInteraction, InteractionContextType, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { IgnoreUser } from "../../models/index.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    name: "unignoreme",
    description: "Opt back in to replies",
    contexts: [
        InteractionContextType.Guild,
        InteractionContextType.BotDM,
        InteractionContextType.PrivateChannel
    ]
};

export async function callback(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const unignored = !!await IgnoreUser.destroy({
        where: { id: interaction.user.id }
    });
    await interaction.editReply(unignored ? "Opted in to replies" : "Already opted in to replies");
}
