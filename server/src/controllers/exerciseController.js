import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all exercises (default + user custom)
export const getExercises = async (req, res) => {
    try {
        const userId = req.user.id;

        const exercises = await prisma.exercise.findMany({
            where: {
                OR: [
                    { isDefault: true },
                    { userId: userId }
                ]
            },
            orderBy: {
                name: 'asc'
            }
        });

        res.json(exercises);
    } catch (error) {
        console.error('Get exercises error:', error);
        res.status(500).json({ message: 'Error fetching exercises' });
    }
};

// Add custom exercise
export const createExercise = async (req, res) => {
    try {
        const { name, category } = req.body;
        const userId = req.user.id;

        if (!name || !category) {
            return res.status(400).json({ message: 'Name and category are required' });
        }

        const exercise = await prisma.exercise.create({
            data: {
                name,
                category,
                userId,
                isDefault: false
            }
        });

        res.status(201).json(exercise);
    } catch (error) {
        console.error('Create exercise error:', error);
        res.status(500).json({ message: 'Error creating exercise' });
    }
};
