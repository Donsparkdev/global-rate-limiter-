import express from "express";
import redisClient from "./config/redis";
import { rateLimiter } from "./middleware/rateLimiter";

const app = express();

const PORT = process.env.PORT || 3000;

// Global middleware first
app.use(express.json());

// Connect Redis
redisClient.connect()
  .then(() => {
    console.log("✅ Redis connected");
  })
  .catch((error) => {
    console.error("Redis connection failed:", error);
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

  res.json({
    status: "OK",
    redis: redisClient.isReady ? "connected" : "disconnected",
    service: "Global Rate Limiter",
  });

});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
