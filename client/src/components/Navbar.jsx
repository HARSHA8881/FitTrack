import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Dumbbell } from 'lucide-react';

function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-brand">
        <div className="nav-brand-icon"><Dumbbell size={20} /></div>
        <Link to="/">FitTrack</Link>
      </div>
      <div className="nav-links">
        {token ? (
          <>
            <Link
              to="/dashboard"
              className={isActive('/dashboard') ? 'active' : ''}
            >
              Dashboard
            </Link>
            <Link
              to="/workouts"
              className={isActive('/workouts') ? 'active' : ''}
            >
              Workouts
            </Link>
            <Link
              to="/exercises"
              className={isActive('/exercises') ? 'active' : ''}
            >
              Exercises
            </Link>
            <Link
              to="/stats"
              className={isActive('/stats') ? 'active' : ''}
            >
              Stats
            </Link>
            <button onClick={handleLogout} className="nav-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={isActive('/login') ? 'active' : ''}
            >
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

