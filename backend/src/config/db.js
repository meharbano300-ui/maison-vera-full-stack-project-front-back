import mongoose from "mongoose";

export async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  console.log(`Connecting to MongoDB at ${uri} ...`);
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("\n❌ Could not connect to MongoDB.");
    console.error(`   URI: ${uri}`);
    console.error(`   Reason: ${err.message}`);
    console.error("\n   Things to check:");
    console.error("   1. Is MongoDB actually running? (e.g. run `mongod` or start the MongoDB service)");
    console.error("   2. Does backend/.env have the correct MONGODB_URI?");
    console.error("   3. If using MongoDB Atlas, is your IP allow-listed and is the connection string correct?\n");
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error after initial connect:", err.message);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected. The API will not be able to read/write data until it reconnects.");
  });
}
