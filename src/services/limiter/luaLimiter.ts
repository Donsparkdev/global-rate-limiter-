import { readFileSync } from "fs";
import path from "path";
import redisClient from "../../config/redis";
import logger from "../../logger";

const luaScript = readFileSync(
  path.join(__dirname, "../../lua/slidingWindow.lua"),
  "utf8"
);

export async function checkSlidingWindow(
  clientId: string,
  limit: number,
  windowMs = 60000
) {
  try {
    // Redis health check
    if (!redisClient.isReady) {
      throw new Error("Redis unavailable");
    }

    const now = Date.now();

    const result = await redisClient.eval(luaScript, {
      keys: [`rate:${clientId}`],
      arguments: [
        now.toString(),
        windowMs.toString(),
        limit.toString(),
      ],
    });

    const [allowed, remaining] = result as number[];

    return {
      allowed: allowed === 1,
      remaining,
      source: "redis",
    };

  } catch (error) {

    logger.warn({
      message: "Rate limiter fallback activated",
      client: clientId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    // Fail-open strategy
    return {
      allowed: true,
      remaining: limit,
      source: "fallback",
    };
  }
}
