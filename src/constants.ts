import dotenv from "./dotenv.js";

await dotenv();

export const NODE_ENV = process.env.NODE_ENV || "development";
