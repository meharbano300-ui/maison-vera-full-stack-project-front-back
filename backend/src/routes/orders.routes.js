import { Router } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import User from "../models/User.js";
import { formatDate } from "../seed/data.js";

const router = Router();

async function restoreStock(items) {
  for (const item of items) {
    if (item.productId) {
      await Product.findOneAndUpdate({ id: item.productId }, { $inc: { stock: item.qty } });
    }
  }
}

router.post("/", async (req, res) => {
  try {
    const { userEmail, userName, items, subtotal, shippingCost, deliveryMethod, couponCode, shippingAddress, paymentMethod } = req.body;
    if (!userEmail || !items?.length) return res.status(400).json({ error: "Invalid order data" });

    const user = await User.findOne({ email: userEmail.toLowerCase() });
    if (user?.status === "blocked") return res.status(403).json({ error: "Account suspended" });

    for (const item of items) {
      if (!item.productId) continue;
      const product = await Product.findOne({ id: item.productId, isActive: true });
      if (!product) return res.status(400).json({ error: `Product not found: ${item.productId}` });
      if (product.stock < item.qty) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name} (${product.stock} available)` });
      }
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
          if (subtotal >= (coupon.minOrder || 0)) {
            discount = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
            coupon.usedCount += 1;
            await coupon.save();
          }
        }
      }
    }

    const total = Math.max(0, (subtotal || 0) + (shippingCost || 0) - discount);
    const orderId = `MV ${Math.floor(20000 + Math.random() * 9000)}`;

    for (const item of items) {
      if (item.productId) {
        await Product.findOneAndUpdate({ id: item.productId }, { $inc: { stock: -item.qty } });
      }
    }

    const order = await Order.create({
      orderId,
      userEmail: userEmail.toLowerCase(),
      userName,
      date: formatDate(),
      total,
      subtotal,
      shippingCost: shippingCost || 0,
      discount,
      couponCode,
      deliveryMethod,
      shippingAddress,
      paymentMethod,
      items,
      status: "Processing",
    });

    await User.findOneAndUpdate({ email: userEmail.toLowerCase() }, { $inc: { orderCount: 1 } });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/:email", async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.params.email.toLowerCase() }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:orderId/cancel", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId, status: { $ne: "Delivered" } });
    if (!order) return res.status(404).json({ error: "Order not found or cannot cancel" });
    if (order.status === "Cancelled") return res.json(order);

    order.status = "Cancelled";
    await order.save();
    await restoreStock(order.items);

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
