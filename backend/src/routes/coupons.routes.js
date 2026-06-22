import { Router } from "express";
import Coupon from "../models/Coupon.js";

const router = Router();

router.post("/validate", async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ valid: false, error: "Invalid coupon" });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.json({ valid: false, error: "Coupon expired" });
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return res.json({ valid: false, error: "Coupon limit reached" });
    if (subtotal < (coupon.minOrder || 0)) return res.json({ valid: false, error: `Minimum order €${coupon.minOrder}` });
    const discount = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
    res.json({ valid: true, coupon, discount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
