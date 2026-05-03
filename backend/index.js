import dotenv from 'dotenv'
dotenv.config(); // ← runs first before anything else

import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import connectDB from './utils/connectDb.js';
import cloudinary from "cloudinary";

const app = express();
app.use(express.json());

app.use(cors({ origin: '*' }))

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use('/auth', authRoutes)
app.use('/api/files', uploadRoutes)

const startServer = async () => {
  try {
    await connectDB();

    // ← dynamic import AFTER dotenv has run
    const { default: stripeRoutes } = await import("./routes/stripe.routes.js");
    app.use("/api/stripe", stripeRoutes);

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