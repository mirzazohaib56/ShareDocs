import mongoose from "mongoose";

let isConnected = false; // ← cache connection across warm invocations

const connectDB = async () => {
  if (isConnected) return; // ← reuse existing connection

  try {
    const url = process.env.MONGO_DB_URL;
    console.log("URL:", url);
    const connection = await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

export default connectDB;