import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
  }

  // Unhandled / system errors
  console.error('[Unhandled Error]', err);

  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};
