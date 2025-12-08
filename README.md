# FitTrack

A modern, full-stack fitness tracking application that helps users monitor their workouts, track progress, and achieve their fitness goals.

## Live Demo

- **Frontend**: [https://fit-track-swart.vercel.app/](https://fit-track-swart.vercel.app/)
- **Backend API**: [https://api-fittrack.onrender.com](https://api-fittrack.onrender.com)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure signup and login with JWT-based authentication
- **Workout Tracking**: Log and manage your workouts with detailed exercise information
- **Progress Monitoring**: Visualize your fitness journey with interactive charts and statistics
- **Profile Management**: Customize your profile and set fitness goals
- **Responsive Design**: Beautiful, modern UI that works seamlessly across all devices
- **Real-time Updates**: Track your progress with live data updates

## Tech Stack

### Frontend
- **React** (v19.1.1) - UI library
- **Vite** - Build tool and development server
- **React Router** (v6.20.0) - Client-side routing
- **Axios** - HTTP client for API requests
- **Recharts** - Data visualization and charts
- **Lucide React** - Icon library
- **CSS3** - Custom styling with modern design patterns

### Backend
- **Node.js** - Runtime environment
- **Express.js** (v4.18.2) - Web framework
- **Prisma** (v5.10.0) - ORM for database management
- **PostgreSQL** - Primary database (Neon.tech)
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** (Neon.tech) - Cloud-hosted database
- **Prisma ORM** - Type-safe database client

## Project Structure

```
FitTrack/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (Landing, Dashboard, etc.)
│   │   ├── styles/        # Global CSS and styling
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main application component
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   └── index.js       # Server entry point
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json       # Backend dependencies
│
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (or access to a PostgreSQL database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HARSHA8881/FitTrack.git
   cd FitTrack
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../server
   npm install
   ```

### Environment Variables

#### Backend (.env)

Create a `.env` file in the `server` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://neondb_owner:npg_lpzt4Z8KdiEf@ep-withered-darkness-a1mso5v7-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

For production, update to:
```env
VITE_API_URL=https://api-fittrack.onrender.com
```

### Database Setup

1. **Generate Prisma Client**
   ```bash
   cd server
   npm run prisma:generate
   ```

2. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

3. **Open Prisma Studio (optional)**
   ```bash
   npm run prisma:studio
   ```

### Running the Application

#### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   The application will run on `http://localhost:5173`

#### Production Mode

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm start
   ```

## Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel at [https://fit-track-swart.vercel.app/](https://fit-track-swart.vercel.app/)

**Deployment Steps:**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Backend (Render)
The backend API is deployed on Render at [https://api-fittrack.onrender.com](https://api-fittrack.onrender.com)

**Deployment Steps:**
1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your repository
4. Configure environment variables
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Deploy

### Database (Neon.tech)
The PostgreSQL database is hosted on Neon.tech

**Connection String:**
```
postgresql://neondb_owner:npg_lpzt4Z8KdiEf@ep-withered-darkness-a1mso5v7-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Protected Endpoints
All protected endpoints require a JWT token in the Authorization header:
```http
Authorization: Bearer <your-jwt-token>
```

#### Get User Profile
```http
GET /api/user/profile
```

#### Update User Profile
```http
PUT /api/user/profile
Content-Type: application/json

{
  "name": "John Doe Updated",
  "goals": "Lose 10kg"
}
```

#### Get Workouts
```http
GET /api/workouts
```

#### Create Workout
```http
POST /api/workouts
Content-Type: application/json

{
  "name": "Morning Run",
  "exercises": [
    {
      "name": "Running",
      "duration": 30,
      "calories": 300
    }
  ]
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

**Harsha Gonela**
- GitHub: [@HARSHA8881](https://github.com/HARSHA8881)

## Acknowledgments

- Thanks to all contributors who have helped shape FitTrack
- Inspired by modern fitness tracking applications
- Built with love for the fitness community

---

**Note**: For security reasons, remember to change the JWT secret and database credentials in production environments. Never commit sensitive credentials to version control.
