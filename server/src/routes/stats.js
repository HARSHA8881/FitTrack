import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
    getStats,
    getHeatmap,
    getProgressData,
    getExerciseDistribution,
    getMuscleGroupDistribution,
    getPersonalRecords,
    getVolumeOverTime,
    getConsistencyScore
} from '../controllers/statsController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get comprehensive stats
router.get('/', getStats);

// Get workout heatmap data
router.get('/heatmap', getHeatmap);

// Get progress data for charts
router.get('/progress', getProgressData);

// Get exercise distribution (pie chart)
router.get('/distribution/exercises', getExerciseDistribution);

// Get muscle group distribution
router.get('/distribution/muscles', getMuscleGroupDistribution);

// Get personal records
router.get('/records', getPersonalRecords);

// Get volume over time
router.get('/volume', getVolumeOverTime);

// Get consistency score
router.get('/consistency', getConsistencyScore);

export default router;

