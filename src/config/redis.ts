import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

export default redisClient;
