import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../lib/errors';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        }));
        return next(AppError.badRequest('Validation failed', issues));
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        }));
        return next(AppError.badRequest('Invalid query parameters', issues));
      }
      next(error);
    }
  };
};
