import { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';

function Workouts() {
    const [workouts, setWorkouts] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Search, Filter, Sort, Pagination state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, name-asc, name-desc, weight-desc, weight-asc
    const [filterCategory, setFilterCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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

    // Get unique categories from exercises
    const categories = ['All', ...new Set(exercises.map(ex => ex.category).filter(Boolean))];

    // Filter workouts based on search and category
    const filteredWorkouts = workouts.filter(workout => {
        const exerciseName = workout.exercise?.name || '';
        const matchesSearch = exerciseName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'All' || workout.exercise?.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Sort workouts
    const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
        switch (sortBy) {
            case 'date-desc':
                return new Date(b.workoutDate) - new Date(a.workoutDate);
            case 'date-asc':
                return new Date(a.workoutDate) - new Date(b.workoutDate);
            case 'name-asc':
                return (a.exercise?.name || '').localeCompare(b.exercise?.name || '');
            case 'name-desc':
                return (b.exercise?.name || '').localeCompare(a.exercise?.name || '');
            case 'weight-desc':
                return (parseFloat(b.weight) || 0) - (parseFloat(a.weight) || 0);
            case 'weight-asc':
                return (parseFloat(a.weight) || 0) - (parseFloat(b.weight) || 0);
            default:
                return 0;
        }
    });

    // Pagination
    const totalPages = Math.ceil(sortedWorkouts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedWorkouts = sortedWorkouts.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterCategory, sortBy]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="app-content">
            <div className="page-header">
                <div className="page-header-content">
                    <h1 className="page-title">My Workouts</h1>
                    <p className="page-subtitle">Track and manage your exercise sessions</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Log Workout'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                    <div className="card-header">
                        <h3 className="card-title">Log New Workout</h3>
                        <p className="card-description">Record your exercise session</p>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Exercise</label>
                                <select
                                    className="form-select"
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

                            <div className="grid grid-cols-3" style={{ gap: 'var(--space-4)' }}>
                                <div className="form-group">
                                    <label className="form-label">Sets</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.sets}
                                        onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Reps</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.reps}
                                        onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Weight (kg)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        step="0.5"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2" style={{ gap: 'var(--space-4)' }}>
                                <div className="form-group">
                                    <label className="form-label">Duration (min)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.workoutDate}
                                        onChange={(e) => setFormData({ ...formData, workoutDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Notes</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Workout</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Search, Filter, and Sort Controls */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body">
                    <div className="grid grid-cols-4" style={{ gap: 'var(--space-4)', alignItems: 'end' }}>
                        {/* Search */}
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Search Workouts</label>
                            <div style={{ position: 'relative' }}>
                                <Search
                                    size={20}
                                    style={{
                                        position: 'absolute',
                                        left: 'var(--space-4)',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-tertiary)'
                                    }}
                                />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search by exercise name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ paddingLeft: 'var(--space-12)' }}
                                />
                            </div>
                        </div>

                        {/* Filter by Category */}
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">
                                <Filter size={14} style={{ display: 'inline', marginRight: 'var(--space-1)' }} />
                                Category
                            </label>
                            <select
                                className="form-select"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort By */}
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">
                                <SortAsc size={14} style={{ display: 'inline', marginRight: 'var(--space-1)' }} />
                                Sort By
                            </label>
                            <select
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="date-desc">Date (Newest First)</option>
                                <option value="date-asc">Date (Oldest First)</option>
                                <option value="name-asc">Exercise (A-Z)</option>
                                <option value="name-desc">Exercise (Z-A)</option>
                                <option value="weight-desc">Weight (Highest)</option>
                                <option value="weight-asc">Weight (Lowest)</option>
                            </select>
                        </div>

                        {/* Items Per Page */}
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Per Page</label>
                            <select
                                className="form-select"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                        Showing {paginatedWorkouts.length > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, sortedWorkouts.length)} of {sortedWorkouts.length} workouts
                        {searchQuery && ` (filtered from ${workouts.length} total)`}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: 'var(--space-4)' }}>
                {paginatedWorkouts.length === 0 ? (
                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-tertiary)' }}>
                        {searchQuery || filterCategory !== 'All' ? 'No workouts match your filters.' : 'No workouts logged yet.'}
                    </div>
                ) : (
                    paginatedWorkouts.map(workout => (
                        <div key={workout.id} className="card">
                            <div className="card-body">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                                    <div>
                                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
                                            {workout.exercise.name}
                                        </h3>
                                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                                            {new Date(workout.workoutDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => handleDelete(workout.id)}
                                        style={{ color: 'var(--error)' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
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
                                        <span className="badge badge-secondary">{workout.duration} mins</span>
                                    )}
                                </div>
                                {workout.notes && (
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                                        {workout.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="card" style={{ marginTop: 'var(--space-6)' }}>
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                className="btn btn-ghost"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                            >
                                <ChevronLeft size={20} />
                                Previous
                            </button>

                            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`btn ${currentPage === page ? 'btn-primary' : 'btn-ghost'}`}
                                        onClick={() => setCurrentPage(page)}
                                        style={{ minWidth: '40px' }}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="btn btn-ghost"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                            >
                                Next
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Workouts;
