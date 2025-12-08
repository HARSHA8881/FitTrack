import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Dumbbell,
    Library,
    TrendingUp,
    User,
    LogOut,
    Activity,
    Menu,
    X
} from 'lucide-react';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.username || 'User';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/workouts', icon: Dumbbell, label: 'Workouts' },
        { path: '/exercises', icon: Library, label: 'Exercises' },
        { path: '/progress', icon: TrendingUp, label: 'Progress' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    // Get first letter of username for avatar
    const avatarLetter = username.charAt(0).toUpperCase();

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Close mobile menu when clicking outside
    const handleOverlayClick = () => {
        setIsMobileMenuOpen(false);
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Mobile Menu Toggle Button */}
            <button
                className="mobile-menu-toggle"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Overlay for Mobile */}
            <div
                className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={handleOverlayClick}
            />

            {/* Sidebar */}
            <div className={`app-sidebar ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <NavLink to="/dashboard" className="sidebar-logo">
                        <div className="sidebar-logo-text">
                            <span className="sidebar-logo-title">FitTrack</span>
                            <span className="sidebar-logo-subtitle">Your Fitness Hub</span>
                        </div>
                    </NavLink>
                </div>

                {/* Sidebar Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `sidebar-nav-item ${isActive ? 'active' : ''}`
                            }
                        >
                            <item.icon />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Sidebar Footer - User Profile */}
                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            {avatarLetter}
                        </div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{username}</div>
                            <div className="sidebar-user-role">member</div>
                        </div>
                        <button
                            className="sidebar-logout"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <LogOut />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
