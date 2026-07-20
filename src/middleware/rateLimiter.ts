import { Request, Response, NextFunction } from "express";
import { getClient } from "../services/clientService";
import { checkSlidingWindow } from "../services/limiter/luaLimiter";
import logger from "../logger";
import { logRequest } from "../services/analyticsService";

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    return res.status(401).json({
      message: "API key required",
    });
  }

  const client = getClient(apiKey);

  if (!client) {
    return res.status(403).json({
      message: "Invalid API key",
    });
  }

  try {
  const result = await checkSlidingWindow(
    client.id,
    client.requestsPerMinute
  );

  logger.info({
    requestId: req.headers["x-request-id"],
    client: client.id,
    endpoint: req.originalUrl,
    method: req.method,
    remaining: result.remaining,
    limiter: "sliding-window",
  });

  res.setHeader("X-RateLimit-Limit", client.requestsPerMinute);
  res.setHeader("X-RateLimit-Remaining", result.remaining);

  if (!result.allowed) {
    logger.warn({
      requestId: req.headers["x-request-id"],
      client: client.id,
      endpoint: req.originalUrl,
      message: "Rate limit exceeded",
    });

    return res.status(429).json({
      message: "Rate limit exceeded",
    });
  }

  next();

} catch (error) {
  logger.error({
    requestId: req.headers["x-request-id"],
    error,
    message: "Redis unavailable. Using fail-safe strategy.",
  });

  // Fail-safe: allow the request if Redis is temporarily unavailable
  next();
}
