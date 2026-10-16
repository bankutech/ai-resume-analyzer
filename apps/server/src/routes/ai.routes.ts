import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { AtsAuditRequestSchema, AiRewriteBulletRequestSchema } from '@resumeforge/shared';

const router = Router();

router.post(
  '/audit',
  authenticate,
  (req, res, next) => aiController.audit(req, res, next)
);

router.post(
  '/audit-ats',
  authenticate,
  (req, res, next) => aiController.audit(req, res, next)
);

router.post(
  '/improve-bullet',
  authenticate,
  (req, res, next) => aiController.improveBullet(req, res, next)
);

router.post(
  '/enhance-bullet',
  authenticate,
  (req, res, next) => aiController.improveBullet(req, res, next)
);

router.post(
  '/parse-resume',
  authenticate,
  (req, res, next) => aiController.parseResume(req, res, next)
);

router.post(
  '/generate-summary',
  authenticate,
  (req, res, next) => aiController.generateSummary(req, res, next)
);

export default router;
