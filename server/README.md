# FitTrack Server

Node.js backend server for FitTrack application using Express and Prisma.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
DATABASE_URL="mysql://user:password@localhost:3306/fittrack"
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=5000
```

3. Set up Prisma:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Start the server:
```bash
npm run dev
```

## Project Structure

- `src/index.js` - Main server file
- `src/routes/` - API routes (auth.js)
- `src/middleware/` - Express middleware (authMiddleware.js)
- `src/controllers/` - Route controllers (userController.js)
- `src/utils/` - Utility functions (jwt.js)
- `prisma/schema.prisma` - Database schema

