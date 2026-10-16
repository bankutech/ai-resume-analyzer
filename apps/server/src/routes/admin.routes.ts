import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(requireRole('ADMIN'));

router.get('/metrics', (req, res, next) => adminController.getMetrics(req, res, next));

export default router;
