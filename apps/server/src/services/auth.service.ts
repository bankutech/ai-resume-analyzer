import bcrypt from 'bcryptjs';
import { userRepository, UserRepository } from '../repositories/user.repository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { AppError } from '../lib/errors';
import { SignupRequest, LoginRequest } from '@resumeforge/shared';
import { UserRole } from '@prisma/client';

export class AuthService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async register(data: SignupRequest) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw AppError.conflict('An account with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await this.userRepo.create({
      email: data.email,
      name: data.name,
      passwordHash,
      role: UserRole.USER,
    });

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.userRepo.saveRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.profile?.fullName || '',
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginRequest) {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.userRepo.saveRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.profile?.fullName || '',
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(currentToken: string) {
    try {
      const payload = verifyRefreshToken(currentToken);
      const tokenRecord = await this.userRepo.findRefreshToken(currentToken);

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        if (tokenRecord) {
          await this.userRepo.deleteRefreshToken(currentToken);
        }
        throw AppError.unauthorized('Refresh token is invalid or expired');
      }

      await this.userRepo.deleteRefreshToken(currentToken);

      const newPayload = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      const newAccessToken = signAccessToken(newPayload);
      const newRefreshToken = signRefreshToken(newPayload);

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await this.userRepo.saveRefreshToken({
        userId: payload.userId,
        token: newRefreshToken,
        expiresAt,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: tokenRecord.user.id,
          email: tokenRecord.user.email,
          name: tokenRecord.user.profile?.fullName || '',
          role: tokenRecord.user.role,
        },
      };
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw AppError.unauthorized('Invalid refresh token');
    }
  }

  async logout(refreshToken?: string, userId?: string) {
    if (refreshToken) {
      await this.userRepo.deleteRefreshToken(refreshToken);
    } else if (userId) {
      await this.userRepo.deleteAllUserRefreshTokens(userId);
    }
  }

  async getMe(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.profile?.fullName || '',
      role: user.role,
      onboardingCompleted: user.onboardingCompleted,
      isSuspended: user.isSuspended,
      profile: user.profile,
    };
  }
}

export const authService = new AuthService();
