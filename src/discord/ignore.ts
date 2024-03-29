import {
    CategoryChannel,
    ChannelType,
    ForumChannel,
    GuildBasedChannel,
    GuildTextBasedChannel,
    MediaChannel,
    Message
} from "discord.js";
import {
    Guild,
    IgnoreChannel,
    IgnoreUser,
    sequelize
} from "../models/index.js";
import { Op, Transaction } from "sequelize";

export const IgnorableChannelTypes: Array<IgnorableChannel["type"]> = [
    ChannelType.GuildText,
    ChannelType.GuildVoice,
    ChannelType.GuildCategory,
    ChannelType.GuildAnnouncement,
    ChannelType.AnnouncementThread,
    ChannelType.PublicThread,
    ChannelType.PrivateThread,
    ChannelType.GuildStageVoice,
    ChannelType.GuildForum,
    ChannelType.GuildMedia
];

export function isIgnorable(channel: GuildBasedChannel): channel is IgnorableChannel {
    return (<Array<ChannelType>>IgnorableChannelTypes).includes(channel.type);
}

async function initializeGuild(guildId: string, transaction: Transaction): Promise<void> {
    await Guild.findOrCreate({
        transaction,
        where: { id: guildId }
    });
}

export async function ignoreChannel(guildId: string, channelId: string): Promise<boolean> {
    return await sequelize.transaction(async transaction => {
        await initializeGuild(guildId, transaction);
        const [_, created] = await IgnoreChannel.findOrCreate({
            transaction,
            where: { id: channelId },
            defaults: {
                id: channelId,
                GuildId: guildId
            }
        });
        return created;
    });
}

export async function ignoreChannels(guildId: string, channelIds: Array<string>): Promise<void> {
    await sequelize.transaction(async transaction => {
        await initializeGuild(guildId, transaction);
        await IgnoreChannel.bulkCreate(channelIds.map(channelId => ({
            id: channelId,
            GuildId: guildId
        })), {
            transaction,
            ignoreDuplicates: true
        });
    });
}

export async function unignoreChannel(guildId: string, channelId: string): Promise<boolean> {
    return await sequelize.transaction(async transaction => {
        const unignored = !!await IgnoreChannel.destroy({
            transaction,
            where: { id: channelId }
        });
        const noIgnores = !await IgnoreChannel.count({
            transaction,
            where: { GuildId: guildId }
        });
        if (noIgnores) {
            await Guild.destroy({
                transaction,
                where: { id: guildId }
            });
        }
        return unignored;
    });
}

export async function unignoreAllChannels(guildId: string): Promise<void> {
    await Guild.destroy({
        where: { id: guildId }
    });
}

function resolveChannelIds(channel: GuildBasedChannel, ids: Array<string> = [channel.id]): Array<string> {
    if (channel.parentId) {
        ids.push(channel.parentId);
    }
    return channel.parent ? resolveChannelIds(channel.parent, ids) : ids;
}

async function channelIgnored(channel: GuildBasedChannel): Promise<boolean> {
    if (!isIgnorable(channel)) {
        return false;
    }
    return !!await IgnoreChannel.findOne({
        where: {
            id: { [Op.or]: resolveChannelIds(channel) }
        }
    });
}

export async function ignoreMessage(message: Message<true>): Promise<boolean> {
    const [channel, user] = await Promise.all([
        channelIgnored(message.channel),
        IgnoreUser.findByPk(message.author.id)
    ]);
    return channel || !!user;
}

export type IgnorableChannel = GuildTextBasedChannel | CategoryChannel | ForumChannel | MediaChannel;
