import { Router } from "express";
import User from "../models/User.js";

const router = Router();

router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:email/profile", async (req, res) => {
  try {
    const allowed = ["name", "phone", "dob", "language", "currency", "twoFactor"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findOneAndUpdate(
      { email: req.params.email.toLowerCase() },
      { $set: updates },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:email/addresses", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (req.body.isDefault) user.addresses.forEach((a) => { a.isDefault = false; });
    user.addresses.push(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:email/addresses/:addressId", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ error: "Address not found" });
    if (req.body.isDefault) user.addresses.forEach((a) => { a.isDefault = false; });
    Object.assign(addr, req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:email/addresses/:addressId", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ error: "Address not found" });
    addr.deleteOne();
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:email/addresses/:addressId/default", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });
    user.addresses.forEach((a) => { a.isDefault = a._id.toString() === req.params.addressId; });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:email/cards", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });
    const { brand, last4, exp, name, isDefault } = req.body;
    if (isDefault) user.cards.forEach((c) => { c.isDefault = false; });
    user.cards.push({ brand, last4, exp, name, isDefault: isDefault || user.cards.length === 0 });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:email/cards/:cardId", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });
    const card = user.cards.id(req.params.cardId);
    if (!card) return res.status(404).json({ error: "Card not found" });
    card.deleteOne();
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:email/cards/:cardId/default", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });
    user.cards.forEach((c) => { c.isDefault = c._id.toString() === req.params.cardId; });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:email/wishlist", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email.toLowerCase() },
      { wishlist: req.body.wishlist || [] },
      { new: true },
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:email", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.email.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
