import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
    intents: GatewayIntentBits.Guilds
});

export async function login(): Promise<void> {
    await client.login();
}
