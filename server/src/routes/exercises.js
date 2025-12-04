import express from 'express';
import { getExercises, createExercise } from '../controllers/exerciseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getExercises);
router.post('/', createExercise);

export default router;
