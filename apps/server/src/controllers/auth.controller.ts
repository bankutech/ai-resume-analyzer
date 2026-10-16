import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

const REFRESH_COOKIE_NAME = 'rf_refresh_token';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, cookieOptions);

      res.status(201).json({
        status: 'success',
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, cookieOptions);

      res.json({
        status: 'success',
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies[REFRESH_COOKIE_NAME] || req.body.refreshToken;
      if (!token) {
        return res.status(401).json({ status: 'error', message: 'Refresh token missing' });
      }

      const result = await authService.refreshToken(token);
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, cookieOptions);

      res.json({
        status: 'success',
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies[REFRESH_COOKIE_NAME];
      await authService.logout(token, req.user?.userId);

      res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });
      res.json({
        status: 'success',
        message: 'Successfully logged out',
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.userId);
      res.json({
        status: 'success',
        user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
