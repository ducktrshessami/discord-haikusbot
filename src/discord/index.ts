import {
    Client,
    Events,
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
import { Guild } from "../models/index.js";
import commands from "./commands/index.js";

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
