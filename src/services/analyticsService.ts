import redisClient from "../config/redis";

export async function logRequest(
  clientId: string,
  endpoint: string,
  method: string
) {
  try {
    await redisClient.xAdd(
      "analytics",
      "*",
      {
        clientId,
        endpoint,
        method,
        timestamp: Date.now().toString(),
      }
    );
  } catch (error) {
    // Don't block the request if analytics fails
    console.error("Analytics logging failed:", error);
  }
}
