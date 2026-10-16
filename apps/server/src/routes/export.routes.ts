import { Router } from 'express';
import { exportController } from '../controllers/export.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/:id/docx', optionalAuth, (req, res, next) =>
  exportController.exportDocx(req, res, next)
);

router.get('/docx/:id', optionalAuth, (req, res, next) =>
  exportController.exportDocx(req, res, next)
);

router.get('/:id/pdf', optionalAuth, (req, res, next) =>
  exportController.exportPdf(req, res, next)
);

router.get('/pdf/:id', optionalAuth, (req, res, next) =>
  exportController.exportPdf(req, res, next)
);

export default router;
