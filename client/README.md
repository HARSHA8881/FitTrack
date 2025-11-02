# FitTrack Client

React frontend for FitTrack application built with Vite.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

## Project Structure

- `src/api.js` - Axios configuration and API setup
- `src/pages/` - Page components (Login, Signup, Dashboard)
- `src/components/` - Reusable components (Navbar)
- `src/hooks/` - Custom React hooks (useAuth)
- `src/styles/` - Global styles
