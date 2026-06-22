import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  qty: Number,
  price: Number,
  size: String,
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true },
    userName: String,
    date: String,
    total: { type: Number, required: true },
    subtotal: Number,
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: String,
    status: {
      type: String,
      enum: ["Processing", "In Transit", "Delivered", "Cancelled"],
      default: "Processing",
    },
    items: [orderItemSchema],
    shippingAddress: {
      name: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      phone: String,
    },
    deliveryMethod: String,
    paymentMethod: String,
    trackingNumber: String,
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    notes: String,
  },
  { timestamps: true },
);

orderSchema.index({ userEmail: 1, status: 1 });

export default mongoose.model("Order", orderSchema);
