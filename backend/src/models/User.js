import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: String,
  name: String,
  line1: String,
  city: String,
  zip: String,
  country: String,
  phone: String,
  isDefault: { type: Boolean, default: false },
});

const cardSchema = new mongoose.Schema({
  brand: String,
  last4: String,
  exp: String,
  name: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: String,
    name: { type: String, default: "Maison Member" },
    phone: String,
    dob: String,
    language: { type: String, default: "English (UK)" },
    currency: { type: String, default: "EUR · €" },
    memberSince: String,
    twoFactor: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    wishlist: [String],
    orderCount: { type: Number, default: 0 },
    addresses: [addressSchema],
    cards: [cardSchema],
    lastSeen: String,
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
