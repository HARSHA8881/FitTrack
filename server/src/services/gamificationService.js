import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Gamification Service
 * Handles XP, levels, achievements, and streaks
 */
class GamificationService {

    // XP Constants
    static XP_PER_LEVEL = 100;
    static LEVEL_MULTIPLIER = 1.5;

    // XP Rewards
    static XP_REWARDS = {
        WORKOUT_BASE: 10,
        WORKOUT_INTENSITY_LOW: 5,
        WORKOUT_INTENSITY_MEDIUM: 10,
        WORKOUT_INTENSITY_HIGH: 20,
        PERSONAL_RECORD: 50,
        STREAK_BONUS: 5, // per day of streak
        FIRST_WORKOUT_OF_DAY: 15,
        COMPLETE_TEMPLATE: 25,
        SOCIAL_POST: 5,
        ACHIEVEMENT_UNLOCK: 100,
    };

    /**
     * Calculate XP for a workout
     */
    static calculateWorkoutXP(workout) {
        let xp = this.XP_REWARDS.WORKOUT_BASE;

        // Intensity bonus
        if (workout.intensity === 'low') xp += this.XP_REWARDS.WORKOUT_INTENSITY_LOW;
        if (workout.intensity === 'medium') xp += this.XP_REWARDS.WORKOUT_INTENSITY_MEDIUM;
        if (workout.intensity === 'high') xp += this.XP_REWARDS.WORKOUT_INTENSITY_HIGH;

        // Duration bonus (1 XP per 5 minutes)
        if (workout.duration) {
            xp += Math.floor(workout.duration / 5);
        }

        // Personal record bonus
        if (workout.isPersonalRecord) {
            xp += this.XP_REWARDS.PERSONAL_RECORD;
        }

        return xp;
    }

    /**
     * Calculate required XP for a level
     */
    static getXPForLevel(level) {
        return Math.floor(this.XP_PER_LEVEL * Math.pow(this.LEVEL_MULTIPLIER, level - 1));
    }

    /**
     * Calculate level from total XP
     */
    static getLevelFromXP(totalXP) {
        let level = 1;
        let xpRequired = 0;

        while (xpRequired <= totalXP) {
            level++;
            xpRequired += this.getXPForLevel(level);
        }

        return level - 1;
    }

    /**
     * Award XP to user and check for level up
     */
    static async awardXP(userId, xpAmount, reason = 'workout') {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) throw new Error('User not found');

            const newXP = user.xp + xpAmount;
            const newTotalPoints = user.totalPoints + xpAmount;
            const newLevel = this.getLevelFromXP(newXP);
            const leveledUp = newLevel > user.level;

