import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";

const PORT = process.env.PORT || 5000;
// Change 1: Mongodb URI ko render par environmental variable se uthane ke liye preference di hai
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/maison-vera";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.use("/api", routes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

async function start() {
  await connectDB(MONGODB_URI);
  // Change 2: "0.0.0.0" ko remove kiya hai takay Render auto-bind kar sakay (kabhi kabhar string host se Render free tier freeze ho jata hai)
  app.listen(PORT, () => {
    console.log(`Maison Vera API running on port ${PORT}`);
    console.log(`Health check ready at /api/health`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});