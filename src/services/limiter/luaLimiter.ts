import { readFileSync } from "fs";
import path from "path";
import redisClient from "../../config/redis";

const luaScript = readFileSync(
  path.join(__dirname, "../../lua/slidingWindow.lua"),
  "utf8"
);

export async function checkSlidingWindow(
  clientId: string,
  limit: number,
  windowMs = 60000
) {
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
  };
}
