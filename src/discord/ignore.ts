import {
    CategoryChannel,
    ForumChannel,
    GuildTextBasedChannel
} from "discord.js";
import {
    Guild,
    IgnoreChannel,
    sequelize
} from "../models/index.js";

export async function ignoreChannel(guildId: string, channelId: string): Promise<boolean> {
    return await sequelize.transaction(async transaction => {
        await Guild.findOrCreate({
            transaction,
            where: { id: guildId }
        });
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

export type IgnorableChannel = GuildTextBasedChannel | CategoryChannel | ForumChannel;
