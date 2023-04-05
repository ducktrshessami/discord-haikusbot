import dotenv from "./dotenv.js";

await dotenv();

export const NODE_ENV = process.env.NODE_ENV || "development";
export const DB_FORCE = !!process.env.DB_FORCE && process.env.DB_FORCE.trim().toLowerCase() !== "false";
export const DISCORD_PRESENCE_INTERVAL = process.env.DISCORD_PRESENCE_INTERVAL ? parseInt(process.env.DISCORD_PRESENCE_INTERVAL) : 1800000;
