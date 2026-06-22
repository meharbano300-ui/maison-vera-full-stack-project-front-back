import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tagline: String,
    description: String,
    image: String,
    subs: [String],
  },
  { timestamps: true },
);

export default mongoose.model("Category", categorySchema);
