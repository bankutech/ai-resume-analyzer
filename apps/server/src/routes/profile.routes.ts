import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/me', (req, res, next) => profileController.getMe(req, res, next));
router.put('/me', (req, res, next) => profileController.updateMe(req, res, next));
router.post('/change-password', (req, res, next) => profileController.changePassword(req, res, next));

export default router;
