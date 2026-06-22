import { Router } from "express";
import ShippingMethod from "../models/ShippingMethod.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const methods = await ShippingMethod.find({ isActive: true });
    res.json(methods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
