import { useState, useEffect } from 'react';
import api from '../api';

function Stats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!stats) return <div>Error loading stats</div>;

    return (
        <div className="page-container">
            <h1>Your Progress</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Workouts</h3>
                    <div className="stat-value">{stats.totalWorkouts}</div>
                </div>

                <div className="stat-card">
                    <h3>Total Volume</h3>
                    <div className="stat-value">{Math.round(stats.totalVolume).toLocaleString()} kg</div>
                    <p className="stat-subtitle">Total weight lifted</p>
                </div>

                <div className="stat-card">
                    <h3>Favorite Exercise</h3>
                    <div className="stat-value">{stats.favoriteExercise || 'N/A'}</div>
                </div>
            </div>

            <div className="recent-activity">
                <h2>Recent Activity (Last 7 Days)</h2>
                {stats.recentWorkouts.length === 0 ? (
                    <p>No recent workouts.</p>
                ) : (
                    <div className="activity-list">
                        {stats.recentWorkouts.map(workout => (
                            <div key={workout.id} className="activity-item">
                                <span className="date">
                                    {new Date(workout.workoutDate).toLocaleDateString()}
                                </span>
                                {/* Note: In a real app we'd include exercise name in the recentWorkouts query */}
                                <span className="details">
                                    Workout logged
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Stats;
