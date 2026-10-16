import { Request, Response, NextFunction } from 'express';
import { resumeService } from '../services/resume.service';

export class ResumeController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const resumes = await resumeService.listResumes(req.user!.userId, search);
      res.json({
        status: 'success',
        count: resumes.length,
        resumes,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const resume = await resumeService.getResume(id, req.user!.userId, req.user!.role);
      res.json({
        status: 'success',
        resume,
      });
    } catch (error) {
      next(error);
    }
  }

  async getForPrint(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const resume = await resumeService.getResumeForPrint(id);
      res.json({
        status: 'success',
        resume,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const resume = await resumeService.createResume(req.user!.userId, req.body);
      res.status(201).json({
        status: 'success',
        resume,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const resume = await resumeService.updateResume(
        id,
        req.user!.userId,
        req.user!.role,
        req.body
      );
      res.json({
        status: 'success',
        resume,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      await resumeService.deleteResume(id, req.user!.userId, req.user!.role);
      res.json({
        status: 'success',
        message: 'Resume deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async duplicate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const resume = await resumeService.duplicateResume(
        id,
        req.user!.userId,
        req.user!.role
      );
      res.status(201).json({
        status: 'success',
        resume,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = String(req.params.slug);
      const resume = await resumeService.getPublicResume(slug);
      res.json({
        status: 'success',
        resume,
      });
    } catch (error) {
      next(error);
    }
  }

  async listVersions(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const versions = await resumeService.listVersions(
        id,
        req.user!.userId,
        req.user!.role
      );
      res.json({
        status: 'success',
        count: versions.length,
        versions,
      });
    } catch (error) {
      next(error);
    }
  }

  async createSnapshot(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const { versionName } = req.body;
      const snapshot = await resumeService.createSnapshot(
        id,
        req.user!.userId,
        req.user!.role,
        versionName
      );
      res.status(201).json({
        status: 'success',
        snapshot,
      });
    } catch (error) {
      next(error);
    }
  }

  async restoreSnapshot(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const versionId = String(req.params.versionId);
      const resume = await resumeService.restoreSnapshot(
        id,
        versionId,
        req.user!.userId,
        req.user!.role
      );
      res.json({
        status: 'success',
        message: 'Resume restored to specified version snapshot',
        resume,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const resumeController = new ResumeController();
