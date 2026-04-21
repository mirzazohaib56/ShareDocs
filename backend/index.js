import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv'
import connectDB from './utils/connectDb.js';


dotenv.config();

console.log(process.env.MONGO_DB_URL)
const app = express();


await connectDB();

app.use(cors({
    origin: '*'
}))



app.use('/auth', authRoutes)