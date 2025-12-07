import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all templates (user's + public)
 */
export const getTemplates = async (req, res) => {
    try {
        const userId = req.user.id;

        const templates = await prisma.workoutTemplate.findMany({
            where: {
                OR: [
                    { userId },
                    { isPublic: true }
                ]
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                exercises: {
                    include: {
                        exercise: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
            orderBy: {
                usageCount: 'desc'
            }
        });

        res.json(templates);
    } catch (error) {
        console.error('Get templates error:', error);
        res.status(500).json({ message: 'Error fetching templates' });
    }
};

/**
 * Get single template by ID
 */
export const getTemplateById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const template = await prisma.workoutTemplate.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                exercises: {
                    include: {
                        exercise: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        // Check if user has access
        if (!template.isPublic && template.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(template);
    } catch (error) {
        console.error('Get template error:', error);
        res.status(500).json({ message: 'Error fetching template' });
    }
};

/**
 * Create new template
 */
export const createTemplate = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, category, difficulty, estimatedTime, isPublic, exercises } = req.body;

        if (!name || !exercises || exercises.length === 0) {
            return res.status(400).json({ message: 'Name and exercises are required' });
        }

        const template = await prisma.workoutTemplate.create({
            data: {
                userId,
                name,
                description,
                category,
                difficulty,
                estimatedTime: estimatedTime ? parseInt(estimatedTime) : null,
                isPublic: isPublic || false,
                exercises: {
                    create: exercises.map((ex, index) => ({
                        exerciseId: parseInt(ex.exerciseId),
                        order: index,
                        sets: ex.sets ? parseInt(ex.sets) : null,
                        reps: ex.reps ? parseInt(ex.reps) : null,
                        duration: ex.duration ? parseInt(ex.duration) : null,
                        restTime: ex.restTime ? parseInt(ex.restTime) : null,
                        notes: ex.notes
                    }))
                }
            },
            include: {
                exercises: {
                    include: {
                        exercise: true
                    }
                }
            }
        });

        res.status(201).json(template);
    } catch (error) {
        console.error('Create template error:', error);
        res.status(500).json({ message: 'Error creating template' });
    }
};

/**
 * Update template
 */
export const updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { name, description, category, difficulty, estimatedTime, isPublic, exercises } = req.body;

        const template = await prisma.workoutTemplate.findUnique({
            where: { id: parseInt(id) }
        });

        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        if (template.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Delete existing exercises and create new ones
        await prisma.templateExercise.deleteMany({
            where: { templateId: parseInt(id) }
        });

        const updatedTemplate = await prisma.workoutTemplate.update({
            where: { id: parseInt(id) },
            data: {
                name: name || template.name,
                description: description !== undefined ? description : template.description,
                category: category || template.category,
                difficulty: difficulty || template.difficulty,
                estimatedTime: estimatedTime ? parseInt(estimatedTime) : template.estimatedTime,
                isPublic: isPublic !== undefined ? isPublic : template.isPublic,
                exercises: exercises ? {
                    create: exercises.map((ex, index) => ({
                        exerciseId: parseInt(ex.exerciseId),
                        order: index,
                        sets: ex.sets ? parseInt(ex.sets) : null,
                        reps: ex.reps ? parseInt(ex.reps) : null,
                        duration: ex.duration ? parseInt(ex.duration) : null,
                        restTime: ex.restTime ? parseInt(ex.restTime) : null,
                        notes: ex.notes
                    }))
                } : undefined
            },
            include: {
                exercises: {
                    include: {
                        exercise: true
                    }
                }
            }
        });

        res.json(updatedTemplate);
    } catch (error) {
        console.error('Update template error:', error);
        res.status(500).json({ message: 'Error updating template' });
    }
};

/**
 * Delete template
 */
export const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const template = await prisma.workoutTemplate.findUnique({
            where: { id: parseInt(id) }
        });

        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        if (template.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await prisma.workoutTemplate.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Delete template error:', error);
        res.status(500).json({ message: 'Error deleting template' });
    }
};

/**
 * Use template to create workouts
 */
export const useTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { workoutDate } = req.body;

        const template = await prisma.workoutTemplate.findUnique({
            where: { id: parseInt(id) },
            include: {
                exercises: {
                    include: {
                        exercise: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        // Check access
        if (!template.isPublic && template.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Create workouts from template
        const workouts = await Promise.all(
            template.exercises.map(async (templateExercise) => {
                return await prisma.workout.create({
                    data: {
                        userId,
                        exerciseId: templateExercise.exerciseId,
                        sets: templateExercise.sets,
                        reps: templateExercise.reps,
                        duration: templateExercise.duration,
                        notes: templateExercise.notes,
                        workoutDate: workoutDate ? new Date(workoutDate) : new Date()
                    },
                    include: {
                        exercise: true
                    }
                });
            })
        );

        // Increment usage count
        await prisma.workoutTemplate.update({
            where: { id: parseInt(id) },
            data: {
                usageCount: {
                    increment: 1
                }
            }
        });

        res.status(201).json({
            message: 'Workouts created from template',
            workouts
        });
    } catch (error) {
        console.error('Use template error:', error);
        res.status(500).json({ message: 'Error using template' });
    }
};

/**
 * Get user's templates
 */
export const getUserTemplates = async (req, res) => {
    try {
        const userId = req.user.id;

        const templates = await prisma.workoutTemplate.findMany({
            where: { userId },
            include: {
                exercises: {
                    include: {
                        exercise: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(templates);
    } catch (error) {
        console.error('Get user templates error:', error);
        res.status(500).json({ message: 'Error fetching user templates' });
    }
};
