import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultExercises = [
    // Strength - Upper Body
    { name: 'Bench Press', category: 'Strength' },
    { name: 'Incline Bench Press', category: 'Strength' },
    { name: 'Decline Bench Press', category: 'Strength' },
    { name: 'Dumbbell Chest Press', category: 'Strength' },
    { name: 'Chest Fly', category: 'Strength' },
    { name: 'Overhead Press', category: 'Strength' },
    { name: 'Arnold Press', category: 'Strength' },
    { name: 'Lateral Raise', category: 'Strength' },
    { name: 'Front Raise', category: 'Strength' },
    { name: 'Rear Delt Fly', category: 'Strength' },
    { name: 'Pull Up', category: 'Strength' },
    { name: 'Chin Up', category: 'Strength' },
    { name: 'Lat Pulldown', category: 'Strength' },
    { name: 'Barbell Row', category: 'Strength' },
    { name: 'Dumbbell Row', category: 'Strength' },
    { name: 'T-Bar Row', category: 'Strength' },
    { name: 'Bicep Curl', category: 'Strength' },
    { name: 'Hammer Curl', category: 'Strength' },
    { name: 'Preacher Curl', category: 'Strength' },
    { name: 'Tricep Dip', category: 'Strength' },
    { name: 'Tricep Pushdown', category: 'Strength' },
    { name: 'Skull Crusher', category: 'Strength' },
    { name: 'Close Grip Bench Press', category: 'Strength' },

    // Strength - Lower Body
    { name: 'Squat', category: 'Strength' },
    { name: 'Front Squat', category: 'Strength' },
    { name: 'Goblet Squat', category: 'Strength' },
    { name: 'Bulgarian Split Squat', category: 'Strength' },
    { name: 'Deadlift', category: 'Strength' },
    { name: 'Romanian Deadlift', category: 'Strength' },
    { name: 'Sumo Deadlift', category: 'Strength' },
    { name: 'Leg Press', category: 'Strength' },
    { name: 'Leg Extension', category: 'Strength' },
    { name: 'Leg Curl', category: 'Strength' },
    { name: 'Lunges', category: 'Strength' },
    { name: 'Walking Lunges', category: 'Strength' },
    { name: 'Calf Raise', category: 'Strength' },
    { name: 'Hip Thrust', category: 'Strength' },

    // Strength - Core
    { name: 'Plank', category: 'Strength' },
    { name: 'Side Plank', category: 'Strength' },
    { name: 'Crunches', category: 'Strength' },
    { name: 'Sit Ups', category: 'Strength' },
    { name: 'Russian Twist', category: 'Strength' },
    { name: 'Leg Raise', category: 'Strength' },
    { name: 'Hanging Leg Raise', category: 'Strength' },
    { name: 'Ab Wheel Rollout', category: 'Strength' },
    { name: 'Cable Crunch', category: 'Strength' },

    // Calisthenics
    { name: 'Push Up', category: 'Calisthenics' },
    { name: 'Diamond Push Up', category: 'Calisthenics' },
    { name: 'Wide Push Up', category: 'Calisthenics' },
    { name: 'Decline Push Up', category: 'Calisthenics' },
    { name: 'Burpees', category: 'Calisthenics' },
    { name: 'Mountain Climbers', category: 'Calisthenics' },
    { name: 'Jumping Jacks', category: 'Calisthenics' },
    { name: 'Box Jumps', category: 'Calisthenics' },
    { name: 'Jump Squats', category: 'Calisthenics' },
    { name: 'Pistol Squat', category: 'Calisthenics' },
    { name: 'Handstand Push Up', category: 'Calisthenics' },
    { name: 'Muscle Up', category: 'Calisthenics' },

    // Cardio
    { name: 'Running', category: 'Cardio' },
    { name: 'Sprinting', category: 'Cardio' },
    { name: 'Jogging', category: 'Cardio' },
    { name: 'Cycling', category: 'Cardio' },
    { name: 'Stationary Bike', category: 'Cardio' },
    { name: 'Swimming', category: 'Cardio' },
    { name: 'Rowing', category: 'Cardio' },
    { name: 'Jump Rope', category: 'Cardio' },
    { name: 'Elliptical', category: 'Cardio' },
    { name: 'Stair Climber', category: 'Cardio' },
    { name: 'Battle Ropes', category: 'Cardio' },
    { name: 'High Knees', category: 'Cardio' },

    // Flexibility
    { name: 'Yoga', category: 'Flexibility' },
    { name: 'Stretching', category: 'Flexibility' },
    { name: 'Pilates', category: 'Flexibility' },
    { name: 'Foam Rolling', category: 'Flexibility' },
    { name: 'Dynamic Stretching', category: 'Flexibility' },
    { name: 'Static Stretching', category: 'Flexibility' }
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
