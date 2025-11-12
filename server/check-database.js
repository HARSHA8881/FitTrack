import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('Checking database connection...\n');
    
    // Check connection
    await prisma.$connect();
    console.log('Connected to database successfully\n');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    
    console.log(`Total users in database: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('No users found in the database');
    } else {
      console.log('Users in database:');
      console.log('─'.repeat(60));
      users.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('');
      });
    }
    
    // Check table structure
    const tableInfo = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM User
    `;
    console.log('Table Info:');
    console.log(`   Database: fittrack`);
    console.log(`   Table: User (case-sensitive!)`);
    console.log(`   Total records: ${tableInfo[0].count}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 'P1001') {
      console.error('\n💡 Tip: Make sure MySQL is running and DATABASE_URL is correct');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

