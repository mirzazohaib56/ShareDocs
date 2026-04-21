import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv'
import connectDB from './utils/connectDb.js';


dotenv.config();

console.log(process.env.MONGO_DB_URL)
const app = express();


app.use(cors({
    origin: '*'
}))

app.use('/auth', authRoutes)

const startServer = async () => {
  try {
    console.log("DB URL:", process.env.MONGO_DB_URL);

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