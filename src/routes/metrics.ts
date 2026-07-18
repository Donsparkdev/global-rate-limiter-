import { Router } from "express";
import redisClient from "../config/redis";

const router = Router();

router.get("/", async (_req, res) => {
  const keys = await redisClient.keys("rate:*");

  res.json({
    activeClients: keys.length,
    redis: redisClient.isReady,
    timestamp: new Date().toISOString(),
  });
});

export default router;
