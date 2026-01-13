import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import queueRoutes from './routes/queueRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';
import { swaggerSpec } from './config/swagger';

const app = express();

// Configure Helmet to allow images to be loaded
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Serve static files from uploads directory (before routes)
app.use('/uploads', express.static('uploads'));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Post Scheduler API Documentation',
}));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/queue', queueRoutes);

app.use(errorMiddleware);

export default app;