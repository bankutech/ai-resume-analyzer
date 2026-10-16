import { Request, Response, NextFunction } from 'express';
import { exportService } from '../services/export.service';
import { resumeRepository } from '../repositories/resume.repository';
import { AppError } from '../lib/errors';
import { ResumeDocument } from '@resumeforge/shared';

export class ExportController {
  async exportDocx(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const resume = await resumeRepository.findById(id);

      if (!resume) {
        throw AppError.notFound('Resume not found');
      }

      // Check access permission
      if (resume.userId !== req.user?.userId && req.user?.role !== 'ADMIN' && !resume.isSample) {
        throw AppError.forbidden('You do not have permission to export this resume');
      }

      const buffer = await exportService.generateDocx(resume.document as unknown as ResumeDocument);

      const filename = `${resume.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.docx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  async exportPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const resume = await resumeRepository.findById(id);

      if (!resume) {
        throw AppError.notFound('Resume not found');
      }

      if (resume.userId !== req.user?.userId && req.user?.role !== 'ADMIN' && !resume.isSample) {
        throw AppError.forbidden('You do not have permission to export this resume');
      }

      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const buffer = await exportService.generatePdf(id, clientUrl);

      const filename = `${resume.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }
}

export const exportController = new ExportController();
