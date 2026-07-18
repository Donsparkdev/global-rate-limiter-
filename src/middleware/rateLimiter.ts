import { Request, Response, NextFunction } from "express";
import { checkRateLimit } from "../services/limiter/rateLimiter";

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const clientId = req.headers["x-client-id"] as string || "anonymous";

  console.log("Checking client:", clientId);

  const result = await checkRateLimit(clientId, 100);

  res.setHeader(
    "X-RateLimit-Remaining",
    result.remaining
  );

  if (!result.allowed) {
    return res.status(429).json({
      message: "Too many requests"
    });
  }

  next();
}
