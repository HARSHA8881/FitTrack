import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all workouts for logged-in user
export const getWorkouts = async (req, res) => {
    try {
        const userId = req.user.id;

        const workouts = await prisma.workout.findMany({
            where: { userId },
            include: {
                exercise: true
            },
            orderBy: {
                workoutDate: 'desc'
            }
        });

        res.json(workouts);
    } catch (error) {
        console.error('Get workouts error:', error);
        res.status(500).json({ message: 'Error fetching workouts' });
    }
};

// Log a new workout
export const createWorkout = async (req, res) => {
    try {
        const { exerciseId, sets, reps, weight, duration, notes, workoutDate } = req.body;
        const userId = req.user.id;

        if (!exerciseId) {
            return res.status(400).json({ message: 'Exercise ID is required' });
        }

        const workout = await prisma.workout.create({
            data: {
                userId,
                exerciseId: parseInt(exerciseId),
                sets: sets ? parseInt(sets) : null,
                reps: reps ? parseInt(reps) : null,
                weight: weight ? parseFloat(weight) : null,
                duration: duration ? parseInt(duration) : null,
                notes,
                workoutDate: workoutDate ? new Date(workoutDate) : new Date()
            },
            include: {
                exercise: true
            }
        });

        res.status(201).json(workout);
    } catch (error) {
        console.error('Create workout error:', error);
        res.status(500).json({ message: 'Error logging workout' });
    }
};

// Get specific workout details
export const getWorkoutById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const workout = await prisma.workout.findUnique({
            where: { id: parseInt(id) },
            include: { exercise: true }
        });

        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        if (workout.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(workout);
    } catch (error) {
        console.error('Get workout error:', error);
        res.status(500).json({ message: 'Error fetching workout' });
    }
};

// Delete workout
export const deleteWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const workout = await prisma.workout.findUnique({
            where: { id: parseInt(id) }
        });

        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        if (workout.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await prisma.workout.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Workout deleted successfully' });
    } catch (error) {
        console.error('Delete workout error:', error);
        res.status(500).json({ message: 'Error deleting workout' });
    }
};

// Update workout
export const updateWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { sets, reps, weight, duration, notes, workoutDate } = req.body;

        const workout = await prisma.workout.findUnique({
            where: { id: parseInt(id) }
        });

        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        if (workout.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedWorkout = await prisma.workout.update({
            where: { id: parseInt(id) },
            data: {
                sets: sets ? parseInt(sets) : workout.sets,
                reps: reps ? parseInt(reps) : workout.reps,
                weight: weight ? parseFloat(weight) : workout.weight,
                duration: duration ? parseInt(duration) : workout.duration,
                notes: notes !== undefined ? notes : workout.notes,
                workoutDate: workoutDate ? new Date(workoutDate) : workout.workoutDate
            },
            include: { exercise: true }
        });

        res.json(updatedWorkout);
    } catch (error) {
        console.error('Update workout error:', error);
        res.status(500).json({ message: 'Error updating workout' });
    }
};
