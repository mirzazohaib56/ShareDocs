import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv'
import connectDB from './utils/connectDb.js';


dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: '*'
}))

app.use('/auth', authRoutes)

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