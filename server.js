import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import machineRoutes from './routes/machine.routes.js';
import categoryRoutes from './routes/category.routes.js';
import bookingRoutes from './routes/booking.routes.js';

import { notFound, errorHandler } from './middleware/error.middleware.js';

dotenv.config();
connectDB();

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors({
  origin: 'http://localhost:5173', // Vite frontend
  credentials: true,
}));

/** * IMPORTANT: Increased limit to handle Base64 Image strings 
 * from the Owner Dashboard 
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/* ===== ROUTES ===== */
app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/bookings', bookingRoutes);

/* ===== ERROR HANDLERS ===== */
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);