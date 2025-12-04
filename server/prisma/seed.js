import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultExercises = [
    { name: 'Bench Press', category: 'Strength' },
    { name: 'Squat', category: 'Strength' },
    { name: 'Deadlift', category: 'Strength' },
    { name: 'Overhead Press', category: 'Strength' },
    { name: 'Pull Up', category: 'Strength' },
    { name: 'Push Up', category: 'Strength' },
    { name: 'Running', category: 'Cardio' },
    { name: 'Cycling', category: 'Cardio' },
    { name: 'Swimming', category: 'Cardio' },
    { name: 'Jump Rope', category: 'Cardio' },
    { name: 'Yoga', category: 'Flexibility' },
    { name: 'Stretching', category: 'Flexibility' }
];

async function main() {
    console.log('Start seeding...');

    for (const exercise of defaultExercises) {
        const existing = await prisma.exercise.findFirst({
            where: {
                name: exercise.name,
                isDefault: true
            }
        });

        if (!existing) {
            await prisma.exercise.create({
                data: {
                    ...exercise,
                    isDefault: true
                }
            });
            console.log(`Created exercise: ${exercise.name}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
