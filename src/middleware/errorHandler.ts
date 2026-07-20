import { Request, Response, NextFunction } from "express";
import logger from "../logger";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(err);

  res.status(500).json({
    message: "Internal Server Error",
  });
}
