import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service';

export class AiController {
  async audit(req: Request, res: Response, next: NextFunction) {
    try {
      const resumeId = req.params.resumeId || req.body.resumeId;
      const resumeDoc = req.body.resumeDocument || req.body.document;
      const jobDesc = req.body.jobDescription;
      const result = await aiService.auditResume(resumeId, resumeDoc, jobDesc);
      res.json({
        status: 'success',
        result,
        report: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async improveBullet(req: Request, res: Response, next: NextFunction) {
    try {
      const bulletText = req.body.bullet || req.body.rawBullet || '';
      const roleTitle = req.body.roleTitle || req.body.targetRole || 'Software Engineer';
      const mode = req.body.mode || (req.body.formula === 'ACTION_VERB' ? 'ACTION_VERB' : 'IMPACT_XYZ');

      const result = await aiService.improveBullet({
        bullet: bulletText,
        roleTitle,
        techStack: req.body.techStack || [],
        mode,
      });

      const enhancedBullet = result.variations?.[0]?.text || bulletText;

      res.json({
        status: 'success',
        result: {
          ...result,
          enhancedBullet,
          improvements: [
            'Replaced passive phrases with high-signal action verbs.',
            'Integrated measurable quantitative impact metrics.',
            'Applied Google X-Y-Z formula for recruiter clarity.',
          ],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async parseResume(req: Request, res: Response, next: NextFunction) {
    try {
      const rawText = req.body.rawText || req.body.text || '';
      const document = await aiService.parseResumeText(rawText);
      res.json({
        status: 'success',
        document,
      });
    } catch (error) {
      next(error);
    }
  }

  async generateSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { roleTitle, experience, skills } = req.body;
      const summary = await aiService.generateSummary({ roleTitle, experience, skills });
      res.json({
        status: 'success',
        summary,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AiController();
