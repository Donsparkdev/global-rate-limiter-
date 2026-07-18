import { Request, Response, NextFunction } from "express";
import { checkRateLimit } from "../services/limiter/rateLimiter";
import { getClient } from "../services/clientService";

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

  const result = await checkRateLimit(
    client.id,
    client.requestsPerMinute
  );

  res.setHeader("X-RateLimit-Limit", client.requestsPerMinute);
  res.setHeader("X-RateLimit-Remaining", result.remaining);

  if (!result.allowed) {
    return res.status(429).json({
      message: "Rate limit exceeded",
    });
  }

  next();
}
