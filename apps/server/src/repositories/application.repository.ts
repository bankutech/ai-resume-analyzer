import prisma from '../lib/prisma';
import { ApplicationStatus } from '@prisma/client';

export class ApplicationRepository {
  async findByUserId(userId: string, status?: ApplicationStatus, search?: string) {
    const where: any = { userId };
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { company: { contains: search, mode: 'insensitive' } },
        { roleTitle: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    return prisma.jobApplication.findMany({
      where,
      include: {
        resume: {
          select: { id: true, title: true, lastAtsScore: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.jobApplication.findUnique({
      where: { id },
      include: {
        resume: {
          select: { id: true, title: true, lastAtsScore: true },
        },
      },
    });
  }

  async create(userId: string, data: any) {
    return prisma.jobApplication.create({
      data: {
        userId,
        company: data.company,
        roleTitle: data.roleTitle,
        location: data.location || null,
        status: data.status || 'SAVED',
        resumeId: data.resumeId || null,
        jobDescriptionId: data.jobDescriptionId || null,
        jobUrl: data.jobUrl || null,
        salaryRange: data.salaryRange || null,
        appliedDate: data.appliedDate ? new Date(data.appliedDate) : null,
        nextFollowUpDate: data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null,
        notes: data.notes || null,
      },
      include: {
        resume: {
          select: { id: true, title: true, lastAtsScore: true },
        },
      },
    });
  }

  async update(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.appliedDate !== undefined) {
      updateData.appliedDate = data.appliedDate ? new Date(data.appliedDate) : null;
    }
    if (data.nextFollowUpDate !== undefined) {
      updateData.nextFollowUpDate = data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null;
    }

    return prisma.jobApplication.update({
      where: { id },
      data: updateData,
      include: {
        resume: {
          select: { id: true, title: true, lastAtsScore: true },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.jobApplication.delete({
      where: { id },
    });
  }
}

export const applicationRepository = new ApplicationRepository();
