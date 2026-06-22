import { Router } from "express";
import CmsPage from "../models/CmsPage.js";
import ContactMessage from "../models/ContactMessage.js";

const router = Router();

router.get("/pages", async (_req, res) => {
  try {
    const pages = await CmsPage.find({ isPublished: true }).sort({ sortOrder: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/pages/:slug", async (req, res) => {
  try {
    const page = await CmsPage.findOne({ slug: req.params.slug, isPublished: true });
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/contact", async (req, res) => {
  try {
    const msg = await ContactMessage.create(req.body);
    res.status(201).json({ success: true, id: msg._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
