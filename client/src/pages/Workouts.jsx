import { useState, useEffect } from 'react';
import api from '../api';

function Workouts() {
    const [workouts, setWorkouts] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        exerciseId: '',
        sets: '',
        reps: '',
        weight: '',
        duration: '',
        notes: '',
        workoutDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [workoutsRes, exercisesRes] = await Promise.all([
                api.get('/workouts'),
                api.get('/exercises')
            ]);
            setWorkouts(workoutsRes.data);
            setExercises(exercisesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/workouts', formData);
            setShowForm(false);
            setFormData({
                exerciseId: '',
                sets: '',
                reps: '',
                weight: '',
                duration: '',
                notes: '',
                workoutDate: new Date().toISOString().split('T')[0]
            });
            fetchData(); // Refresh list
        } catch (error) {
            console.error('Error logging workout:', error);
            alert('Failed to log workout');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this workout?')) {
            try {
                await api.delete(`/workouts/${id}`);
                setWorkouts(workouts.filter(w => w.id !== id));
            } catch (error) {
                console.error('Error deleting workout:', error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="header-actions">
                <h1>My Workouts</h1>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Log Workout'}
                </button>
            </div>

            {showForm && (
                <div className="workout-form-card">
                    <h2>Log New Workout</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Exercise</label>
                            <select
                                value={formData.exerciseId}
                                onChange={(e) => setFormData({ ...formData, exerciseId: e.target.value })}
                                required
                            >
                                <option value="">Select Exercise</option>
                                {exercises.map(ex => (
                                    <option key={ex.id} value={ex.id}>{ex.name} ({ex.category})</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Sets</label>
                                <input
                                    type="number"
                                    value={formData.sets}
                                    onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Reps</label>
                                <input
                                    type="number"
                                    value={formData.reps}
                                    onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Duration (min)</label>
                                <input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={formData.workoutDate}
                                    onChange={(e) => setFormData({ ...formData, workoutDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Notes</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows="3"
                            />
                        </div>

                        <button type="submit" className="btn-submit">Save Workout</button>
                    </form>
                </div>
            )}

            <div className="workouts-list">
                {workouts.length === 0 ? (
                    <p>No workouts logged yet.</p>
                ) : (
                    workouts.map(workout => (
                        <div key={workout.id} className="workout-card">
                            <div className="workout-header">
                                <h3>{workout.exercise.name}</h3>
                                <span className="workout-date">
                                    {new Date(workout.workoutDate).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="workout-details">
                                {workout.sets && <span>{workout.sets} sets</span>}
                                {workout.reps && <span>{workout.reps} reps</span>}
                                {workout.weight && <span>{workout.weight} kg</span>}
                                {workout.duration && <span>{workout.duration} mins</span>}
                            </div>
                            {workout.notes && <p className="workout-notes">{workout.notes}</p>}
                            <button
                                className="btn-delete"
                                onClick={() => handleDelete(workout.id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Workouts;
