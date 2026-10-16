import { Router } from 'express';
import { coverLetterController } from '../controllers/cover-letter.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => coverLetterController.list(req, res, next));
router.post('/generate', (req, res, next) => coverLetterController.generateWithAI(req, res, next));
router.get('/:id', (req, res, next) => coverLetterController.getById(req, res, next));
router.post('/', (req, res, next) => coverLetterController.create(req, res, next));
router.put('/:id', (req, res, next) => coverLetterController.update(req, res, next));
router.delete('/:id', (req, res, next) => coverLetterController.delete(req, res, next));

export default router;
