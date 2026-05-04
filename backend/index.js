import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import stripeRoutes from './routes/stripe.routes.js'; // ← static import
import connectDB from './utils/connectDb.js';
import cloudinary from "cloudinary";

const app = express();

// ✅ 1. CORS first — before everything
const corsOptions = {
  origin: [
    "https://share-docs-flax.vercel.app",
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ 2. Then body parser
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// ✅ 3. Then routes
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running 🚀" });
});
app.use('/auth', authRoutes);
app.use('/api/files', uploadRoutes);
app.use('/api/stripe', stripeRoutes);

connectDB().catch(err => console.error("DB failed:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 App is running on port ${PORT}`);
});

export default app; // ✅ required for Vercel serverless