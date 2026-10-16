import prisma from '../lib/prisma';
import { AppError } from '../lib/errors';

export interface CreateSavedJobDto {
  company: string;
  roleTitle: string;
  location?: string | null;
  jobUrl?: string | null;
  rawSnippet?: string | null;
  tags?: string[];
  priority?: number;
}

export interface UpdateSavedJobDto {
  company?: string;
  roleTitle?: string;
  location?: string | null;
  jobUrl?: string | null;
  rawSnippet?: string | null;
  tags?: string[];
  priority?: number;
}

export class SavedJobService {
  async listSavedJobs(userId: string, search?: string) {
    const trimmed = search?.trim();
    return prisma.savedJob.findMany({
      where: {
        userId,
        ...(trimmed
          ? {
              OR: [
                { company: { contains: trimmed, mode: 'insensitive' } },
                { roleTitle: { contains: trimmed, mode: 'insensitive' } },
                { location: { contains: trimmed, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async getSavedJob(id: string, userId: string) {
    const job = await prisma.savedJob.findUnique({
      where: { id },
    });

    if (!job) {
      throw AppError.notFound('Saved job not found');
    }
    if (job.userId !== userId) {
      throw AppError.forbidden('Access denied');
    }

    return job;
  }

  async createSavedJob(userId: string, data: CreateSavedJobDto) {
    if (!data.company || !data.company.trim()) {
      throw AppError.badRequest('Company name is required');
    }
    if (!data.roleTitle || !data.roleTitle.trim()) {
      throw AppError.badRequest('Role title is required');
    }

    let priority = 2;
    if (typeof data.priority === 'number') {
      priority = Math.min(3, Math.max(1, Math.round(data.priority)));
    }

    return prisma.savedJob.create({
      data: {
        userId,
        company: data.company.trim(),
        roleTitle: data.roleTitle.trim(),
        location: data.location?.trim() || null,
        jobUrl: data.jobUrl?.trim() || null,
        rawSnippet: data.rawSnippet || null,
        tags: Array.isArray(data.tags) ? data.tags.map((t) => t.trim()).filter(Boolean) : [],
        priority,
      },
    });
  }

  async updateSavedJob(id: string, userId: string, data: UpdateSavedJobDto) {
    const job = await this.getSavedJob(id, userId);

    let priority = job.priority;
    if (typeof data.priority === 'number') {
      priority = Math.min(3, Math.max(1, Math.round(data.priority)));
    }

    return prisma.savedJob.update({
      where: { id: job.id },
      data: {
        ...(data.company !== undefined && { company: data.company.trim() }),
        ...(data.roleTitle !== undefined && { roleTitle: data.roleTitle.trim() }),
        ...(data.location !== undefined && { location: data.location ? data.location.trim() : null }),
        ...(data.jobUrl !== undefined && { jobUrl: data.jobUrl ? data.jobUrl.trim() : null }),
        ...(data.rawSnippet !== undefined && { rawSnippet: data.rawSnippet }),
        ...(data.tags !== undefined && {
          tags: Array.isArray(data.tags) ? data.tags.map((t) => t.trim()).filter(Boolean) : [],
        }),
        ...(data.priority !== undefined && { priority }),
      },
    });
  }

  async deleteSavedJob(id: string, userId: string) {
    const job = await this.getSavedJob(id, userId);

    return prisma.savedJob.delete({
      where: { id: job.id },
    });
  }
}

export const savedJobService = new SavedJobService();
