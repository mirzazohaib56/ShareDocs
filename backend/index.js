import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import dotenv from 'dotenv'
import connectDB from './utils/connectDb.js';
import cloudinary from "cloudinary";
const { v2: cloudinaryV2 } = cloudinary;


dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: '*'
}))

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use('/auth', authRoutes)
app.use('/api/upload', uploadRoutes)

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 App is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();