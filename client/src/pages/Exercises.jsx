import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Dumbbell } from 'lucide-react';
import api from '../api';

function Exercises() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
    const [selectedEquipment, setSelectedEquipment] = useState('');
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

    const types = ['All', 'Strength', 'Cardio', 'Calisthenics', 'Flexibility'];
    const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
    const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'];

    // Sample exercise data with images
    const sampleExercises = [
        {
            id: 1,
            name: 'Standing Shoulder Press (Barbell)',
            type: 'Strength',
            difficulty: 'Advanced',
            muscleGroups: ['Anterior Deltoid', 'Middle Deltoid'],
            equipment: 'barbell',
            hasVideo: true
        },
        {
            id: 2,
            name: 'Seated Crunches (Machine)',
            type: 'Strength',
            difficulty: 'Intermediate',
            muscleGroups: ['Rectus Abdominis', 'Obliques'],
            equipment: 'machine',
            hasVideo: true
        },
        {
            id: 3,
            name: 'Bench Press',
            type: 'Strength',
            difficulty: 'Intermediate',
            muscleGroups: ['Pectoralis Major', 'Triceps'],
            equipment: 'barbell',
            hasVideo: false
        },
        {
            id: 4,
            name: 'Barbell Squat',
            type: 'Strength',
            difficulty: 'Advanced',
            muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
            equipment: 'barbell',
            hasVideo: true
        },
        {
            id: 5,
            name: 'Deadlift',
            type: 'Strength',
            difficulty: 'Advanced',
            muscleGroups: ['Lower Back', 'Glutes', 'Hamstrings'],
            equipment: 'barbell',
            hasVideo: true
        },
        {
            id: 6,
            name: 'Pull-Ups',
            type: 'Calisthenics',
            difficulty: 'Intermediate',
            muscleGroups: ['Latissimus Dorsi', 'Biceps'],
            equipment: 'bodyweight',
            hasVideo: true
        },
        {
            id: 7,
            name: 'Push-Ups',
            type: 'Calisthenics',
            difficulty: 'Intermediate',
            muscleGroups: ['Pectoralis Major', 'Triceps', 'Shoulders'],
            equipment: 'bodyweight',
            hasVideo: false
        },
        {
            id: 8,
            name: 'Burpees',
            type: 'Calisthenics',
            difficulty: 'Advanced',
            muscleGroups: ['Full Body'],
            equipment: 'bodyweight',
            hasVideo: true
        },
        {
            id: 9,
            name: 'Plank',
            type: 'Strength',
            difficulty: 'Intermediate',
            muscleGroups: ['Core', 'Abs'],
            equipment: 'bodyweight',
            hasVideo: false
        },
        {
            id: 10,
            name: 'Dumbbell Bicep Curl',
            type: 'Strength',
            difficulty: 'Intermediate',
            muscleGroups: ['Biceps'],
            equipment: 'dumbbell',
            hasVideo: true
        },
        {
            id: 11,
            name: 'Lat Pulldown',
            type: 'Strength',
            difficulty: 'Intermediate',
            muscleGroups: ['Latissimus Dorsi', 'Upper Back'],
            equipment: 'machine',
            hasVideo: true
        },
        {
            id: 12,
            name: 'Leg Press',
            type: 'Strength',
            difficulty: 'Intermediate',
            muscleGroups: ['Quadriceps', 'Glutes'],
            equipment: 'machine',
            hasVideo: false
        },
        {
            id: 13,
            name: 'Mountain Climbers',
            type: 'Calisthenics',
            difficulty: 'Intermediate',
            muscleGroups: ['Core', 'Shoulders', 'Legs'],
            equipment: 'bodyweight',
            hasVideo: true
        },
        {
            id: 14,
            name: 'Dumbbell Chest Press',
            type: 'Strength',
            difficulty: 'Intermediate',
            muscleGroups: ['Pectoralis Major', 'Triceps'],
            equipment: 'dumbbell',
            hasVideo: false
        },
        {
            id: 15,
            name: 'Romanian Deadlift',
            type: 'Strength',
            difficulty: 'Advanced',
            muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'],
            equipment: 'barbell',
            hasVideo: true
        },
        {
            id: 16,
            name: 'Yoga Flow',
            type: 'Flexibility',
            difficulty: 'Intermediate',
            muscleGroups: ['Full Body'],
            equipment: 'bodyweight',
            hasVideo: true
        },
    ];

    // Combine API exercises with sample data
    const allExercises = [...sampleExercises, ...exercises.map((ex, idx) => ({
        ...ex,
        type: ex.category || 'Strength',
        difficulty: 'Intermediate',
        muscleGroups: ['General'],
        equipment: 'other',
        hasVideo: false
    }))];

    // Filter exercises
    const filteredExercises = allExercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'All' || exercise.type === selectedType;
        const matchesDifficulty = selectedDifficulty === 'All' || exercise.difficulty === selectedDifficulty;
        const matchesEquipment = !selectedEquipment || exercise.equipment?.toLowerCase().includes(selectedEquipment.toLowerCase());
        return matchesSearch && matchesType && matchesDifficulty && matchesEquipment;
    });

    if (loading) {
        return (
            <div className="app-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Loading exercises...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app-content">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-content">
                    <h1 className="page-title">Exercise Library</h1>
                    <p className="page-subtitle">Browse and search exercises by type, difficulty, and muscle group</p>
                </div>
                <div className="page-header-actions">
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        <Plus />
                        {showForm ? 'Cancel' : 'Add Exercise'}
                    </button>
                </div>
            </div>

            {/* Add Exercise Form */}
            {showForm && (
                <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                    <div className="card-header">
                        <h3 className="card-title">Add New Exercise</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2" style={{ gap: 'var(--space-4)' }}>
                                <div className="form-group">
                                    <label className="form-label">Exercise Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newExercise.name}
                                        onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                                        placeholder="e.g., Bench Press"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        value={newExercise.category}
                                        onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
                                    >
                                        <option value="Strength">Strength</option>
                                        <option value="Cardio">Cardio</option>
                                        <option value="Calisthenics">Calisthenics</option>
                                        <option value="Flexibility">Flexibility</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Add Exercise
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body">
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
                            placeholder="Search exercises by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: 'var(--space-12)' }}
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                        <Filter size={18} />
                        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: 0 }}>Filters</h4>
                    </div>

                    {/* Type Filters */}
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)', display: 'block' }}>
                            Type
                        </label>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            {types.map((type) => (
                                <button
                                    key={type}
                                    className={`btn btn-sm ${selectedType === type ? 'btn-primary' : 'btn-ghost'}`}
                                    onClick={() => setSelectedType(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty Filters */}
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)', display: 'block' }}>
                            Difficulty
                        </label>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            {difficulties.map((difficulty) => (
                                <button
                                    key={difficulty}
                                    className={`btn btn-sm ${selectedDifficulty === difficulty ? 'btn-primary' : 'btn-ghost'}`}
                                    onClick={() => setSelectedDifficulty(difficulty)}
                                >
                                    {difficulty}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Muscle Group Filter */}
                    <div>
                        <label className="form-label">Muscle Group</label>
                        <select
                            className="form-select"
                            value={selectedMuscleGroup}
                            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                            style={{ maxWidth: '300px' }}
                        >
                            {muscleGroups.map((group) => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>

                    {/* Equipment Filter */}
                    <div style={{ marginTop: 'var(--space-4)' }}>
                        <label className="form-label">Equipment</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Filter by equipment..."
                            value={selectedEquipment}
                            onChange={(e) => setSelectedEquipment(e.target.value)}
                            style={{ maxWidth: '300px' }}
                        />
                    </div>
                </div>
            </div>

            {/* Exercise Grid */}
            <div className="grid grid-cols-3" style={{ gap: 'var(--space-6)' }}>
                {filteredExercises.map((exercise) => (
                    <div key={exercise.id} className="card" style={{ cursor: 'pointer' }}>
                        {/* Exercise Image/Icon */}
                        <div style={{
                            height: '200px',
                            background: 'var(--bg-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottom: '1px solid var(--border-default)'
                        }}>
                            <Dumbbell size={64} style={{ color: 'var(--text-tertiary)' }} />
                        </div>

                        <div className="card-body">
                            {/* Exercise Name */}
                            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                                {exercise.name}
                            </h3>

                            {/* Type and Difficulty Badges */}
                            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                                <span className="badge badge-primary">{exercise.type}</span>
                                {exercise.difficulty && (
                                    <span className="badge badge-secondary">{exercise.difficulty}</span>
                                )}

                            </div>

                            {/* Muscle Groups */}
                            {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                                <div style={{ marginBottom: 'var(--space-3)' }}>
                                    {exercise.muscleGroups.map((muscle, idx) => (
                                        <span key={idx} className="badge badge-gray" style={{ marginRight: 'var(--space-1)', marginBottom: 'var(--space-1)' }}>
                                            {muscle}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Equipment */}
                            {exercise.equipment && (
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                    <Dumbbell size={12} /> {exercise.equipment}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredExercises.length === 0 && (
                <div className="card">
                    <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                        <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}>
                            <Search size={64} style={{ color: 'var(--text-tertiary)' }} />
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-2)' }}>No exercises found</h3>
                        <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-6)' }}>
                            Try adjusting your filters or search query
                        </p>
                        <button className="btn btn-primary" onClick={() => {
                            setSearchQuery('');
                            setSelectedType('All');
                            setSelectedDifficulty('All');
                            setSelectedEquipment('');
                        }}>
                            Clear Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Exercises;
