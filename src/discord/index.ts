import {
    Client,
    GatewayIntentBits,
    PresenceData
} from "discord.js";
import activities from "./activities.js";
import { DISCORD_PRESENCE_INTERVAL } from "../constants.js";

const client = new Client({
    intents: GatewayIntentBits.Guilds,
    presence: getPresence()
})
    .on("ready", client => {
        console.log(`[discord] Logged in as ${client.user.tag}`);
        setInterval(() => client.user.setPresence(getPresence()), DISCORD_PRESENCE_INTERVAL);
    });

function getPresence(): PresenceData {
    return { activities: [activities[Math.floor(Math.random() * activities.length)]] };
}

export async function login(): Promise<void> {
    await client.login();
}
