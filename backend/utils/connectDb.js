import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const url = process.env.MONGO_DB_URL;
    console.log("Attempting connection...");
    console.log("URL:", url);
    
    const connection = await mongoose.connect(url, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("Connection error name:", error.name);
    console.error("Connection error message:", error.message);
    console.error("Connection error code:", error.code);
    // Log the reason for each server
    if (error.reason) {
      console.error("Reason:", JSON.stringify(error.reason));
    }
  }
};

export default connectDB;