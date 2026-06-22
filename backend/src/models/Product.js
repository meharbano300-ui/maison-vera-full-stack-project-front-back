import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tagline: String,
    category: { type: String, required: true },
    subcategory: String,
    color: String,
    price: { type: Number, required: true },
    oldPrice: Number,
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    image: String,
    badge: String,
    description: String,
    details: [String],
    sizes: [String],
    stock: { type: Number, default: 100 },
    lowStockThreshold: { type: Number, default: 10 },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
