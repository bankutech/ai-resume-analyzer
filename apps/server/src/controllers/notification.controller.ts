import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service';

export class NotificationController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await notificationService.listNotifications(req.user!.userId);
      const unreadCount = await notificationService.getUnreadCount(req.user!.userId);
      res.json({
        status: 'success',
        count: notifications.length,
        unreadCount,
        notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.markAsRead(
        String(req.params.id),
        req.user!.userId
      );
      res.json({
        status: 'success',
        notification,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.markAllAsRead(req.user!.userId);
      res.json({
        status: 'success',
        message: 'All notifications marked as read',
        updatedCount: result.count,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await notificationService.deleteNotification(String(req.params.id), req.user!.userId);
      res.json({
        status: 'success',
        message: 'Notification deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
