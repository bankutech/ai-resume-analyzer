import { applicationRepository, ApplicationRepository } from '../repositories/application.repository';
import { AppError } from '../lib/errors';
import { ApplicationStatus } from '@prisma/client';

export class ApplicationService {
  constructor(private appRepo: ApplicationRepository = applicationRepository) {}

  async listApplications(userId: string, status?: ApplicationStatus, search?: string) {
    return this.appRepo.findByUserId(userId, status, search);
  }

  async getApplication(id: string, userId: string, role: string) {
    const app = await this.appRepo.findById(id);
    if (!app) {
      throw AppError.notFound('Job application not found');
    }
    if (app.userId !== userId && role !== 'ADMIN') {
      throw AppError.forbidden('Access denied');
    }
    return app;
  }

  async createApplication(userId: string, data: any) {
    return this.appRepo.create(userId, data);
  }

  async updateApplication(id: string, userId: string, role: string, data: any) {
    await this.getApplication(id, userId, role);
    return this.appRepo.update(id, data);
  }

  async updateStatus(id: string, userId: string, role: string, status: ApplicationStatus) {
    await this.getApplication(id, userId, role);
    return this.appRepo.update(id, { status });
  }

  async deleteApplication(id: string, userId: string, role: string) {
    await this.getApplication(id, userId, role);
    return this.appRepo.delete(id);
  }
}

export const applicationService = new ApplicationService();
