import { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profile.service';

export class ProfileController {
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.getProfile(req.user!.userId);
      res.json({
        status: 'success',
        profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.upsertProfile(req.user!.userId, req.body);
      res.json({
        status: 'success',
        profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await profileService.changePassword(
        req.user!.userId,
        currentPassword,
        newPassword
      );
      res.json({
        status: 'success',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const profileController = new ProfileController();
