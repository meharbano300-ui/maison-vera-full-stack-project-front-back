import { Router } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Review from "../models/Review.js";
import Coupon from "../models/Coupon.js";
import Vendor from "../models/Vendor.js";
import ShippingMethod from "../models/ShippingMethod.js";
import Shipment from "../models/Shipment.js";
import CmsPage from "../models/CmsPage.js";
import Role from "../models/Role.js";
import ContactMessage from "../models/ContactMessage.js";
import Admin from "../models/Admin.js";
import Category from "../models/Category.js";
import bcrypt from "bcryptjs";
import { authAdmin, attachAdminPermissions, requirePermission } from "../middleware/auth.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = Router();
router.use(authAdmin, attachAdminPermissions);

async function syncProductRating(productId) {
  const reviews = await Review.find({ productId, isApproved: true });
  const count = reviews.length;
  const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  await Product.findOneAndUpdate(
    { id: productId },
    { rating: Math.round(avg * 10) / 10, reviews: count },
  );
}

function weekKey(date) {
  const d = new Date(date);
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return start.toISOString().slice(0, 10);
}

// ── Revenue Dashboard ──────────────────────────────────────────────────────
router.get("/dashboard", requirePermission(PERMISSIONS.DASHBOARD, PERMISSIONS.ALL), async (_req, res) => {
  try {
    const [products, users, orders, reviews, lowStock] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      User.countDocuments(),
      Order.find(),
      Review.countDocuments({ isApproved: true }),
      Product.find({ stock: { $lte: 10 }, isActive: true }).limit(10),
    ]);

    const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
    const pendingOrders = orders.filter((o) => o.status === "Processing").length;
    const onSale = await Product.countDocuments({ oldPrice: { $exists: true, $ne: null }, isActive: true });
    const blockedUsers = await User.countDocuments({ status: "blocked" });

    const categoryBreakdown = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "id",
          as: "productDoc",
        },
      },
      { $unwind: { path: "$productDoc", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$productDoc.category", "Uncategorised"] },
          count: { $sum: "$items.qty" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json({
      catalogue: { totalProducts: products, onSale, avgRating: 4.7, lowStock: lowStock.length },
      members: { total: users, blocked: blockedUsers, active: users - blockedUsers },
      commerce: { totalOrders: orders.length, pendingOrders, revenue, approvedReviews: reviews },
      lowStockProducts: lowStock,
      categoryBreakdown,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Analytics & Charts ─────────────────────────────────────────────────────
router.get("/analytics", requirePermission(PERMISSIONS.ANALYTICS, PERMISSIONS.ALL), async (_req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: "Cancelled" } });
    const monthlyRevenue = {};
    const weeklyRevenue = {};
    const statusCounts = { Processing: 0, "In Transit": 0, Delivered: 0, Cancelled: 0 };
    const topProducts = {};

    const allOrders = await Order.find();
    for (const o of allOrders) {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    }

    for (const o of orders) {
      const created = o.createdAt || new Date();
      const month = created.toISOString().slice(0, 7);
      const week = weekKey(created);
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + o.total;
      weeklyRevenue[week] = (weeklyRevenue[week] || 0) + o.total;
      for (const item of o.items) {
        topProducts[item.name] = (topProducts[item.name] || 0) + item.qty;
      }
    }

    const topSelling = Object.entries(topProducts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, qty]) => ({ name, qty }));

    const categoryPerformance = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "id",
          as: "productDoc",
        },
      },
      { $unwind: { path: "$productDoc", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$productDoc.category", "Uncategorised"] },
          revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
          units: { $sum: "$items.qty" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json({
      monthlyRevenue: Object.entries(monthlyRevenue)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, revenue]) => ({ month, revenue })),
      weeklyRevenue: Object.entries(weeklyRevenue)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12)
        .map(([week, revenue]) => ({ week, revenue })),
      categoryPerformance: categoryPerformance.map((c) => ({
        category: c._id,
        revenue: c.revenue,
        units: c.units,
      })),
      orderStatusPipeline: statusCounts,
      topSelling,
      totalRevenue: orders.reduce((s, o) => s + o.total, 0),
      averageOrderValue: orders.length ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Orders Management ──────────────────────────────────────────────────────
router.get("/orders", requirePermission(PERMISSIONS.ORDERS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const { status, q } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (q) {
      filter.$or = [
        { orderId: new RegExp(q, "i") },
        { userName: new RegExp(q, "i") },
        { userEmail: new RegExp(q, "i") },
      ];
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/orders/:orderId/status", requirePermission(PERMISSIONS.ORDERS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status: req.body.status },
      { new: true },
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Customer Management ────────────────────────────────────────────────────
router.get("/customers", requirePermission(PERMISSIONS.CUSTOMERS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const { status, q } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (q) filter.$or = [{ name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }];
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.json(users.map((u) => ({
      email: u.email,
      name: u.name,
      phone: u.phone,
      joinedAt: u.memberSince || u.createdAt,
      lastSeen: u.lastSeen,
      status: u.status,
      wishlist: u.wishlist,
      orderCount: u.orderCount,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/customers/:email/block", requirePermission(PERMISSIONS.CUSTOMERS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email.toLowerCase() },
      { status: "blocked" },
      { new: true },
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/customers/:email/unblock", requirePermission(PERMISSIONS.CUSTOMERS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email.toLowerCase() },
      { status: "active" },
      { new: true },
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/customers/:email", requirePermission(PERMISSIONS.CUSTOMERS, PERMISSIONS.ALL), async (req, res) => {
  try {
    await User.findOneAndDelete({ email: req.params.email.toLowerCase() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Products (admin CRUD) ──────────────────────────────────────────────────
router.get("/products", requirePermission(PERMISSIONS.PRODUCTS, PERMISSIONS.ALL), async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/products", requirePermission(PERMISSIONS.PRODUCTS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const id = req.body.id || `admin-${Date.now()}`;
    const product = await Product.create({ ...req.body, id });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/products/:id", requirePermission(PERMISSIONS.PRODUCTS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/products/:id", requirePermission(PERMISSIONS.PRODUCTS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Coupons ────────────────────────────────────────────────────────────────
router.get("/coupons", requirePermission(PERMISSIONS.COUPONS, PERMISSIONS.ALL), async (_req, res) => {
  try {
    res.json(await Coupon.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/coupons", requirePermission(PERMISSIONS.COUPONS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/coupons/:code", requirePermission(PERMISSIONS.COUPONS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndUpdate({ code: req.params.code.toUpperCase() }, req.body, { new: true });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/coupons/:code", requirePermission(PERMISSIONS.COUPONS, PERMISSIONS.ALL), async (req, res) => {
  try {
    await Coupon.findOneAndDelete({ code: req.params.code.toUpperCase() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Reviews ────────────────────────────────────────────────────────────────
router.get("/reviews", requirePermission(PERMISSIONS.REVIEWS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const filter = req.query.pending === "true" ? { isApproved: false } : {};
    res.json(await Review.find(filter).sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/reviews/:id/approve", requirePermission(PERMISSIONS.REVIEWS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!review) return res.status(404).json({ error: "Review not found" });
    await syncProductRating(review.productId);
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/reviews/:id/reply", requirePermission(PERMISSIONS.REVIEWS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { adminReply: req.body.reply },
      { new: true },
    );
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/reviews/:id", requirePermission(PERMISSIONS.REVIEWS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (review) await syncProductRating(review.productId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Inventory Tracking ─────────────────────────────────────────────────────
router.get("/inventory", requirePermission(PERMISSIONS.INVENTORY, PERMISSIONS.ALL), async (_req, res) => {
  try {
    const products = await Product.find({ isActive: true }).select("id name category stock lowStockThreshold price image");
    const lowStock = products.filter((p) => p.stock <= p.lowStockThreshold);
    const outOfStock = products.filter((p) => p.stock <= 0);
    res.json({ products, lowStock, outOfStock, totalSKUs: products.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/inventory/:id", requirePermission(PERMISSIONS.INVENTORY, PERMISSIONS.ALL), async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      { stock: req.body.stock, lowStockThreshold: req.body.lowStockThreshold },
      { new: true },
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/inventory/alerts", requirePermission(PERMISSIONS.INVENTORY, PERMISSIONS.ALL), async (_req, res) => {
  try {
    const lowStock = await Product.find({
      isActive: true,
      $expr: { $lte: ["$stock", "$lowStockThreshold"] },
    }).select("id name category stock lowStockThreshold price image");
    const outOfStock = await Product.find({ isActive: true, stock: { $lte: 0 } })
      .select("id name category stock price image");
    res.json({
      lowStock,
      outOfStock,
      alertCount: lowStock.length + outOfStock.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Shipping Management ────────────────────────────────────────────────────
router.get("/shipping/methods", requirePermission(PERMISSIONS.SHIPPING, PERMISSIONS.ALL), async (_req, res) => {
  try {
    res.json(await ShippingMethod.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/shipping/methods", requirePermission(PERMISSIONS.SHIPPING, PERMISSIONS.ALL), async (req, res) => {
  try {
    const method = await ShippingMethod.create(req.body);
    res.status(201).json(method);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/shipping/shipments", requirePermission(PERMISSIONS.SHIPPING, PERMISSIONS.ALL), async (_req, res) => {
  try {
    res.json(await Shipment.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/shipping/shipments", requirePermission(PERMISSIONS.SHIPPING, PERMISSIONS.ALL), async (req, res) => {
  try {
    const shipment = await Shipment.create(req.body);
    if (req.body.orderId) {
      await Order.findOneAndUpdate({ orderId: req.body.orderId }, {
        trackingNumber: req.body.trackingNumber,
        status: "In Transit",
      });
    }
    res.status(201).json(shipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Multi-Vendor ───────────────────────────────────────────────────────────
router.get("/vendors", requirePermission(PERMISSIONS.VENDORS, PERMISSIONS.ALL), async (_req, res) => {
  try {
    res.json(await Vendor.find().sort({ name: 1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/vendors", requirePermission(PERMISSIONS.VENDORS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/vendors/:slug", requirePermission(PERMISSIONS.VENDORS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/vendors/:slug/products", requirePermission(PERMISSIONS.VENDORS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ slug: req.params.slug });
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });

    const { productIds, action = "assign" } = req.body;
    if (!Array.isArray(productIds) || !productIds.length) {
      return res.status(400).json({ error: "productIds array required" });
    }

    if (action === "assign") {
      await Product.updateMany({ id: { $in: productIds } }, { vendorId: vendor._id });
    } else if (action === "unassign") {
      await Product.updateMany({ id: { $in: productIds }, vendorId: vendor._id }, { $unset: { vendorId: 1 } });
    } else {
      return res.status(400).json({ error: "action must be assign or unassign" });
    }

    const count = await Product.countDocuments({ vendorId: vendor._id, isActive: true });
    vendor.productCount = count;
    await vendor.save();

    const products = await Product.find({ vendorId: vendor._id, isActive: true }).select("id name category price");
    res.json({ vendor, products, productCount: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CMS Pages ──────────────────────────────────────────────────────────────
router.get("/cms/pages", requirePermission(PERMISSIONS.CMS, PERMISSIONS.ALL), async (_req, res) => {
  try {
    res.json(await CmsPage.find().sort({ sortOrder: 1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/cms/pages", requirePermission(PERMISSIONS.CMS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const page = await CmsPage.create(req.body);
    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/cms/pages/:slug", requirePermission(PERMISSIONS.CMS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const page = await CmsPage.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Reports ────────────────────────────────────────────────────────────────
router.get("/reports/sales", requirePermission(PERMISSIONS.REPORTS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { status: { $ne: "Cancelled" } };
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    const orders = await Order.find(filter);
    res.json({
      totalOrders: orders.length,
      totalRevenue: orders.reduce((s, o) => s + o.total, 0),
      averageOrderValue: orders.length ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0,
      orders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/reports/inventory", requirePermission(PERMISSIONS.REPORTS, PERMISSIONS.ALL), async (_req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json({
      totalSKUs: products.length,
      totalStockValue: products.reduce((s, p) => s + p.stock * p.price, 0),
      lowStock: products.filter((p) => p.stock <= p.lowStockThreshold),
      outOfStock: products.filter((p) => p.stock <= 0),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/reports/customers", requirePermission(PERMISSIONS.REPORTS, PERMISSIONS.ALL), async (_req, res) => {
  try {
    const users = await User.find();
    res.json({
      totalCustomers: users.length,
      active: users.filter((u) => u.status === "active").length,
      blocked: users.filter((u) => u.status === "blocked").length,
      topCustomers: users.sort((a, b) => b.orderCount - a.orderCount).slice(0, 10),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Roles & Permissions ────────────────────────────────────────────────────
router.get("/roles", requirePermission(PERMISSIONS.ROLES, PERMISSIONS.ALL), async (_req, res) => {
  try {
    res.json(await Role.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/roles", requirePermission(PERMISSIONS.ROLES, PERMISSIONS.ALL), async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/roles/:id", requirePermission(PERMISSIONS.ROLES, PERMISSIONS.ALL), async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/permissions", requirePermission(PERMISSIONS.ROLES, PERMISSIONS.ALL), (_req, res) => {
  res.json(Object.values(PERMISSIONS).filter((p) => p !== "*"));
});

// ── Contact Messages ───────────────────────────────────────────────────────
router.get("/contact-messages", requirePermission(PERMISSIONS.CMS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const filter = req.query.unread === "true" ? { status: "new" } : {};
    res.json(await ContactMessage.find(filter).sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/contact-messages/:id/read", requirePermission(PERMISSIONS.CMS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { status: "read" }, { new: true });
    if (!msg) return res.status(404).json({ error: "Message not found" });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/contact-messages/:id", requirePermission(PERMISSIONS.CMS, PERMISSIONS.ALL), async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin Users ────────────────────────────────────────────────────────────
router.get("/admins", requirePermission(PERMISSIONS.ROLES, PERMISSIONS.ALL), async (_req, res) => {
  try {
    const admins = await Admin.find().populate("roleId").select("-password").sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/admins", requirePermission(PERMISSIONS.ROLES, PERMISSIONS.ALL), async (req, res) => {
  try {
    const { email, password, name, roleId } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const admin = await Admin.create({
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
      name: name || "Maison Admin",
      roleId,
    });
    const safe = admin.toObject();
    delete safe.password;
    res.status(201).json(safe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/admins/:id", requirePermission(PERMISSIONS.ROLES, PERMISSIONS.ALL), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const admin = await Admin.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate("roleId")
      .select("-password");
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Categories (admin CRUD) ────────────────────────────────────────────────
router.get("/categories", requirePermission(PERMISSIONS.PRODUCTS, PERMISSIONS.ALL), async (_req, res) => {
  try {
    res.json(await Category.find().sort({ name: 1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/categories", requirePermission(PERMISSIONS.PRODUCTS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/categories/:slug", requirePermission(PERMISSIONS.PRODUCTS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/categories/:slug", requirePermission(PERMISSIONS.PRODUCTS, PERMISSIONS.ALL), async (req, res) => {
  try {
    await Category.findOneAndDelete({ slug: req.params.slug });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CMS delete ─────────────────────────────────────────────────────────────
router.delete("/cms/pages/:slug", requirePermission(PERMISSIONS.CMS, PERMISSIONS.ALL), async (req, res) => {
  try {
    await CmsPage.findOneAndDelete({ slug: req.params.slug });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Shipping method update/delete ──────────────────────────────────────────
router.patch("/shipping/methods/:id", requirePermission(PERMISSIONS.SHIPPING, PERMISSIONS.ALL), async (req, res) => {
  try {
    const method = await ShippingMethod.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!method) return res.status(404).json({ error: "Shipping method not found" });
    res.json(method);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/shipping/methods/:id", requirePermission(PERMISSIONS.SHIPPING, PERMISSIONS.ALL), async (req, res) => {
  try {
    await ShippingMethod.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ── Delete Role ────────────────────────────────────────────────────────────
router.delete("/roles/:id", requirePermission(PERMISSIONS.ROLES, PERMISSIONS.ALL), async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ error: "Role not found" });
    if (role.isSystem) return res.status(400).json({ error: "Cannot delete system roles" });
    await Role.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get Single Order (admin) ───────────────────────────────────────────────
router.get("/orders/:orderId", requirePermission(PERMISSIONS.ORDERS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Delete Vendor ──────────────────────────────────────────────────────────
router.delete("/vendors/:slug", requirePermission(PERMISSIONS.VENDORS, PERMISSIONS.ALL), async (req, res) => {
  try {
    await Vendor.findOneAndDelete({ slug: req.params.slug });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Customer Order History ─────────────────────────────────────────────────
router.get("/customers/:email/orders", requirePermission(PERMISSIONS.CUSTOMERS, PERMISSIONS.ALL), async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.params.email.toLowerCase() }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
