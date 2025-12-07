import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Analytics Service
 * Provides advanced statistics and insights
 */
class AnalyticsService {

    /**
     * Get comprehensive user statistics
     */
    static async getUserStats(userId) {
        try {
            const [
                totalWorkouts,
                workoutsThisWeek,
                workoutsThisMonth,
                personalRecords,
                user,
                recentWorkouts
            ] = await Promise.all([
                prisma.workout.count({ where: { userId } }),
                this.getWorkoutsThisWeek(userId),
                this.getWorkoutsThisMonth(userId),
                prisma.personalRecord.count({ where: { userId } }),
                prisma.user.findUnique({ where: { id: userId } }),
                prisma.workout.findMany({
                    where: { userId },
                    orderBy: { workoutDate: 'desc' },
                    take: 10,
                    include: { exercise: true }
                })
            ]);

            return {
                totalWorkouts,
                workoutsThisWeek,
                workoutsThisMonth,
                personalRecords,
                currentStreak: user?.currentStreak || 0,
                longestStreak: user?.longestStreak || 0,
                level: user?.level || 1,
                xp: user?.xp || 0,
                recentWorkouts
            };
        } catch (error) {
            console.error('Get user stats error:', error);
            throw error;
        }
    }

    /**
     * Get workouts for current week
     */
    static async getWorkoutsThisWeek(userId) {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        return await prisma.workout.count({
            where: {
                userId,
                workoutDate: {
                    gte: startOfWeek
                }
            }
        });
    }

    /**
     * Get workouts for current month
     */
    static async getWorkoutsThisMonth(userId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return await prisma.workout.count({
            where: {
                userId,
                workoutDate: {
                    gte: startOfMonth
                }
            }
        });
    }

    /**
     * Get workout frequency data for heatmap calendar
     */
    static async getWorkoutHeatmap(userId, year = new Date().getFullYear()) {
        try {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);

            const workouts = await prisma.workout.findMany({
                where: {
                    userId,
                    workoutDate: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                select: {
                    workoutDate: true,
                    duration: true,
                    calories: true
                }
            });

            // Group by date
            const heatmapData = {};
            workouts.forEach(workout => {
                const date = workout.workoutDate.toISOString().split('T')[0];
                if (!heatmapData[date]) {
                    heatmapData[date] = {
                        count: 0,
                        totalDuration: 0,
                        totalCalories: 0
                    };
                }
                heatmapData[date].count++;
                heatmapData[date].totalDuration += workout.duration || 0;
                heatmapData[date].totalCalories += workout.calories || 0;
            });

            return heatmapData;
        } catch (error) {
            console.error('Get workout heatmap error:', error);
            throw error;
        }
    }

    /**
     * Get progress data for charts
     */
    static async getProgressData(userId, exerciseId = null, timeframe = '30d') {
        try {
            const days = parseInt(timeframe);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const where = {
                userId,
                workoutDate: { gte: startDate }
            };

            if (exerciseId) {
                where.exerciseId = exerciseId;
            }

            const workouts = await prisma.workout.findMany({
                where,
                orderBy: { workoutDate: 'asc' },
                include: { exercise: true }
            });

            // Group by exercise and date
            const progressByExercise = {};

            workouts.forEach(workout => {
                const exerciseName = workout.exercise.name;
                const date = workout.workoutDate.toISOString().split('T')[0];

                if (!progressByExercise[exerciseName]) {
                    progressByExercise[exerciseName] = [];
                }

                progressByExercise[exerciseName].push({
                    date,
                    weight: workout.weight,
                    reps: workout.reps,
                    sets: workout.sets,
                    duration: workout.duration,
                    volume: workout.weight && workout.reps ? workout.weight * workout.reps * (workout.sets || 1) : null
                });
            });

            return progressByExercise;
        } catch (error) {
            console.error('Get progress data error:', error);
            throw error;
        }
    }

    /**
     * Get exercise distribution (pie chart data)
     */
    static async getExerciseDistribution(userId, timeframe = '30d') {
        try {
            const days = parseInt(timeframe);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const workouts = await prisma.workout.findMany({
                where: {
                    userId,
                    workoutDate: { gte: startDate }
                },
                include: { exercise: true }
            });

            // Count by category
            const distribution = {};
            workouts.forEach(workout => {
                const category = workout.exercise.category;
                distribution[category] = (distribution[category] || 0) + 1;
            });

            return Object.entries(distribution).map(([category, count]) => ({
                category,
                count,
                percentage: (count / workouts.length * 100).toFixed(1)
            }));
        } catch (error) {
            console.error('Get exercise distribution error:', error);
            throw error;
        }
    }

