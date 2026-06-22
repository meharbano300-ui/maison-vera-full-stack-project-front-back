import mongoose from "mongoose";

const shippingMethodSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    eta: String,
    price: { type: Number, default: 0 },
    note: String,
    regions: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("ShippingMethod", shippingMethodSchema);
