import { ChatInputCommandInteraction, InteractionContextType, RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { IgnoreUser } from "../../models/index.js";

export const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    name: "ignoreme",
    description: "Opt out of replies",
    contexts: [
        InteractionContextType.Guild,
        InteractionContextType.BotDM,
        InteractionContextType.PrivateChannel
    ]
};

export async function callback(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const [_, ignored] = await IgnoreUser.findOrCreate({
        where: { id: interaction.user.id }
    });
    await interaction.editReply(ignored ? "Opted out of replies" : "Already opted out of replies");
}
