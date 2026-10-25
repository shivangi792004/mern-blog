import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import { ensureSeedData } from './controllers/post.controller.js';

dotenv.config();

// Connect to MongoDB
if (process.env.MONGO) {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log('MongoDB is connected successfully');
      ensureSeedData();
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
    });
} else {
  console.warn('WARNING: process.env.MONGO is not defined. Ensure MongoDB connection string is set in .env');
}

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 3000;

// Security & Parsing Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Rate Limiting for Authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
});
app.use('/api/auth', authLimiter);

// Health Check Endpoint (Vital for monitoring, container health, and SDE evaluation)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'UP',
    service: 'Personal Blog API',
    uptime: `${process.uptime().toFixed(1)}s`,
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Serve Frontend in Production
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Global Centralized Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

const server = app.listen(PORT, () => {
  console.log(`Personal Blog Server is running on port ${PORT}!`);
});

// Graceful Shutdown for cloud and production environments
const shutdown = () => {
  console.log('Received shutdown signal, closing server gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
