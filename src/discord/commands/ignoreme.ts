import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { IgnoreUser } from "../../models/index.js";

export const data = new SlashCommandBuilder()
    .setName("ignoreme")
    .setDescription("Opt out of replies");

export async function callback(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const [_, ignored] = await IgnoreUser.findOrCreate({
        where: { id: interaction.user.id }
    });
    await interaction.editReply(ignored ? "" : ""); // TODO
}
