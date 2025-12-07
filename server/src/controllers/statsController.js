import { PrismaClient } from '@prisma/client';
import AnalyticsService from '../services/analyticsService.js';

const prisma = new PrismaClient();

/**
 * Get comprehensive user statistics
 */
export const getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await AnalyticsService.getUserStats(userId);
        res.json(stats);
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
};

/**
 * Get workout heatmap data
 */
export const getHeatmap = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year } = req.query;

        const heatmapData = await AnalyticsService.getWorkoutHeatmap(
            userId,
            year ? parseInt(year) : undefined
        );

        res.json(heatmapData);
    } catch (error) {
        console.error('Get heatmap error:', error);
        res.status(500).json({ message: 'Error fetching heatmap data' });
    }
};

/**
 * Get progress data for charts
 */
export const getProgressData = async (req, res) => {
    try {
        const userId = req.user.id;
        const { exerciseId, timeframe = '30d' } = req.query;

        const progressData = await AnalyticsService.getProgressData(
            userId,
            exerciseId ? parseInt(exerciseId) : null,
            timeframe
        );

        res.json(progressData);
    } catch (error) {
        console.error('Get progress data error:', error);
        res.status(500).json({ message: 'Error fetching progress data' });
    }
};

/**
 * Get exercise distribution
 */
export const getExerciseDistribution = async (req, res) => {
    try {
        const userId = req.user.id;
        const { timeframe = '30d' } = req.query;

        const distribution = await AnalyticsService.getExerciseDistribution(userId, timeframe);

        res.json(distribution);
    } catch (error) {
        console.error('Get exercise distribution error:', error);
        res.status(500).json({ message: 'Error fetching exercise distribution' });
    }
};

/**
 * Get muscle group distribution
 */
export const getMuscleGroupDistribution = async (req, res) => {
    try {
        const userId = req.user.id;
        const { timeframe = '30d' } = req.query;

        const distribution = await AnalyticsService.getMuscleGroupDistribution(userId, timeframe);

        res.json(distribution);
    } catch (error) {
        console.error('Get muscle group distribution error:', error);
        res.status(500).json({ message: 'Error fetching muscle group distribution' });
    }
};

/**
 * Get personal records
 */
export const getPersonalRecords = async (req, res) => {
    try {
        const userId = req.user.id;
        const { exerciseId } = req.query;

        const records = await AnalyticsService.getPersonalRecords(
            userId,
            exerciseId ? parseInt(exerciseId) : null
        );

        res.json(records);
    } catch (error) {
        console.error('Get personal records error:', error);
        res.status(500).json({ message: 'Error fetching personal records' });
    }
};

/**
 * Get volume over time
 */
export const getVolumeOverTime = async (req, res) => {
    try {
        const userId = req.user.id;
        const { timeframe = '30d' } = req.query;

        const volumeData = await AnalyticsService.getVolumeOverTime(userId, timeframe);

        res.json(volumeData);
    } catch (error) {
        console.error('Get volume over time error:', error);
        res.status(500).json({ message: 'Error fetching volume data' });
    }
};

/**
 * Get consistency score
 */
export const getConsistencyScore = async (req, res) => {
    try {
        const userId = req.user.id;
        const { timeframe = '30d' } = req.query;

        const consistency = await AnalyticsService.getConsistencyScore(userId, timeframe);

        res.json(consistency);
    } catch (error) {
        console.error('Get consistency score error:', error);
        res.status(500).json({ message: 'Error fetching consistency score' });
    }
};