    /**
     * Get muscle group distribution
     */
    static async getMuscleGroupDistribution(userId, timeframe = '30d') {
        try {
            const days = parseInt(timeframe);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const workouts = await prisma.workout.findMany({
                where: {
                    userId,
                    workoutDate: { gte: startDate }
                },
                include: { exercise: true }
            });

            // Count by muscle group
            const distribution = {};
            workouts.forEach(workout => {
                const muscleGroup = workout.exercise.muscleGroup || 'Other';
                distribution[muscleGroup] = (distribution[muscleGroup] || 0) + 1;
            });

            return Object.entries(distribution).map(([muscleGroup, count]) => ({
                muscleGroup,
                count,
                percentage: (count / workouts.length * 100).toFixed(1)
            }));
        } catch (error) {
            console.error('Get muscle group distribution error:', error);
            throw error;
        }
    }

    /**
     * Get personal records for user
     */
    static async getPersonalRecords(userId, exerciseId = null) {
        try {
            const where = { userId };
            if (exerciseId) {
                where.exerciseId = exerciseId;
            }

            const records = await prisma.personalRecord.findMany({
                where,
                include: { exercise: true },
                orderBy: { achievedAt: 'desc' }
            });

            return records;
        } catch (error) {
            console.error('Get personal records error:', error);
            throw error;
        }
    }

    /**
     * Check and update personal records
     */
    static async checkPersonalRecord(userId, exerciseId, workout) {
        try {
            const recordsToCheck = [];

            // Max weight
            if (workout.weight) {
                recordsToCheck.push({
                    recordType: 'max_weight',
                    value: workout.weight,
                    unit: 'kg'
                });
            }

            // Max reps
            if (workout.reps) {
                recordsToCheck.push({
                    recordType: 'max_reps',
                    value: workout.reps,
                    unit: 'reps'
                });
            }

            // Max distance
            if (workout.distance) {
                recordsToCheck.push({
                    recordType: 'max_distance',
                    value: workout.distance,
                    unit: 'km'
                });
            }

            // Fastest time (for cardio)
            if (workout.duration && workout.distance) {
                recordsToCheck.push({
                    recordType: 'fastest_time',
                    value: workout.duration,
                    unit: 'minutes'
                });
            }

            const newRecords = [];

            for (const record of recordsToCheck) {
                const existingRecord = await prisma.personalRecord.findUnique({
                    where: {
                        userId_exerciseId_recordType: {
                            userId,
                            exerciseId,
                            recordType: record.recordType
                        }
                    }
                });

                let isNewRecord = false;

                if (!existingRecord) {
                    isNewRecord = true;
                } else {
                    // Check if new value is better
                    if (record.recordType === 'fastest_time') {
                        isNewRecord = record.value < existingRecord.value;
                    } else {
                        isNewRecord = record.value > existingRecord.value;
                    }
                }

                if (isNewRecord) {
                    await prisma.personalRecord.upsert({
                        where: {
                            userId_exerciseId_recordType: {
                                userId,
                                exerciseId,
                                recordType: record.recordType
                            }
                        },
                        update: {
                            value: record.value,
                            unit: record.unit,
                            achievedAt: new Date()
                        },
                        create: {
                            userId,
                            exerciseId,
                            recordType: record.recordType,
                            value: record.value,
                            unit: record.unit
                        }
                    });

                    newRecords.push(record);
                }
            }

            return newRecords;
        } catch (error) {
            console.error('Check personal record error:', error);
            throw error;
        }
    }

    /**
     * Get workout volume over time
     */
    static async getVolumeOverTime(userId, timeframe = '30d') {
        try {
            const days = parseInt(timeframe);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const workouts = await prisma.workout.findMany({
                where: {
                    userId,
                    workoutDate: { gte: startDate }
                },
                orderBy: { workoutDate: 'asc' }
            });

            // Calculate daily volume
            const volumeByDate = {};
            workouts.forEach(workout => {
                const date = workout.workoutDate.toISOString().split('T')[0];
                const volume = workout.weight && workout.reps && workout.sets
                    ? workout.weight * workout.reps * workout.sets
                    : 0;

                volumeByDate[date] = (volumeByDate[date] || 0) + volume;
            });

            return Object.entries(volumeByDate).map(([date, volume]) => ({
                date,
                volume: Math.round(volume)
            }));
        } catch (error) {
            console.error('Get volume over time error:', error);
            throw error;
        }
    }

    /**
     * Get workout consistency score (0-100)
     */
    static async getConsistencyScore(userId, timeframe = '30d') {
        try {
            const days = parseInt(timeframe);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const workouts = await prisma.workout.findMany({
                where: {
                    userId,
                    workoutDate: { gte: startDate }
                },
                select: { workoutDate: true }
            });

            // Get unique workout days
            const workoutDays = new Set(
                workouts.map(w => w.workoutDate.toISOString().split('T')[0])
            );

            const score = (workoutDays.size / days) * 100;

            return {
                score: Math.round(score),
                workoutDays: workoutDays.size,
                totalDays: days,
                consistency: score > 70 ? 'excellent' : score > 40 ? 'good' : 'needs_improvement'
            };
        } catch (error) {
            console.error('Get consistency score error:', error);
            throw error;
        }
    }
}

export default AnalyticsService;
