import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: String,
    phone: String,
    description: String,
    logo: String,
    commission: { type: Number, default: 15 },
    status: { type: String, enum: ["active", "pending", "suspended"], default: "active" },
    address: {
      line1: String,
      city: String,
      country: String,
    },
    productCount: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Vendor", vendorSchema);
