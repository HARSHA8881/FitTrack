import { useState, useEffect } from 'react';
import api from '../api';

function Exercises() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newExercise, setNewExercise] = useState({ name: '', category: 'Strength' });

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const response = await api.get('/exercises');
            setExercises(response.data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/exercises', newExercise);
            setNewExercise({ name: '', category: 'Strength' });
            setShowForm(false);
            fetchExercises();
        } catch (error) {
            console.error('Error creating exercise:', error);
            alert('Failed to create exercise');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="header-actions">
                <h1>Exercises</h1>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add Custom Exercise'}
                </button>
            </div>

            {showForm && (
                <div className="form-card">
                    <h2>Add New Exercise</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Exercise Name</label>
                            <input
                                type="text"
                                value={newExercise.name}
                                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={newExercise.category}
                                onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
                            >
                                <option value="Strength">Strength</option>
                                <option value="Cardio">Cardio</option>
                                <option value="Flexibility">Flexibility</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-submit">Add Exercise</button>
                    </form>
                </div>
            )}

            <div className="exercises-grid">
                {exercises.map(exercise => (
                    <div key={exercise.id} className="exercise-card">
                        <h3>{exercise.name}</h3>
                        <span className={`category-tag ${exercise.category.toLowerCase()}`}>
                            {exercise.category}
                        </span>
                        {exercise.isDefault ? (
                            <span className="badge default">Default</span>
                        ) : (
                            <span className="badge custom">Custom</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Exercises;
