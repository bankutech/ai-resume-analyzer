import { Router } from 'express';
import { resumeController } from '../controllers/resume.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public route for shared resumes & headless puppeteer export
router.get('/public/:slug', (req, res, next) => resumeController.getPublic(req, res, next));
router.get('/print-payload/:id', (req, res, next) => resumeController.getForPrint(req, res, next));

// Authenticated CRUD & Management
router.get('/', authenticate, (req, res, next) => resumeController.list(req, res, next));
router.post('/', authenticate, (req, res, next) => resumeController.create(req, res, next));
router.get('/:id', authenticate, (req, res, next) => resumeController.getById(req, res, next));
router.put('/:id', authenticate, (req, res, next) => resumeController.update(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => resumeController.delete(req, res, next));
router.post('/:id/duplicate', authenticate, (req, res, next) =>
  resumeController.duplicate(req, res, next)
);

// Version history & snapshots
router.get('/:id/versions', authenticate, (req, res, next) =>
  resumeController.listVersions(req, res, next)
);
router.post('/:id/versions', authenticate, (req, res, next) =>
  resumeController.createSnapshot(req, res, next)
);
router.post('/:id/versions/:versionId/restore', authenticate, (req, res, next) =>
  resumeController.restoreSnapshot(req, res, next)
);

export default router;
