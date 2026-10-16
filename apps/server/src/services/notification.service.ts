import prisma from '../lib/prisma';
import { AppError } from '../lib/errors';

export class NotificationService {
  async listNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw AppError.notFound('Notification not found');
    }
    if (notification.userId !== userId) {
      throw AppError.forbidden('Access denied');
    }

    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { count: result.count };
  }

  async deleteNotification(id: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw AppError.notFound('Notification not found');
    }
    if (notification.userId !== userId) {
      throw AppError.forbidden('Access denied');
    }

    return prisma.notification.delete({
      where: { id },
    });
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async createNotification(
    userId: string,
    data: {
      title: string;
      message: string;
      type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'SYSTEM';
      actionUrl?: string | null;
    }
  ) {
    return prisma.notification.create({
      data: {
        userId,
        title: data.title,
        message: data.message,
        type: data.type || 'INFO',
        actionUrl: data.actionUrl || null,
      },
    });
  }
}

export const notificationService = new NotificationService();
