import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    console.log("Missing redis url.");
    process.exit(1);
}

export const redisClient = createClient({
    url: redisUrl,
});