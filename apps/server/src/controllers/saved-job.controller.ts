import { Request, Response, NextFunction } from 'express';
import { savedJobService } from '../services/saved-job.service';

export class SavedJobController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const search =
        typeof req.query.search === 'string' ? req.query.search : undefined;
      const jobs = await savedJobService.listSavedJobs(req.user!.userId, search);
      res.json({ status: 'success', count: jobs.length, savedJobs: jobs });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await savedJobService.createSavedJob(req.user!.userId, req.body);
      res.status(201).json({ status: 'success', savedJob: job });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await savedJobService.updateSavedJob(
        String(req.params.id),
        req.user!.userId,
        req.body
      );
      res.json({ status: 'success', savedJob: job });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await savedJobService.deleteSavedJob(String(req.params.id), req.user!.userId);
      res.json({ status: 'success', message: 'Saved job deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export const savedJobController = new SavedJobController();
