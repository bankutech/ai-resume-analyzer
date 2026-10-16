import prisma from '../lib/prisma';
import { UserRole } from '@prisma/client';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        onboardingCompleted: true,
        isSuspended: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });
  }

  async create(data: { email: string; name: string; passwordHash: string; role?: UserRole }) {
    return prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        role: data.role || UserRole.USER,
        profile: {
          create: {
            fullName: data.name,
            targetRoles: [],
            masterData: {},
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        onboardingCompleted: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });
  }

  async saveRefreshToken(data: { userId: string; token: string; expiresAt: Date }) {
    return prisma.refreshToken.create({
      data,
    });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: true,
          },
        },
      },
    });
  }

  async deleteRefreshToken(token: string) {
    return prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  async deleteAllUserRefreshTokens(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}

export const userRepository = new UserRepository();
