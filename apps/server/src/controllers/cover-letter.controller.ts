import { Request, Response, NextFunction } from 'express';
import { coverLetterService } from '../services/cover-letter.service';

export class CoverLetterController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const letters = await coverLetterService.listCoverLetters(req.user!.userId);
      res.json({ status: 'success', count: letters.length, coverLetters: letters });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const letter = await coverLetterService.getCoverLetter(
        String(req.params.id),
        req.user!.userId
      );
      res.json({ status: 'success', coverLetter: letter });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const letter = await coverLetterService.createCoverLetter(req.user!.userId, req.body);
      res.status(201).json({ status: 'success', coverLetter: letter });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const letter = await coverLetterService.updateCoverLetter(
        String(req.params.id),
        req.user!.userId,
        req.body
      );
      res.json({ status: 'success', coverLetter: letter });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await coverLetterService.deleteCoverLetter(String(req.params.id), req.user!.userId);
      res.json({ status: 'success', message: 'Cover letter deleted' });
    } catch (error) {
      next(error);
    }
  }

  async generateWithAI(req: Request, res: Response, next: NextFunction) {
    try {
      const letter = await coverLetterService.generateWithAI(req.user!.userId, req.body);
      res.json({ status: 'success', coverLetter: letter });
    } catch (error) {
      next(error);
    }
  }
}

export const coverLetterController = new CoverLetterController();
