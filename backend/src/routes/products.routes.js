import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

const router = Router();

// 1. GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const { category, subcategory, search, minPrice, maxPrice, badge } = req.query;
    const filter = { isActive: true };
    if (category && category !== "All") filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (badge) filter.badge = badge;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET CATEGORIES META DATA
router.get("/meta/categories", async (_req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET SUBCATEGORIES META DATA
router.get("/meta/subcategories", async (_req, res) => {
  try {
    const subs = await Product.distinct("subcategory", { isActive: true });
    res.json(subs.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. GET SINGLE PRODUCT BY ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id, isActive: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE PRODUCT ENDPOINT (SMART OVERHAUL)
router.delete("/:id", async (req, res) => {
  try {
    const targetId = req.params.id;

    // 1. Pehle custom string 'id' se delete karne ki koshish karein
    let result = await Product.deleteOne({ id: targetId });

    // 2. Agar custom id se delete nahi hua (0 deleted), toh MongoDB ki default _id se check karein
    if (result.deletedCount === 0 && mongoose.Types.ObjectId.isValid(targetId)) {
      result = await Product.deleteOne({ _id: targetId });
    }

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found with this ID" });
    }
    
    res.json({ success: true, message: "Product deleted successfully from Maison Vera" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;