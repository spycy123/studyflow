import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { apiRouter } from './routes/index.js';
import { config } from './config/index.js';

export const app = express();

// Middlewares
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(express.json());

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mount API v1
app.use('/api/v1', apiRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Endpoint tidak ditemukan.' });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).json({ success: false, error: 'Terjadi kesalahan internal server.' });
});
