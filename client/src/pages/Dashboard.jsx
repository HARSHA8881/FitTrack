import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, TrendingUp, Target, Flame, Calendar, Award, Activity, ChevronRight, Zap } from 'lucide-react';
import api from '../api';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, statsRes, workoutsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/stats'),
          api.get('/workouts')
        ]);

        setUser(userRes.data);
        setStats(statsRes.data);
        setRecentWorkouts(workoutsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="app-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid var(--primary-100)',
            borderTop: '4px solid var(--primary-400)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto var(--space-4)'
          }}></div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    { icon: Dumbbell, label: 'Log Workout', path: '/workouts', color: 'var(--primary-400)', bg: 'var(--primary-50)' },
    { icon: Activity, label: 'View Progress', path: '/progress', color: 'var(--secondary-400)', bg: 'var(--info-light)' },
    { icon: Target, label: 'My Goals', path: '/profile', color: 'var(--success)', bg: 'var(--success-light)' },
  ];

  const statCards = [
    {
      icon: Dumbbell,
      label: 'Total Workouts',
      value: stats?.totalWorkouts || 1,
      change: '+12%',
      trend: 'up',
      color: 'primary',
      gradient: '#0EA5E9'
    },
    {
      icon: Calendar,
      label: 'This Week',
      value: stats?.workoutsThisWeek || 1,
      change: '+25%',
      trend: 'up',
      color: 'success',
      gradient: '#0EA5E9'
    },
    {
      icon: Award,
      label: 'Personal Records',
      value: stats?.personalRecords || 4,
      change: 'New!',
      trend: 'up',
      color: 'warning',
      gradient: '#0EA5E9'
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${stats?.currentStreak || 1}`,
      change: 'Days',
      trend: 'neutral',
      color: 'error',
      gradient: '#0EA5E9'
    },
  ];

  // Mock weekly data for chart
  const weeklyData = [
    { day: 'Mon', workouts: 1 },
    { day: 'Tue', workouts: 0 },
    { day: 'Wed', workouts: 0 },
    { day: 'Thu', workouts: 0 },
    { day: 'Fri', workouts: 0 },
    { day: 'Sat', workouts: 0 },
    { day: 'Sun', workouts: 0 },
  ];

  const maxWorkouts = Math.max(...weeklyData.map(d => d.workouts), 1);

  return (
    <div className="app-content">
      {/* Hero Section */}
      <div style={{
        background: 'var(--primary-400)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-8)',
        marginBottom: 'var(--space-8)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          filter: 'blur(30px)'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 800,
            marginBottom: 'var(--space-2)',
            color: 'white'
          }}>
            {getGreeting()}, {user?.name}!
          </h1>
          <p style={{
            fontSize: 'var(--text-lg)',
            opacity: 0.95,
            marginBottom: 0
          }}>
            Ready to crush your fitness goals today?
          </p>

        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="card"
            style={{
              padding: 'var(--space-6)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all var(--transition-base)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: stat.gradient,
              opacity: 0.1,
              borderRadius: '50%',
              filter: 'blur(20px)'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-lg)',
                  background: stat.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <stat.icon size={24} />
                </div>
                <span style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-full)',
                  background: stat.trend === 'up' ? 'var(--success-light)' : 'var(--bg-tertiary)',
                  color: stat.trend === 'up' ? 'var(--success)' : 'var(--text-tertiary)'
                }}>
                  {stat.change}
                </span>
              </div>

              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3" style={{ gap: 'var(--space-6)' }}>
        {/* Left Column - Weekly Activity */}
        <div style={{ gridColumn: 'span 2' }}>
          {/* Weekly Progress Chart */}
          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="card-title">Weekly Activity</h3>
                  <p className="card-description">Your workout frequency this week</p>
                </div>
                <TrendingUp size={20} style={{ color: 'var(--primary-400)' }} />
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)', height: '200px' }}>
                {weeklyData.map((day, index) => (
                  <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{
                      width: '100%',
                      height: `${(day.workouts / maxWorkouts) * 100}%`,
                      minHeight: day.workouts > 0 ? '20px' : '4px',
                      background: day.workouts > 0
                        ? 'var(--primary-400)'
                        : 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all var(--transition-base)',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1.05)';
                        e.currentTarget.style.filter = 'brightness(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1)';
                        e.currentTarget.style.filter = 'brightness(1)';
                      }}
                    >
                      {day.workouts > 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '-25px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 700,
                          color: 'var(--primary-600)'
                        }}>
                          {day.workouts}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                      {day.day}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Workouts */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="card-title">Recent Workouts</h3>
                  <p className="card-description">Your latest training sessions</p>
                </div>
                <Link to="/workouts" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  color: 'var(--primary-400)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)'
                }}>
                  View All
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
            <div className="card-body">
              {recentWorkouts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {recentWorkouts.map((workout, index) => (
                    <div
                      key={workout.id || index}
                      style={{
                        padding: 'var(--space-4)',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-lg)',
                        borderLeft: '3px solid var(--primary-400)',
                        transition: 'all var(--transition-base)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(4px)';
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.background = 'var(--bg-tertiary)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                        <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {workout.exercise?.name || workout.exerciseName || 'Workout'}
                        </h4>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                          {new Date(workout.workoutDate || workout.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                        {workout.sets && (
                          <span className="badge badge-gray">{workout.sets} sets</span>
                        )}
                        {workout.reps && (
                          <span className="badge badge-gray">{workout.reps} reps</span>
                        )}
                        {workout.weight && (
                          <span className="badge badge-primary">{workout.weight} kg</span>
                        )}
                        {workout.duration && (
                          <span className="badge badge-secondary">{workout.duration} min</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto var(--space-4)',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Dumbbell size={40} style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                  <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                    No workouts yet
                  </h4>
                  <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                    Start your fitness journey by logging your first workout!
                  </p>
                  <Link to="/workouts" className="btn btn-primary">
                    <Dumbbell size={16} />
                    Log Your First Workout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Achievements & Motivation */}
        <div>
          {/* Today's Goal */}
          <div className="card" style={{
            marginBottom: 'var(--space-6)',
            background: '#0EA5E9',
            color: 'white',
            border: 'none'
          }}>
            <div className="card-body">
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 'var(--space-3)', display: 'flex', justifyContent: 'center' }}>
                  <Target size={48} style={{ color: 'white' }} />
                </div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'white' }}>
                  Today's Goal
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', opacity: 0.95, marginBottom: 'var(--space-4)' }}>
                  Complete 1 workout session
                </p>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  marginBottom: 'var(--space-2)'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'white',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width var(--transition-slow)'
                  }}></div>
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, opacity: 0.95 }}>
                  100% Complete!
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Card */}
          <div className="card" style={{
            background: '#0EA5E9',
            border: 'none',
            color: 'white'
          }}>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <Zap size={40} style={{ marginBottom: 'var(--space-3)' }} />
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'white' }}>
                Keep it up!
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', opacity: 0.95 }}>
                "The only bad workout is the one that didn't happen."
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
