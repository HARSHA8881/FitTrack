import express from 'express';
import {
    getWorkouts,
    createWorkout,
    getWorkoutById,
    deleteWorkout,
    updateWorkout
} from '../controllers/workoutController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getWorkouts);
router.post('/', createWorkout);
router.get('/:id', getWorkoutById);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

export default router;
