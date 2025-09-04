import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import path from "path";
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import connectDB from './config/mongodb.js'

const app = express();
const port = process.env.PORT || 4000
connectDB();

app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(cookieParser());

// Serve static files from React build
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoints
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Serve React app for all other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
