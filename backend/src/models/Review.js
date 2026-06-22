import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    userEmail: String,
    userName: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: String,
    comment: String,
    isApproved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    adminReply: String,
  },
  { timestamps: true },
);

reviewSchema.index({ productId: 1 });

export default mongoose.model("Review", reviewSchema);
