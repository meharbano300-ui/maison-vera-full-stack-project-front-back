import mongoose from "mongoose";

const cmsPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: String,
    metaTitle: String,
    metaDescription: String,
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("CmsPage", cmsPageSchema);
