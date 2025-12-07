import { PrismaClient } from '@prisma/client';
import GamificationService from '../services/gamificationService.js';

const prisma = new PrismaClient();

/**
 * Get all achievements
 */
export const getAllAchievements = async (req, res) => {
    try {
        const userId = req.user.id;

        const [allAchievements, userAchievements] = await Promise.all([
            prisma.achievement.findMany({
                orderBy: [
                    { category: 'asc' },
                    { rarity: 'desc' }
                ]
            }),
            prisma.userAchievement.findMany({
                where: { userId },
                include: { achievement: true }
            })
        ]);

        const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));

        const achievements = allAchievements.map(achievement => ({
            ...achievement,
            unlocked: unlockedIds.has(achievement.id),
            unlockedAt: userAchievements.find(ua => ua.achievementId === achievement.id)?.unlockedAt || null
        }));

        res.json({
            achievements,
            totalAchievements: allAchievements.length,
            unlockedCount: userAchievements.length,
            progress: ((userAchievements.length / allAchievements.length) * 100).toFixed(1)
        });
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({ message: 'Error fetching achievements' });
    }
};

/**
 * Get user's unlocked achievements
 */
export const getUserAchievements = async (req, res) => {
    try {
        const userId = req.user.id;

        const userAchievements = await prisma.userAchievement.findMany({
            where: { userId },
            include: { achievement: true },
            orderBy: { unlockedAt: 'desc' }
        });

        res.json(userAchievements);
    } catch (error) {
        console.error('Get user achievements error:', error);
        res.status(500).json({ message: 'Error fetching user achievements' });
    }
};

/**
 * Get gamification stats (level, XP, leaderboard position)
 */
export const getGamificationStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const stats = await GamificationService.getUserStats(userId);

        res.json(stats);
    } catch (error) {
        console.error('Get gamification stats error:', error);
        res.status(500).json({ message: 'Error fetching gamification stats' });
    }
};

/**
 * Get leaderboard
 */
export const getLeaderboard = async (req, res) => {
    try {
        const { timeframe = 'all', limit = 100 } = req.query;

        const leaderboard = await GamificationService.getLeaderboard(timeframe, parseInt(limit));

        // Find current user's position
        const userId = req.user.id;
        const userPosition = leaderboard.findIndex(user => user.id === userId);

        res.json({
            leaderboard,
            userPosition: userPosition >= 0 ? userPosition + 1 : null
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
};

/**
 * Manually trigger achievement check (for testing)
 */
export const checkAchievements = async (req, res) => {
    try {
        const userId = req.user.id;

        const newAchievements = await GamificationService.checkAchievements(userId);

        res.json({
            message: 'Achievements checked',
            newAchievements
        });
    } catch (error) {
        console.error('Check achievements error:', error);
        res.status(500).json({ message: 'Error checking achievements' });
    }
};
