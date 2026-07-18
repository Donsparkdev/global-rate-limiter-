import { Request, Response, NextFunction } from "express";
import { getClient } from "../services/clientService";
import { checkSlidingWindow } from "../services/limiter/luaLimiter";
import logger from "../logger";

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

  const result = await checkSlidingWindow(
    client.id,
    client.requestsPerMinute
  );

  // Log every request
  logger.info({
    client: client.id,
    endpoint: req.originalUrl,
    method: req.method,
    remaining: result.remaining,
  });

  res.setHeader("X-RateLimit-Limit", client.requestsPerMinute);
  res.setHeader("X-RateLimit-Remaining", result.remaining);

  if (!result.allowed) {
    // Log only blocked requests
    logger.warn({
      client: client.id,
      endpoint: req.originalUrl,
      message: "Rate limit exceeded",
    });

    return res.status(429).json({
      message: "Rate limit exceeded",
    });
  }

  next();
}
