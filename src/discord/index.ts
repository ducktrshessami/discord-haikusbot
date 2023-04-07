import {
    Client,
    Events,
    GatewayIntentBits,
    GuildChannel,
    GuildMember,
    Message,
    Options,
    PermissionFlagsBits,
    PresenceData,
    ThreadChannel,
    User,
    italic
} from "discord.js";
import activities from "./activities.js";
import {
    DISCORD_LIMITED_CACHE_MAX,
    DISCORD_MESSAGE_LIFETIME,
    DISCORD_PRESENCE_INTERVAL,
    DISCORD_SWEEPER_INTERVAL,
    DISCORD_THREAD_LIFETIME
} from "../constants.js";
import {
    Guild,
    IgnoreChannel,
    IgnoreUser
} from "../models/index.js";
import commands from "./commands/index.js";
import { formatHaiku, haikuable } from "./haiku.js";

const client = new Client({
    intents: GatewayIntentBits.Guilds |
        GatewayIntentBits.GuildMessages |
        GatewayIntentBits.MessageContent,
    presence: getPresence(),
    allowedMentions: { parse: [] },
    sweepers: {
        threads: {
            interval: DISCORD_SWEEPER_INTERVAL,
            lifetime: DISCORD_THREAD_LIFETIME
        },
        messages: {
            interval: DISCORD_SWEEPER_INTERVAL,
            lifetime: DISCORD_MESSAGE_LIFETIME
        }
    },
    makeCache: Options.cacheWithLimits({
        MessageManager: DISCORD_LIMITED_CACHE_MAX,
        UserManager: {
            maxSize: DISCORD_LIMITED_CACHE_MAX,
            keepOverLimit: keepClientUser
        },
        GuildMemberManager: {
            maxSize: DISCORD_LIMITED_CACHE_MAX,
            keepOverLimit: keepClientUser
        }
    })
})
    .on(Events.Debug, console.debug)
    .on(Events.Warn, console.warn)
    .on(Events.Error, console.error)
    .once(Events.ClientReady, async client => {
        try {
            client.off(Events.Debug, console.debug);
            console.log(`[discord] Logged in as ${client.user.tag}`);
            setInterval(() => client.user.setPresence(getPresence()), DISCORD_PRESENCE_INTERVAL);
            await Guild.bulkCreate(client.guilds.cache.map(guild => ({ id: guild.id })), { ignoreDuplicates: true });
        }
        catch (err) {
            console.error(err);
        }
    })
    .on(Events.GuildCreate, async guild => {
        try {
            if (client.isReady()) {
                await Guild.findOrCreate({
                    where: { id: guild.id }
                });
            }
        }
        catch (err) {
            console.error(err);
        }
    })
    .on(Events.InteractionCreate, async interaction => {
        try {
            if (interaction.isChatInputCommand()) {
                const command = commands.get(interaction.commandName);
                if (command) {
                    console.log(`[discord] ${interaction.user.id} used ${interaction}`);
                    await command.callback(interaction);
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    })
    .on(Events.MessageCreate, async message => {
        try {
            if (
                !message.author.bot &&
                message.cleanContent &&
                message.inGuild() &&
                message.channel.viewable &&
                message.channel
                    .permissionsFor(message.client.user)
                    ?.has(PermissionFlagsBits.SendMessages) &&
                haikuable(message.cleanContent) &&
                !await ignore(message)
            ) {
                const haiku = formatHaiku(message.cleanContent);
                if (haiku && haiku !== message.cleanContent) {
                    await message.channel.send(`${italic(haiku)}\n- ${message.author}`);
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    });

function getPresence(): PresenceData {
    return { activities: [activities[Math.floor(Math.random() * activities.length)]] };
}

function keepClientUser(userOrMember: User | GuildMember): boolean {
    return userOrMember.id === process.env.DISCORD_CLIENT_ID;
}

async function channelIgnored(channel: GuildChannel | ThreadChannel): Promise<boolean> {
    let ignored = !!await IgnoreChannel.findByPk(channel.id);
    if (channel.parent) {
        ignored ||= await channelIgnored(channel.parent);
    }
    return ignored;
}

async function ignore(message: Message<true>): Promise<boolean> {
    const [channel, user] = await Promise.all([
        channelIgnored(message.channel),
        IgnoreUser.findByPk(message.author.id)
    ]);
    return channel || !!user;
}

export async function login(): Promise<void> {
    await client.login();
}
