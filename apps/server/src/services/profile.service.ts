import prisma from '../lib/prisma';
import { AppError } from '../lib/errors';
import { ExperienceLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface UpsertProfileDto {
  fullName?: string;
  headline?: string;
  summary?: string;
  phoneNumber?: string;
  location?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  targetRoles?: string[];
  experienceLevel?: string;
}

function normalizeExperienceLevel(level?: string): ExperienceLevel {
  if (!level) return ExperienceLevel.STUDENT;
  const upper = level.toUpperCase().replace('-', '_').replace(/\s+/g, '_');
  if (upper in ExperienceLevel) {
    return upper as ExperienceLevel;
  }
  if (upper.includes('MID') || upper.includes('SENIOR')) return ExperienceLevel.MID_SENIOR;
  if (upper.includes('FRESH')) return ExperienceLevel.FRESHER;
  if (upper.includes('JUNIOR')) return ExperienceLevel.JUNIOR;
  if (upper.includes('EXEC')) return ExperienceLevel.EXECUTIVE;
  return ExperienceLevel.STUDENT;
}

function formatProfile(profile: any) {
  const masterData = (profile.masterData as Record<string, any>) || {};
  const basics = masterData.basics || {};

  let summaryText = '';
  if (typeof masterData.summary === 'string') {
    summaryText = masterData.summary;
  } else if (masterData.summary && typeof masterData.summary.content === 'string') {
    summaryText = masterData.summary.content;
  } else if (typeof basics.summary === 'string') {
    summaryText = basics.summary;
  }

  const phone = masterData.phoneNumber || basics.phone || '';

  let github = masterData.githubUrl || '';
  let linkedin = masterData.linkedinUrl || '';
  let website = masterData.websiteUrl || '';

  if (Array.isArray(basics.links)) {
    for (const link of basics.links) {
      if (link.label === 'GitHub' && !github) github = link.url;
      if (link.label === 'LinkedIn' && !linkedin) linkedin = link.url;
      if (link.label === 'Website' && !website) website = link.url;
    }
  }

  return {
    id: profile.id,
    userId: profile.userId,
    fullName: profile.fullName,
    headline: profile.headline || '',
    summary: summaryText,
    phoneNumber: phone,
    location: profile.location || basics.location || '',
    websiteUrl: website,
    linkedinUrl: linkedin,
    githubUrl: github,
    targetRoles: profile.targetRoles || [],
    experienceLevel: profile.experienceLevel,
    email: profile.user?.email || '',
    masterData: profile.masterData,
    updatedAt: profile.updatedAt,
  };
}

export class ProfileService {
  async getProfile(userId: string) {
    let profile = await prisma.careerProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { email: true, id: true, role: true } },
      },
    });

    if (!profile) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user) {
        throw AppError.notFound('User not found');
      }

      const defaultName = user.email.split('@')[0];
      profile = await prisma.careerProfile.create({
        data: {
          userId,
          fullName: defaultName,
          targetRoles: [],
          masterData: {},
        },
        include: {
          user: { select: { email: true, id: true, role: true } },
        },
      });
    }

    return formatProfile(profile);
  }

  async upsertProfile(userId: string, data: UpsertProfileDto) {
    const existing = await prisma.careerProfile.findUnique({
      where: { userId },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    const existingMasterData = (existing?.masterData as Record<string, any>) || {};
    const existingBasics = existingMasterData.basics || {};

    const updatedMasterData = {
      ...existingMasterData,
      summary:
        data.summary !== undefined
          ? data.summary
          : typeof existingMasterData.summary === 'string'
            ? existingMasterData.summary
            : (existingMasterData.summary?.content || ''),
      phoneNumber:
        data.phoneNumber !== undefined
          ? data.phoneNumber
          : (existingMasterData.phoneNumber || existingBasics.phone || ''),
      websiteUrl:
        data.websiteUrl !== undefined ? data.websiteUrl : (existingMasterData.websiteUrl || ''),
      linkedinUrl:
        data.linkedinUrl !== undefined ? data.linkedinUrl : (existingMasterData.linkedinUrl || ''),
      githubUrl:
        data.githubUrl !== undefined ? data.githubUrl : (existingMasterData.githubUrl || ''),
      basics: {
        ...existingBasics,
        fullName: data.fullName ?? existing?.fullName ?? existingBasics.fullName ?? user.email.split('@')[0],
        headline: data.headline ?? existing?.headline ?? existingBasics.headline ?? '',
        phone: data.phoneNumber ?? existingMasterData.phoneNumber ?? existingBasics.phone ?? '',
        location: data.location ?? existing?.location ?? existingBasics.location ?? '',
      },
    };

    const expLevel = data.experienceLevel
      ? normalizeExperienceLevel(data.experienceLevel)
      : (existing?.experienceLevel ?? ExperienceLevel.STUDENT);

    const profile = await prisma.careerProfile.upsert({
      where: { userId },
      update: {
        ...(data.fullName !== undefined && { fullName: data.fullName.trim() }),
        ...(data.headline !== undefined && { headline: data.headline ? data.headline.trim() : null }),
        ...(data.location !== undefined && { location: data.location ? data.location.trim() : null }),
        ...(data.targetRoles !== undefined && { targetRoles: data.targetRoles }),
        experienceLevel: expLevel,
        masterData: updatedMasterData,
      },
      create: {
        userId,
        fullName: data.fullName?.trim() || user.email.split('@')[0] || 'User',
        headline: data.headline?.trim() || null,
        location: data.location?.trim() || null,
        targetRoles: data.targetRoles || [],
        experienceLevel: expLevel,
        masterData: updatedMasterData,
      },
      include: {
        user: { select: { email: true, id: true, role: true } },
      },
    });

    return formatProfile(profile);
  }

  async changePassword(userId: string, currentPassword?: string, newPassword?: string) {
    if (!currentPassword || !newPassword) {
      throw AppError.badRequest('Current password and new password are required');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw AppError.badRequest('Current password is incorrect');
    }

    if (newPassword.length < 8) {
      throw AppError.badRequest('New password must be at least 8 characters');
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { message: 'Password updated successfully' };
  }
}

export const profileService = new ProfileService();
