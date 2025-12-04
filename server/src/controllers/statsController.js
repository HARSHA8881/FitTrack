import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get total workouts
        const totalWorkouts = await prisma.workout.count({
            where: { userId }
        });

        // Get workout frequency (workouts per week/month could be calculated here, 
        // but for now let's just get the last 7 days activity)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentWorkouts = await prisma.workout.findMany({
            where: {
                userId,
                workoutDate: {
                    gte: sevenDaysAgo
                }
            },
            orderBy: {
                workoutDate: 'asc'
            }
        });

        // Calculate total weight lifted (simple sum of weight * reps * sets)
        // This is a rough approximation for volume
        const allWorkouts = await prisma.workout.findMany({
            where: { userId },
            select: {
                weight: true,
                reps: true,
                sets: true
            }
        });

        let totalVolume = 0;
        allWorkouts.forEach(w => {
            if (w.weight && w.reps && w.sets) {
                totalVolume += w.weight * w.reps * w.sets;
            }
        });

        // Get favorite exercise
        const exerciseCounts = {};
        const workoutsWithExercises = await prisma.workout.findMany({
            where: { userId },
            include: { exercise: true }
        });

        workoutsWithExercises.forEach(w => {
            const name = w.exercise.name;
            exerciseCounts[name] = (exerciseCounts[name] || 0) + 1;
        });

        let favoriteExercise = null;
        let maxCount = 0;
        for (const [name, count] of Object.entries(exerciseCounts)) {
            if (count > maxCount) {
                maxCount = count;
                favoriteExercise = name;
            }
        }

        res.json({
            totalWorkouts,
            totalVolume,
            recentWorkouts,
            favoriteExercise
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
};
