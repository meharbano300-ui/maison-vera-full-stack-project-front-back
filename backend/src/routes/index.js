import { Router } from "express";
import mongoose from "mongoose";
import authRoutes from "./auth.routes.js";
import productsRoutes from "./products.routes.js";
import categoriesRoutes from "./categories.routes.js";
import ordersRoutes from "./orders.routes.js";
import usersRoutes from "./users.routes.js";
import reviewsRoutes from "./reviews.routes.js";
import couponsRoutes from "./coupons.routes.js";
import shippingRoutes from "./shipping.routes.js";
import cmsRoutes from "./cms.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

const MONGO_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Maison Vera API",
    version: "1.0.0",
    mongodb: MONGO_STATES[mongoose.connection.readyState] || "unknown",
  });
});   

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/orders", ordersRoutes);
router.use("/users", usersRoutes);
router.use("/reviews", reviewsRoutes);
router.use("/coupons", couponsRoutes);
router.use("/shipping", shippingRoutes);
router.use("/cms", cmsRoutes);
router.use("/admin", adminRoutes);

export default router;
