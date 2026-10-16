import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => notificationController.list(req, res, next));
router.patch('/read-all', (req, res, next) => notificationController.markAllAsRead(req, res, next));
router.patch('/:id/read', (req, res, next) => notificationController.markAsRead(req, res, next));
router.delete('/:id', (req, res, next) => notificationController.delete(req, res, next));

export default router;
