import redisClient from "../../config/redis";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export async function checkRateLimit(
  clientId: string,
  limit: number,
  windowSeconds = 60
): Promise<RateLimitResult> {

  const key = `rate:${clientId}`;

  const current = await redisClient.incr(key);

  console.log("Redis key:", key, "count:", current);

  if (current === 1) {
    await redisClient.expire(key, windowSeconds);
  }

  return {
    allowed: current <= limit,
    remaining: Math.max(limit - current, 0),
  };
}