            // Update user
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    xp: newXP,
                    totalPoints: newTotalPoints,
                    level: newLevel
                }
            });

            // Check for achievements
            await this.checkAchievements(userId);

            return {
                xpAwarded: xpAmount,
                totalXP: newXP,
                level: newLevel,
                leveledUp,
                reason
            };
        } catch (error) {
            console.error('Award XP error:', error);
            throw error;
        }
    }

    /**
     * Update user's workout streak
     */
    static async updateStreak(userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) throw new Error('User not found');

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const lastWorkout = user.lastWorkoutDate;
            let newStreak = 1;
            let streakBonus = 0;

            if (lastWorkout) {
                const lastWorkoutDate = new Date(lastWorkout);
                lastWorkoutDate.setHours(0, 0, 0, 0);

                const daysDiff = Math.floor((today - lastWorkoutDate) / (1000 * 60 * 60 * 24));

                if (daysDiff === 0) {
                    // Same day, no streak change
                    return { streakContinued: false, currentStreak: user.currentStreak };
                } else if (daysDiff === 1) {
                    // Consecutive day, increment streak
                    newStreak = user.currentStreak + 1;
                    streakBonus = this.XP_REWARDS.STREAK_BONUS * newStreak;
                } else {
                    // Streak broken
                    newStreak = 1;
                }
            }

            const longestStreak = Math.max(user.longestStreak, newStreak);

            // Update user
            await prisma.user.update({
                where: { id: userId },
                data: {
                    currentStreak: newStreak,
                    longestStreak,
                    lastWorkoutDate: new Date()
                }
            });

            // Award streak bonus XP
            if (streakBonus > 0) {
                await this.awardXP(userId, streakBonus, 'streak_bonus');
            }

            return {
                streakContinued: newStreak > 1,
                currentStreak: newStreak,
                longestStreak,
                streakBonus
            };
        } catch (error) {
            console.error('Update streak error:', error);
            throw error;
        }
    }

    /**
     * Check and unlock achievements
     */
    static async checkAchievements(userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    workouts: true,
                    achievements: {
                        include: { achievement: true }
                    }
                }
            });

            if (!user) throw new Error('User not found');

            const allAchievements = await prisma.achievement.findMany();
            const unlockedAchievementIds = user.achievements.map(ua => ua.achievementId);
            const newUnlocks = [];

            for (const achievement of allAchievements) {
                // Skip if already unlocked
                if (unlockedAchievementIds.includes(achievement.id)) continue;

                const requirement = JSON.parse(achievement.requirement);
                let unlocked = false;

                // Check different achievement types
                switch (achievement.category) {
                    case 'workout':
                        if (requirement.type === 'total_workouts') {
                            unlocked = user.workouts.length >= requirement.count;
                        }
                        break;

                    case 'streak':
                        if (requirement.type === 'consecutive_days') {
                            unlocked = user.currentStreak >= requirement.days;
                        } else if (requirement.type === 'longest_streak') {
                            unlocked = user.longestStreak >= requirement.days;
                        }
                        break;

                    case 'milestone':
                        if (requirement.type === 'reach_level') {
                            unlocked = user.level >= requirement.level;
                        } else if (requirement.type === 'total_xp') {
                            unlocked = user.xp >= requirement.xp;
                        }
                        break;
                }

                // Unlock achievement
                if (unlocked) {
                    await prisma.userAchievement.create({
                        data: {
                            userId: user.id,
                            achievementId: achievement.id
                        }
                    });

                    // Award achievement XP
                    await this.awardXP(userId, achievement.xpReward, 'achievement_unlock');

                    newUnlocks.push(achievement);
                }
            }

            return newUnlocks;
        } catch (error) {
            console.error('Check achievements error:', error);
            throw error;
        }
    }

    /**
     * Get leaderboard
     */
    static async getLeaderboard(timeframe = 'all', limit = 100) {
        try {
            let orderBy = {};

            switch (timeframe) {
                case 'week':
                case 'month':
                    // For time-based leaderboards, we'd need additional tracking
                    // For now, use total points
                    orderBy = { totalPoints: 'desc' };
                    break;
                case 'all':
                default:
                    orderBy = { totalPoints: 'desc' };
            }

            const users = await prisma.user.findMany({
                take: limit,
                orderBy,
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    level: true,
                    xp: true,
                    totalPoints: true,
                    currentStreak: true,
                    longestStreak: true,
                    _count: {
                        select: {
                            workouts: true,
                            achievements: true
                        }
                    }
                }
            });

            return users.map((user, index) => ({
                rank: index + 1,
                ...user,
                totalWorkouts: user._count.workouts,
                totalAchievements: user._count.achievements
            }));
        } catch (error) {
            console.error('Get leaderboard error:', error);
            throw error;
        }
    }

    /**
     * Get user's gamification stats
     */
    static async getUserStats(userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    achievements: {
                        include: { achievement: true }
                    },
                    _count: {
                        select: {
                            workouts: true
                        }
                    }
                }
            });

            if (!user) throw new Error('User not found');

            const currentLevelXP = this.getXPForLevel(user.level);
            const nextLevelXP = this.getXPForLevel(user.level + 1);
            const progressToNextLevel = ((user.xp % currentLevelXP) / nextLevelXP) * 100;

            return {
                level: user.level,
                xp: user.xp,
                totalPoints: user.totalPoints,
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
                totalWorkouts: user._count.workouts,
                totalAchievements: user.achievements.length,
                progressToNextLevel: Math.round(progressToNextLevel),
                nextLevelXP,
                achievements: user.achievements.map(ua => ({
                    ...ua.achievement,
                    unlockedAt: ua.unlockedAt
                }))
            };
        } catch (error) {
            console.error('Get user stats error:', error);
            throw error;
        }
    }
}

export default GamificationService;
