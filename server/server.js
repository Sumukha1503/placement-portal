import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import hodRoutes from './routes/hodRoutes.js';
import tpoRoutes from './routes/tpoRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/tpo', tpoRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/companies', companyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});