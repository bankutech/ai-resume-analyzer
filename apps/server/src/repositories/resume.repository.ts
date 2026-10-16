import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

export class ResumeRepository {
  async findByUserId(userId: string, search?: string) {
    const where: Prisma.ResumeWhereInput = {
      userId,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { targetJobTitle: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    return prisma.resume.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        userId: true,
        title: true,
        targetJobTitle: true,
        templateSlug: true,
        lastAtsScore: true,
        isPinned: true,
        isSample: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { versions: true },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.resume.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 15,
        },
        applications: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  async create(data: {
    userId: string;
    title: string;
    targetJobTitle?: string;
    templateSlug?: string;
    document: any;
    lastAtsScore?: number;
    isSample?: boolean;
  }) {
    return prisma.resume.create({
      data: {
        userId: data.userId,
        title: data.title,
        targetJobTitle: data.targetJobTitle,
        templateSlug: data.templateSlug || 'classic-ats',
        document: data.document,
        lastAtsScore: data.lastAtsScore ?? 0,
        isSample: data.isSample ?? false,
        versions: {
          create: {
            userId: data.userId,
            versionNumber: 1,
            label: 'v1.0.0 — Initial Creation',
            documentSnapshot: data.document,
            atsScoreSnapshot: data.lastAtsScore ?? 0,
          },
        },
      },
      include: {
        versions: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      targetJobTitle?: string | null;
      templateSlug?: string;
      document?: any;
      lastAtsScore?: number | null;
      lastAtsReport?: any;
      isPinned?: boolean;
    }
  ) {
    return prisma.resume.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.resume.delete({
      where: { id },
    });
  }

  async createVersion(data: {
    resumeId: string;
    userId: string;
    versionNumber: number;
    label: string;
    documentSnapshot: any;
    atsScoreSnapshot?: number | null;
  }) {
    return prisma.resumeVersion.create({
      data,
    });
  }

  async getVersions(resumeId: string) {
    return prisma.resumeVersion.findMany({
      where: { resumeId },
      orderBy: { versionNumber: 'desc' },
    });
  }

  async getVersionById(versionId: string) {
    return prisma.resumeVersion.findUnique({
      where: { id: versionId },
    });
  }
}

export const resumeRepository = new ResumeRepository();
