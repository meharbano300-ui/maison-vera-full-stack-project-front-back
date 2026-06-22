import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    carrier: String,
    trackingNumber: String,
    status: {
      type: String,
      enum: ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered", "Returned"],
      default: "Pending",
    },
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date,
    notes: String,
  },
  { timestamps: true },
);

export default mongoose.model("Shipment", shipmentSchema);
