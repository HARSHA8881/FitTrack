import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
    getAllAchievements,
    getUserAchievements,
    getGamificationStats,
    getLeaderboard,
    checkAchievements
} from '../controllers/achievementController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all achievements (locked and unlocked)
router.get('/', getAllAchievements);

// Get user's unlocked achievements
router.get('/user', getUserAchievements);

// Get gamification stats (level, XP, etc.)
router.get('/stats', getGamificationStats);

// Get leaderboard
router.get('/leaderboard', getLeaderboard);

// Manually check achievements (for testing)
router.post('/check', checkAchievements);

export default router;
