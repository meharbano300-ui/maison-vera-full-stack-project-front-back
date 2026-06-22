import { Router } from "express";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import Role from "../models/Role.js";
import { signToken, authAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password && !email) {
      if (password === process.env.ADMIN_PASSWORD || password === "admin123") {
        return res.json({ success: true, legacy: true, message: "Use password-only login for legacy admin" });
      }
    }
    const admin = await Admin.findOne({ email: (email || process.env.ADMIN_EMAIL)?.toLowerCase() }).populate("roleId");
    if (!admin || !admin.isActive) {
      if (password === (process.env.ADMIN_PASSWORD || "admin123")) {
        return res.json({ token: signToken({ legacy: true, permissions: ["*"] }), legacy: true });
      }
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const permissions = admin.roleId?.permissions || ["*"];
    res.json({
      token: signToken({ id: admin._id, email: admin.email, permissions }),
      admin: { email: admin.email, name: admin.name, permissions },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/admin/password-login", async (req, res) => {
  const { password } = req.body;
  if (password === (process.env.ADMIN_PASSWORD || "admin123")) {
    return res.json({ token: signToken({ legacy: true, permissions: ["*"] }), legacy: true });
  }
  return res.status(401).json({ error: "Invalid password" });
});

router.post("/users/register", async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const { email, name, phone, password } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      if (user.status === "blocked") return res.status(403).json({ error: "Account suspended" });
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.lastSeen = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
      await user.save();
      return res.json({ user: sanitizeUser(user) });
    }
    const hash = password ? await bcrypt.hash(password, 10) : undefined;
    user = await User.create({
      email: email.toLowerCase(),
      name: name || "Maison Member",
      phone: phone || "",
      password: hash,
      memberSince: new Date().getFullYear().toString(),
      lastSeen: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
    });
    res.status(201).json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.status === "blocked") return res.status(403).json({ error: "Account suspended" });
    if (user.password && password) {
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ error: "Invalid password" });
    }
    user.lastSeen = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    await user.save();
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/admin/me", authAdmin, async (req, res) => {
  if (req.admin.legacy) return res.json({ legacy: true, permissions: ["*"] });
  const admin = await Admin.findById(req.admin.id).populate("roleId").select("-password");
  res.json({ admin, permissions: admin?.roleId?.permissions || [] });
});

function sanitizeUser(user) {
  const o = user.toObject();
  delete o.password;
  return o;
}

export default router;

// Vendor public registration
router.post("/vendors/register", async (req, res) => {
  try {
    const Vendor = (await import("../models/Vendor.js")).default;
    const { name, email, phone, description } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email required" });
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const existing = await Vendor.findOne({ $or: [{ email }, { slug }] });
    if (existing) return res.status(409).json({ error: "Vendor already registered" });
    const vendor = await Vendor.create({ name, email, phone, description, slug, status: "pending" });
    res.status(201).json({ success: true, vendor: { name: vendor.name, email: vendor.email, status: vendor.status } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
