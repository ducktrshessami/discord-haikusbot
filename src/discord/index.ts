import {
    ChannelType,
    Client,
    Events,
    GatewayIntentBits,
    GuildMember,
    GuildTextBasedChannel,
    Options,
    PermissionFlagsBits,
    PresenceData,
    User,
    italic
} from "discord.js";
import {
    DISCORD_LIMITED_CACHE_MAX,
    DISCORD_MESSAGE_LIFETIME,
    DISCORD_PRESENCE_INTERVAL,
    DISCORD_SWEEPER_INTERVAL,
    DISCORD_THREAD_LIFETIME
} from "../constants.js";
import activities from "./activities.js";
import commands from "./commands/index.js";
import { formatHaiku, haikuable } from "./haiku.js";
import { ignoreMessage } from "./ignore.js";

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
        // client.off(Events.Debug, console.debug);
        console.log(`[discord] Logged in as ${client.user.tag}`);
        setInterval(() => client.user.setPresence(getPresence()), DISCORD_PRESENCE_INTERVAL);
    })
    .on(Events.InteractionCreate, async interaction => {
        try {
            if (interaction.isChatInputCommand()) {
                const command = commands.get(interaction.commandName);
                if (
                    command && (
                        command.data.dm_permission !== false ||
                        interaction.inCachedGuild()
                    )
                ) {
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
                !message.guild.members.me?.isCommunicationDisabled() &&
                isSendable(message.channel) &&
                haikuable(message.cleanContent) &&
                !await ignoreMessage(message)
            ) {
                const haiku = formatHaiku(message.cleanContent);
                if (haiku && haiku.toLowerCase() != message.cleanContent.toLowerCase()) {
                    await message.channel.send(`${italic(haiku)}\n\\- ${message.author}`);
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    });

export async function login(): Promise<void> {
    await client.login();
}

function getPresence(): PresenceData {
    return { activities: [activities[Math.floor(Math.random() * activities.length)]] };
}

function keepClientUser(userOrMember: User | GuildMember): boolean {
    return userOrMember.id === process.env.DISCORD_CLIENT_ID;
}

function isSendable(channel: GuildTextBasedChannel): boolean {
    const permissions = channel.permissionsFor(channel.client.user);
    return !!permissions?.has(PermissionFlagsBits.ViewChannel) && (
        channel.isThread() ? (
            !(channel.archived && channel.locked && !channel.manageable) &&
            (channel.type !== ChannelType.PrivateThread || channel.joined || channel.manageable) &&
            permissions.has(PermissionFlagsBits.SendMessagesInThreads)
        ) :
            permissions.has(PermissionFlagsBits.SendMessages)
    );
}
