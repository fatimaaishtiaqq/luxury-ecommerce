import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { dropLegacyIndexes } from './utils/dropIndexes.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import subCategoryRoutes from './routes/subCategoryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();

// Allow all origins - required for Vercel cross-domain requests between frontend and backend
app.use(cors({ origin: '*' }));
app.use(express.json());

// Lazy DB connection middleware - connects once per serverless container lifecycle
let isConnected = false;
app.use(async (req, res, next) => {
    if (!isConnected) {
        try {
            await connectDB();
            isConnected = true;
            // Drop legacy indexes only once after first connection
            dropLegacyIndexes().catch(() => { });
        } catch (err) {
            return res.status(500).json({ message: 'Database connection failed', error: err.message });
        }
    }
    next();
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.send('Luxury E-Commerce API is running...');
});

// Only start listening locally - Vercel handles this automatically in serverless
if (process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
}

// Export for Vercel Serverless
export default app;
