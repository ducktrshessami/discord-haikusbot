import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { IgnoreUser } from "../../models/index.js";

export const data = new SlashCommandBuilder()
    .setName("unignoreme")
    .setDescription("Opt back in to replies");

export async function callback(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const unignored = !!await IgnoreUser.destroy({
        where: { id: interaction.user.id }
    });
    await interaction.editReply(unignored ? "Opted in to replies" : "Already opted in to replies");
}
