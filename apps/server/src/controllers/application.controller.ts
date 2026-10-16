import { Request, Response, NextFunction } from 'express';
import { applicationService } from '../services/application.service';
import { ApplicationStatus } from '@prisma/client';

export class ApplicationController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const status = typeof req.query.status === 'string' ? (req.query.status as ApplicationStatus) : undefined;
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const applications = await applicationService.listApplications(req.user!.userId, status, search);
      res.json({
        status: 'success',
        count: applications.length,
        applications,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const application = await applicationService.getApplication(id, req.user!.userId, req.user!.role);
      res.json({
        status: 'success',
        application,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await applicationService.createApplication(req.user!.userId, req.body);
      res.status(201).json({
        status: 'success',
        application,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const application = await applicationService.updateApplication(
        id,
        req.user!.userId,
        req.user!.role,
        req.body
      );
      res.json({
        status: 'success',
        application,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      const application = await applicationService.updateStatus(
        id,
        req.user!.userId,
        req.user!.role,
        status as ApplicationStatus
      );
      res.json({
        status: 'success',
        application,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      await applicationService.deleteApplication(id, req.user!.userId, req.user!.role);
      res.json({
        status: 'success',
        message: 'Application deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const applicationController = new ApplicationController();
