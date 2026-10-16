import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { RegisterRequestSchema, LoginRequestSchema } from '@resumeforge/shared';

const router = Router();

router.post('/register', validateBody(RegisterRequestSchema), (req, res, next) =>
  authController.register(req, res, next)
);

router.post('/login', validateBody(LoginRequestSchema), (req, res, next) =>
  authController.login(req, res, next)
);

router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));

router.post('/logout', (req, res, next) => authController.logout(req, res, next));

router.get('/me', authenticate, (req, res, next) => authController.getMe(req, res, next));

export default router;
