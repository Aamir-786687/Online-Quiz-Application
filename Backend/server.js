import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database/db.js';
import quizRoutes from './routes/quizRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

// Routes
app.use('/api/quiz', quizRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: 'Quiz API is running!' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});