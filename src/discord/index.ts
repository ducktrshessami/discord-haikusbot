import {
    Client,
    GatewayIntentBits,
    GuildMember,
    Options,
    PresenceData,
    User
} from "discord.js";
import activities from "./activities.js";
import {
    DISCORD_LIMITED_CACHE_MAX,
    DISCORD_MESSAGE_LIFETIME,
    DISCORD_PRESENCE_INTERVAL,
    DISCORD_SWEEPER_INTERVAL,
    DISCORD_THREAD_LIFETIME
} from "../constants.js";

const client = new Client({
    intents: GatewayIntentBits.Guilds,
    presence: getPresence(),
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
    .on("debug", console.debug)
    .on("warn", console.warn)
    .on("error", console.error)
    .once("ready", client => {
        client.off("debug", console.debug);
        console.log(`[discord] Logged in as ${client.user.tag}`);
        setInterval(() => client.user.setPresence(getPresence()), DISCORD_PRESENCE_INTERVAL);
    });

function getPresence(): PresenceData {
    return { activities: [activities[Math.floor(Math.random() * activities.length)]] };
}

function keepClientUser(userOrMember: User | GuildMember): boolean {
    return userOrMember.id === process.env.DISCORD_CLIENT_ID;
}

export async function login(): Promise<void> {
    await client.login();
}
