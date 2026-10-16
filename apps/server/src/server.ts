import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Mount API routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`[myRmyC Server] listening on http://localhost:${port}`);
    console.log(`[myRmyC Server] Connected to Neon PostgreSQL (branch: ${process.env.NEON_BRANCH || 'production'})`);
  });
}

export default app;
