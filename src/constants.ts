export const NODE_ENV = process.env.NODE_ENV || "development";
export const DB_FORCE = !!process.env.DB_FORCE && process.env.DB_FORCE.trim().toLowerCase() !== "false";
export const DISCORD_PRESENCE_INTERVAL = process.env.DISCORD_PRESENCE_INTERVAL ? parseInt(process.env.DISCORD_PRESENCE_INTERVAL) : 1800000;
export const DISCORD_SWEEPER_INTERVAL = process.env.DISCORD_SWEEPER_INTERVAL ? parseInt(process.env.DISCORD_SWEEPER_INTERVAL) : 3600;
export const DISCORD_THREAD_LIFETIME = process.env.DISCORD_THREAD_LIFETIME ? parseInt(process.env.DISCORD_THREAD_LIFETIME) : 3600;
export const DISCORD_MESSAGE_LIFETIME = process.env.DISCORD_MESSAGE_LIFETIME ? parseInt(process.env.DISCORD_MESSAGE_LIFETIME) : 3600;
export const DISCORD_LIMITED_CACHE_MAX = process.env.DISCORD_LIMITED_CACHE_MAX ? parseInt(process.env.DISCORD_LIMITED_CACHE_MAX) : 100;
