import { Router } from "express";
import authRoutes from "./auth";
import sportsToolsRoutes from "./sports-tools";
import paymentRoutes from "./payment";
import casinoRoutes from "./casino";
import affiliateRoutes from "./affiliate";
const router = Router();

// Health check route
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
router.use("/auth", authRoutes);
router.use("/sports-tools", sportsToolsRoutes);
router.use("/casino", casinoRoutes);
router.use("/payment", paymentRoutes);
router.use("/affiliate", affiliateRoutes);
export default router;
