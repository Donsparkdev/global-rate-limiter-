import { createClient } from "redis";
import logger from "../logger";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("connect", () => {
  logger.info("✅ Redis connected");
});

redisClient.on("error", (error) => {
  logger.error(error);
});

export default redisClient;
