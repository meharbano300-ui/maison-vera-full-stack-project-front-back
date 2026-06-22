import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { DEFAULT_ROLES } from "../config/permissions.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Admin from "../models/Admin.js";
import Role from "../models/Role.js";
import Coupon from "../models/Coupon.js";
import Review from "../models/Review.js";
import ShippingMethod from "../models/ShippingMethod.js";
import Shipment from "../models/Shipment.js";
import Vendor from "../models/Vendor.js";
import CmsPage from "../models/CmsPage.js";
import {
  categoryList,
  products,
  shippingMethods,
  coupons,
  vendors,
  cmsPages,
  sampleReviews,
  sampleUsers,
  sampleOrders,
  formatDate,
} from "./data.js";

const MONGODB_URI = "mongodb+srv://Samra-Amir:Samrapass12345@cluster0.yh68m8f.mongodb.net/maison-vera?retryWrites=true&w=majority";


async function clearAll() {
  const collections = [
    Category, Product, User, Order, Admin, Role, Coupon,
    Review, ShippingMethod, Shipment, Vendor, CmsPage,
  ];
  for (const Model of collections) {
    await Model.deleteMany({});
  }
  console.log("Cleared all collections");
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await connectDB(MONGODB_URI);
  await clearAll();

  console.log("Seeding roles...");
  const roles = await Role.insertMany(DEFAULT_ROLES);
  const superAdminRole = roles.find((r) => r.name === "Super Admin");

  console.log("Seeding admin user...");
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  await Admin.create({
    email: (process.env.ADMIN_EMAIL || "admin@maisonvera.com").toLowerCase(),
    password: await bcrypt.hash(adminPassword, 10),
    name: "Maison Admin",
    roleId: superAdminRole._id,
  });

  console.log("Seeding categories...");
  await Category.insertMany(categoryList);

  console.log("Seeding vendors...");
  const vendorDocs = await Vendor.insertMany(vendors);

  console.log("Seeding products...");
  const vendorMap = {
    "Fashion & Apparel": vendorDocs[0]._id,
    "Beauty & Personal Care": vendorDocs[1]._id,
    "Groceries & Essentials": vendorDocs[2]._id,
  };
  const productDocs = products.map((p) => ({
    ...p,
    vendorId: vendorMap[p.category] || vendorDocs[0]._id,
    lowStockThreshold: p.stock <= 20 ? 5 : 10,
  }));
  await Product.insertMany(productDocs);

  console.log("Seeding shipping methods...");
  await ShippingMethod.insertMany(shippingMethods);

  console.log("Seeding coupons...");
  await Coupon.insertMany(coupons);

  console.log("Seeding CMS pages...");
  await CmsPage.insertMany(cmsPages);

  console.log("Seeding sample users...");
  const now = formatDate();
  await User.insertMany(
    sampleUsers.map((u) => ({
      ...u,
      memberSince: u.memberSince,
      lastSeen: now,
      joinedAt: now,
      wishlist: [],
      orderCount: u.email === "elena@example.com" ? 2 : u.email === "james@example.com" ? 1 : u.email === "sophie@example.com" ? 1 : 0,
    })),
  );

  console.log("Seeding sample orders...");
  await Order.insertMany(sampleOrders());

  console.log("Seeding sample shipments...");
  await Shipment.insertMany([
    {
      orderId: "MV 28452",
      carrier: "Maison Express",
      trackingNumber: "MV-TRK-884521",
      status: "In Transit",
      shippedAt: new Date(Date.now() - 86400000 * 3),
    },
    {
      orderId: "MV 28390",
      carrier: "Maison Standard",
      trackingNumber: "MV-TRK-773901",
      status: "Delivered",
      shippedAt: new Date(Date.now() - 86400000 * 10),
      deliveredAt: new Date(Date.now() - 86400000 * 8),
    },
  ]);

  console.log("Seeding reviews...");
  await Review.insertMany(sampleReviews);

  console.log("\n✅ Seed complete!");
  console.log(`   Database: ${mongoose.connection.name}`);
  console.log(`   Products: ${productDocs.length}`);
  console.log(`   Categories: ${categoryList.length}`);
  console.log(`   Admin: ${process.env.ADMIN_EMAIL || "admin@maisonvera.com"} / ${adminPassword}`);
  console.log(`   API: http://localhost:${process.env.PORT || 5000}/api/health`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
