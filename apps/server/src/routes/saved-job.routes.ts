import { Router } from 'express';
import { savedJobController } from '../controllers/saved-job.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => savedJobController.list(req, res, next));
router.post('/', (req, res, next) => savedJobController.create(req, res, next));
router.patch('/:id', (req, res, next) => savedJobController.update(req, res, next));
router.delete('/:id', (req, res, next) => savedJobController.delete(req, res, next));

export default router;
