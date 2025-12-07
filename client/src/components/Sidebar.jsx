import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Dumbbell,
    Library,
    TrendingUp,
    User,
    LogOut,
    Activity
} from 'lucide-react';

function Sidebar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.username || 'User';

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

    return (
        <div className="app-sidebar">
            {/* Sidebar Header */}
            <div className="sidebar-header">
                <NavLink to="/dashboard" className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <Activity />
                    </div>
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
    );
}

export default Sidebar;
