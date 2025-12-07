import { useState, useEffect } from 'react';
import { Edit, Trophy, Flame, Target, TrendingUp, Plus, X, Save, Dumbbell, Award, Zap } from 'lucide-react';
import api from '../api';

function Profile() {
    const [profile, setProfile] = useState(null);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [showGoalForm, setShowGoalForm] = useState(false);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        name: '',
        bio: '',
        fitnessGoal: '',
        experienceLevel: 'beginner',
        weeklyGoal: 3
    });

    // Goal form state
    const [goalForm, setGoalForm] = useState({
        title: '',
        description: '',
        goalType: 'weight_loss',
        targetValue: '',
        unit: 'kg',
        targetDate: ''
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.name || 'User';
    const email = user.email || '';
    const avatarLetter = username.charAt(0).toUpperCase();

    const quickStats = [
        { label: 'Total Workouts', value: '124', icon: Trophy, color: 'primary', bgColor: 'var(--primary-50)' },
        { label: 'Day Streak', value: profile?.currentStreak || '0', icon: Flame, color: 'warning', bgColor: 'var(--warning-light)' },
        { label: 'Goals Achieved', value: `${goals.filter(g => g.status === 'completed').length}/${goals.length}`, icon: Target, color: 'success', bgColor: 'var(--success-light)' },
        { label: 'Level', value: profile?.level || '1', icon: TrendingUp, color: 'secondary', bgColor: 'var(--info-light)' },
    ];

    const achievements = [
        { id: 1, name: 'First Workout', icon: Target, unlocked: true, gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
        { id: 2, name: '10 Workouts', icon: Dumbbell, unlocked: true, gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
        { id: 3, name: '7 Day Streak', icon: Flame, unlocked: false, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { id: 4, name: '100 Workouts', icon: Award, unlocked: false, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { id: 5, name: '30 Day Streak', icon: Zap, unlocked: false, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
        { id: 6, name: 'Consistency', icon: Trophy, unlocked: false, gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    ];

    useEffect(() => {
        fetchProfile();
        fetchGoals();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            setProfile(response.data);
            setProfileForm({
                name: response.data.name || '',
                bio: response.data.bio || '',
                fitnessGoal: response.data.fitnessGoal || '',
                experienceLevel: response.data.experienceLevel || 'beginner',
                weeklyGoal: response.data.weeklyGoal || 3
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGoals = async () => {
        try {
            const response = await api.get('/users/goals');
            setGoals(response.data);
        } catch (error) {
            console.error('Error fetching goals:', error);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/users/profile', profileForm);
            setProfile(response.data.user);
            setEditMode(false);

            // Update localStorage
            const updatedUser = { ...user, name: profileForm.name };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    const handleGoalSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/goals', goalForm);
            setShowGoalForm(false);
            setGoalForm({
                title: '',
                description: '',
                goalType: 'weight_loss',
                targetValue: '',
                unit: 'kg',
                targetDate: ''
            });
            fetchGoals();
        } catch (error) {
            console.error('Error creating goal:', error);
            alert('Failed to create goal');
        }
    };

    const handleDeleteGoal = async (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await api.delete(`/users/goals/${id}`);
                setGoals(goals.filter(g => g.id !== id));
            } catch (error) {
                console.error('Error deleting goal:', error);
            }
        }
    };

    const handleCompleteGoal = async (id) => {
        try {
            await api.put(`/users/goals/${id}`, { status: 'completed' });
            fetchGoals();
        } catch (error) {
            console.error('Error completing goal:', error);
        }
    };

    if (loading) {
        return <div className="app-content">Loading...</div>;
    }

    return (
        <div className="app-content">
            {/* User Header */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-6)' }}>
                        {/* Avatar */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: 'var(--radius-full)',
                            background: 'linear-gradient(135deg, var(--primary-400) 0%, var(--primary-600) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '3rem',
                            fontWeight: 700,
                            flexShrink: 0
                        }}>
                            {avatarLetter}
                        </div>

                        {/* User Info */}
                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
                                {profile?.name || username}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                                {email}
                            </p>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                                <span className="badge badge-primary">
                                    Level {profile?.level || 1}
                                </span>
                                <span className="badge badge-secondary">
                                    {profile?.experienceLevel || 'beginner'}
                                </span>
                            </div>
                            {profile?.bio && (
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                    {profile.bio}
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setEditMode(!editMode)}
                            >
                                {editMode ? <X size={16} /> : <Edit size={16} />}
                                {editMode ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>

                    {/* Edit Form */}
                    {editMode && (
                        <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-default)' }}>
                            <form onSubmit={handleProfileSubmit}>
                                <div className="grid grid-cols-2" style={{ gap: 'var(--space-4)' }}>
                                    <div className="form-group">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Experience Level</label>
                                        <select
                                            className="form-select"
                                            value={profileForm.experienceLevel}
                                            onChange={(e) => setProfileForm({ ...profileForm, experienceLevel: e.target.value })}
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea
                                        className="form-textarea"
                                        value={profileForm.bio}
                                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                        rows="3"
                                    />
                                </div>
                                <div className="grid grid-cols-2" style={{ gap: 'var(--space-4)' }}>
                                    <div className="form-group">
                                        <label className="form-label">Fitness Goal</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={profileForm.fitnessGoal}
                                            onChange={(e) => setProfileForm({ ...profileForm, fitnessGoal: e.target.value })}
                                            placeholder="e.g., Lose 10kg, Build muscle"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Weekly Workout Goal</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={profileForm.weeklyGoal}
                                            onChange={(e) => setProfileForm({ ...profileForm, weeklyGoal: parseInt(e.target.value) })}
                                            min="1"
                                            max="7"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    <Save size={16} />
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3" style={{ gap: 'var(--space-6)' }}>
                {/* Left Column */}
                <div style={{ gridColumn: 'span 2' }}>
                    {/* Fitness Goals */}
                    <div className="card">
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 className="card-title">Fitness Goals</h3>
                                <p className="card-description">Track your progress toward your targets</p>
                            </div>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setShowGoalForm(!showGoalForm)}
                            >
                                {showGoalForm ? <X size={16} /> : <Plus size={16} />}
                                {showGoalForm ? 'Cancel' : 'Add Goal'}
                            </button>
                        </div>
                        <div className="card-body">
                            {/* Goal Form */}
                            {showGoalForm && (
                                <div style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
                                    <form onSubmit={handleGoalSubmit}>
                                        <div className="form-group">
                                            <label className="form-label">Goal Title</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={goalForm.title}
                                                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                                                required
                                                placeholder="e.g., Lose 10kg"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2" style={{ gap: 'var(--space-4)' }}>
                                            <div className="form-group">
                                                <label className="form-label">Goal Type</label>
                                                <select
                                                    className="form-select"
                                                    value={goalForm.goalType}
                                                    onChange={(e) => setGoalForm({ ...goalForm, goalType: e.target.value })}
                                                >
                                                    <option value="weight_loss">Weight Loss</option>
                                                    <option value="muscle_gain">Muscle Gain</option>
                                                    <option value="strength">Strength</option>
                                                    <option value="endurance">Endurance</option>
                                                    <option value="flexibility">Flexibility</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Target Date</label>
                                                <input
                                                    type="date"
                                                    className="form-input"
                                                    value={goalForm.targetDate}
                                                    onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2" style={{ gap: 'var(--space-4)' }}>
                                            <div className="form-group">
                                                <label className="form-label">Target Value</label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    value={goalForm.targetValue}
                                                    onChange={(e) => setGoalForm({ ...goalForm, targetValue: e.target.value })}
                                                    step="0.1"
                                                    placeholder="e.g., 70"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Unit</label>
                                                <select
                                                    className="form-select"
                                                    value={goalForm.unit}
                                                    onChange={(e) => setGoalForm({ ...goalForm, unit: e.target.value })}
                                                >
                                                    <option value="kg">kg</option>
                                                    <option value="lbs">lbs</option>
                                                    <option value="reps">reps</option>
                                                    <option value="minutes">minutes</option>
                                                    <option value="km">km</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className="form-textarea"
                                                value={goalForm.description}
                                                onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                                                rows="2"
                                                placeholder="Add details about your goal..."
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                            Create Goal
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Goals List */}
                            {goals.length === 0 ? (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    padding: 'var(--space-12)',
                                    gap: 'var(--space-4)'
                                }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: 'var(--radius-full)',
                                        background: 'var(--bg-tertiary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Target size={40} style={{ color: 'var(--text-tertiary)' }} />
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                                            No Goals Yet
                                        </h4>
                                        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                                            Create your first goal to get started!
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    {goals.map((goal) => (
                                        <div key={goal.id} style={{
                                            padding: 'var(--space-4)',
                                            background: 'var(--bg-tertiary)',
                                            borderRadius: 'var(--radius-lg)',
                                            border: `2px solid ${goal.status === 'completed' ? 'var(--success)' : 'transparent'}`
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                                                        {goal.title}
                                                    </h4>
                                                    {goal.description && (
                                                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                                                            {goal.description}
                                                        </p>
                                                    )}
                                                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                                        <span className={`badge ${goal.status === 'completed' ? 'badge-success' : 'badge-primary'}`}>
                                                            {goal.status}
                                                        </span>
                                                        <span className="badge badge-gray">
                                                            {goal.goalType.replace('_', ' ')}
                                                        </span>
                                                        {goal.targetValue && (
                                                            <span className="badge badge-secondary">
                                                                Target: {goal.targetValue} {goal.unit}
                                                            </span>
                                                        )}
                                                        {goal.targetDate && (
                                                            <span className="badge badge-gray">
                                                                {new Date(goal.targetDate).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                    {goal.status !== 'completed' && (
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleCompleteGoal(goal.id)}
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn btn-sm btn-ghost"
                                                        onClick={() => handleDeleteGoal(goal.id)}
                                                        style={{ color: 'var(--error)' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    {/* Quick Stats */}
                    <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                        <div className="card-header">
                            <h3 className="card-title">Quick Stats</h3>
                        </div>
                        <div className="card-body">
                            <div className="grid grid-cols-2" style={{ gap: 'var(--space-4)' }}>
                                {quickStats.map((stat, index) => (
                                    <div key={index} style={{
                                        padding: 'var(--space-4)',
                                        background: stat.bgColor,
                                        borderRadius: 'var(--radius-lg)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        textAlign: 'center'
                                    }}>
                                        <stat.icon size={24} style={{ color: `var(--${stat.color})` }} />
                                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
                                            {stat.value}
                                        </div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Achievements</h3>
                            <p className="card-description">2/6 unlocked</p>
                        </div>
                        <div className="card-body">
                            <div className="grid grid-cols-2" style={{ gap: 'var(--space-3)' }}>
                                {achievements.map((achievement) => (
                                    <div key={achievement.id} style={{
                                        position: 'relative',
                                        aspectRatio: '1',
                                        borderRadius: 'var(--radius-lg)',
                                        background: achievement.gradient,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 'var(--space-2)',
                                        padding: 'var(--space-3)',
                                        opacity: achievement.unlocked ? 1 : 0.4,
                                        filter: achievement.unlocked ? 'none' : 'grayscale(100%)',
                                        transition: 'all var(--transition-base)',
                                        cursor: 'pointer'
                                    }}>
                                        <achievement.icon size={32} style={{ color: 'white' }} />
                                        <div style={{
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 600,
                                            color: 'white',
                                            textAlign: 'center',
                                            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                        }}>
                                            {achievement.name}
                                        </div>
                                        {!achievement.unlocked && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '0',
                                                left: '0',
                                                right: '0',
                                                bottom: '0',
                                                background: 'rgba(0,0,0,0.3)',
                                                borderRadius: 'var(--radius-lg)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
