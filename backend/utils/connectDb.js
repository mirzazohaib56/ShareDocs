import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const url = process.env.MONGO_DB_URL
    console.log(url,'urll')
    const connection = await mongoose.connect(url);

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // stop app if DB fails
  }
};

export default connectDB;