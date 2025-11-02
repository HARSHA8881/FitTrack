# FitTrack

A full-stack fitness tracking application built with React (Vite) and Node.js (Express + Prisma).

## Project Structure

```
fittrack/
├── client/                 # React frontend (Vite)
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api.js         # Axios base setup
│   │   ├── App.jsx        # Root app component
│   │   ├── main.jsx       # Vite entry file
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom React hooks
│   │   └── styles/        # Global styles
│   ├── .env               # Frontend environment variables
│   └── package.json
│
├── server/                # Backend (Node.js + Express + Prisma)
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── src/
│   │   ├── index.js       # Main server file
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── controllers/   # Route controllers
│   │   └── utils/         # Utility functions
│   ├── .env               # Backend environment variables
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the `server` directory:
```env
DATABASE_URL="mysql://user:password@localhost:3306/fittrack"
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=5000
```

4. Set up Prisma:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port Vite assigns)

## Features

- User authentication (Signup/Login)
- JWT-based authentication
- Protected routes
- User dashboard
- RESTful API

## Technologies Used

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express
- Prisma ORM
- MySQL
- JWT (JSON Web Tokens)
- bcryptjs (password hashing)

## Available Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

## License

MIT

# FitTrack
