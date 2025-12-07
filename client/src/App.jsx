import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Exercises from './pages/Exercises';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import './styles/global.css';

function AppLayout() {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Pages that don't need sidebar
  const noSidebarPages = ['/', '/login', '/signup'];
  const showSidebar = token && !noSidebarPages.includes(location.pathname);

  return (
    <div className="app-layout">
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? 'app-main' : 'app-full'} style={{ marginLeft: showSidebar ? 'var(--sidebar-width)' : 0 }}>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/workouts" element={token ? <Workouts /> : <Navigate to="/login" replace />} />
          <Route path="/exercises" element={token ? <Exercises /> : <Navigate to="/login" replace />} />
          <Route path="/progress" element={token ? <Progress /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
      <ThemeToggle />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppLayout />
      </Router>
    </ThemeProvider>
  );
}

export default App;


