import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../lib/jwt';
import { AppError } from '../lib/errors';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.rf_access_token) {
      token = req.cookies.rf_access_token;
    }

    if (!token) {
      return next(AppError.unauthorized('Authentication token missing or invalid'));
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Access token expired', 401));
    }
    return next(AppError.unauthorized('Invalid access token'));
  }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.rf_access_token) {
      token = req.cookies.rf_access_token;
    }

    if (token) {
      const payload = verifyAccessToken(token);
      req.user = payload;
    }
    next();
  } catch {
    next();
  }
};

export const requireRole = (...roles: Array<'USER' | 'ADMIN'>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden(`Role '${req.user.role}' is not authorized for this action`));
    }
    next();
  };
};
