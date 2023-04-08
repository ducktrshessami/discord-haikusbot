import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { IgnorableChannelTypes } from "../ignore.js";

export const data = new SlashCommandBuilder()
    .setName("unignorechannel")
    .setDescription("Opt a channel back in to replies")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
        option
            .setName("channel")
            .setDescription("The channel to opt in. Defaults to the channel this command is used in.")
            .addChannelTypes(...IgnorableChannelTypes)
    );
