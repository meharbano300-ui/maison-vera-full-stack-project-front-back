import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../mongo-import");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/maison-vera";

const COLLECTIONS = [
  { model: Role, name: "roles" },
  { model: Admin, name: "admins" },
  { model: Category, name: "categories" },
  { model: Vendor, name: "vendors" },
  { model: Product, name: "products" },
  { model: ShippingMethod, name: "shippingmethods" },
  { model: Coupon, name: "coupons" },
  { model: CmsPage, name: "cmspages" },
  { model: User, name: "users" },
  { model: Order, name: "orders" },
  { model: Shipment, name: "shipments" },
  { model: Review, name: "reviews" },
];

function toExtendedJson(docs) {
  return docs.map((doc) => {
    const obj = doc.toObject ? doc.toObject({ versionKey: false }) : doc;
    if (obj._id) {
      obj._id = { $oid: obj._id.toString() };
    }
    for (const key of Object.keys(obj)) {
      if (obj[key] instanceof mongoose.Types.ObjectId) {
        obj[key] = { $oid: obj[key].toString() };
      }
      if (obj[key] instanceof Date) {
        obj[key] = { $date: obj[key].toISOString() };
      }
    }
    return obj;
  });
}

async function exportAll() {
  await connectDB(MONGODB_URI);
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const { model, name } of COLLECTIONS) {
    const docs = await model.find().lean();
    const json = toExtendedJson(docs);
    const filePath = path.join(OUT_DIR, `maison-vera.${name}.json`);
    fs.writeFileSync(filePath, json.map((j) => JSON.stringify(j)).join("\n"));
    console.log(`Exported ${docs.length} docs → ${filePath}`);
  }

  console.log(`\n✅ Export complete in: ${OUT_DIR}`);
  console.log("Import with mongoimport (run seed first, then export):");
  console.log(`  mongoimport --db maison-vera --collection products --file mongo-import/maison-vera.products.json`);

  await mongoose.disconnect();
}

exportAll().catch((err) => {
  console.error("Export failed:", err);
  process.exit(1);
});
