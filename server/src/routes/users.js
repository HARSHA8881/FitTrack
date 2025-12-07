import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
    getProfile,
    updateProfile,
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    getBodyMetrics,
    createBodyMetric,
    updateBodyMetric,
    deleteBodyMetric
} from '../controllers/userController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Goals routes
router.get('/goals', getGoals);
router.post('/goals', createGoal);
router.put('/goals/:id', updateGoal);
router.delete('/goals/:id', deleteGoal);

// Body metrics routes
router.get('/body-metrics', getBodyMetrics);
router.post('/body-metrics', createBodyMetric);
router.put('/body-metrics/:id', updateBodyMetric);
router.delete('/body-metrics/:id', deleteBodyMetric);

export default router;
