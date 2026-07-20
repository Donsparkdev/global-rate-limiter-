import express from "express";
import redisClient from "./config/redis";
import { rateLimiter } from "./middleware/rateLimiter";
import metricsRouter from "./routes/metrics";
import logger from "./logger";
import { requestId } from "./middleware/requestId";

const app = express();

const PORT = process.env.PORT || 3000;

// Global middleware first
app.use(express.json());

// metrics
app.use("/metrics", metricsRouter);

// Connect Redis
redisClient.connect()
  .then(() => {
    logger.info(`🚀 Server running on port ${PORT}`);
  })
  .catch((error) => {
    logger.error("Redis connection failed:", error);
  });


// Test rate limiter route
app.get(
  "/api/test",
  rateLimiter,
  (_req, res) => {
    res.json({
      message: "Request accepted"
    });
  }
);


// Health check 
app.get("/health", (_req, res) => {
  const memory = process.memoryUsage();

  res.json({
    status: "OK",
    service: "Global Rate Limiter",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    redis: redisClient.isReady ? "connected" : "disconnected",
    memory: {
      rss: memory.rss,
      heapUsed: memory.heapUsed,
      heapTotal: memory.heapTotal,
    },
  });
});


const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

async function shutdown() {
  logger.info("Shutting down server...");

  server.close(async () => {
    try {
      if (redisClient.isOpen) {
        await redisClient.quit();
      }

      logger.info("Redis disconnected");
      process.exit(0);
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
