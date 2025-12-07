import { useState, useEffect } from 'react';
import { Calendar, Trash2, Target, BarChart2, Award, TrendingUp, Search, Filter, SortAsc, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';

function Progress() {
    const [activeTab, setActiveTab] = useState('weight');
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTimeRange, setSelectedTimeRange] = useState('3M');

    // Search, Filter, Sort, Pagination state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, value-desc, value-asc
    const [filterMetricType, setFilterMetricType] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Form state
    const [formData, setFormData] = useState({
        metricType: 'weight',
        value: '',
        unit: 'kg',
        notes: '',
        recordedAt: new Date().toISOString().split('T')[0]
    });

    const tabs = [
        { id: 'weight', label: 'Weight', metricType: 'weight', unit: 'kg' },
        { id: 'body-composition', label: 'Body Composition', metricType: 'body_fat', unit: '%' },
        { id: 'measurements', label: 'Measurements', metricType: 'waist', unit: 'cm' },
        { id: 'vitals', label: 'Vitals', metricType: 'heart_rate', unit: 'bpm' },
    ];

    const timeRanges = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];

    const metricTypeOptions = {
        weight: [
            { value: 'weight', label: 'Weight (kg)', unit: 'kg' }
        ],
        'body-composition': [
            { value: 'body_fat', label: 'Body Fat %', unit: '%' },
            { value: 'muscle_mass', label: 'Muscle Mass (kg)', unit: 'kg' }
        ],
        measurements: [
            { value: 'chest', label: 'Chest (cm)', unit: 'cm' },
            { value: 'waist', label: 'Waist (cm)', unit: 'cm' },
            { value: 'hips', label: 'Hips (cm)', unit: 'cm' },
            { value: 'arms', label: 'Arms (cm)', unit: 'cm' },
            { value: 'thighs', label: 'Thighs (cm)', unit: 'cm' }
        ],
        vitals: [
            { value: 'heart_rate', label: 'Heart Rate (bpm)', unit: 'bpm' },
            { value: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg' }
        ]
    };

    useEffect(() => {
        fetchMetrics();
    }, [activeTab]);

    useEffect(() => {
        // Update form when tab changes
        const currentTab = tabs.find(t => t.id === activeTab);
        const options = metricTypeOptions[activeTab];
        if (options && options.length > 0) {
            setFormData(prev => ({
                ...prev,
                metricType: options[0].value,
                unit: options[0].unit
            }));
        }
    }, [activeTab]);

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            const currentTab = tabs.find(t => t.id === activeTab);
            const response = await api.get('/users/body-metrics', {
                params: {
                    metricType: currentTab?.metricType,
                    limit: 50
                }
            });
            setMetrics(response.data);
        } catch (error) {
            console.error('Error fetching metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/body-metrics', formData);
            setFormData(prev => ({
                ...prev,
                value: '',
                notes: '',
                recordedAt: new Date().toISOString().split('T')[0]
            }));
            fetchMetrics();
        } catch (error) {
            console.error('Error logging metric:', error);
            alert('Failed to log metric');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                await api.delete(`/users/body-metrics/${id}`);
                setMetrics(metrics.filter(m => m.id !== id));
            } catch (error) {
                console.error('Error deleting metric:', error);
            }
        }
    };

    const handleMetricTypeChange = (e) => {
        const selectedValue = e.target.value;
        const options = metricTypeOptions[activeTab];
        const selectedOption = options.find(opt => opt.value === selectedValue);

        setFormData(prev => ({
            ...prev,
            metricType: selectedValue,
            unit: selectedOption?.unit || prev.unit
        }));
    };

    // Get unique metric types from all metrics
    const allMetricTypes = ['All', ...new Set(metrics.map(m => m.metricType).filter(Boolean))];

    // Filter metrics based on search and metric type
    const filteredMetrics = metrics.filter(metric => {
        const matchesSearch = !searchQuery ||
            (metric.notes && metric.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
            metric.metricType.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMetricType = filterMetricType === 'All' || metric.metricType === filterMetricType;
        return matchesSearch && matchesMetricType;
    });

    // Sort metrics
    const sortedMetrics = [...filteredMetrics].sort((a, b) => {
        switch (sortBy) {
            case 'date-desc':
                return new Date(b.recordedAt) - new Date(a.recordedAt);
            case 'date-asc':
                return new Date(a.recordedAt) - new Date(b.recordedAt);
            case 'value-desc':
                return parseFloat(b.value) - parseFloat(a.value);
            case 'value-asc':
                return parseFloat(a.value) - parseFloat(b.value);
            default:
                return 0;
        }
    });

    // Pagination
    const totalPages = Math.ceil(sortedMetrics.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMetrics = sortedMetrics.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterMetricType, sortBy, activeTab]);

    const calculateStats = () => {
        if (metrics.length === 0) {
            return {
                current: '0.0',
                starting: '0.0',
                change: '0.0',
                best: '0.0'
            };
        }

        const values = metrics.map(m => parseFloat(m.value));
        const current = values[0] || 0;
        const starting = values[values.length - 1] || 0;
        const change = starting !== 0 ? (((current - starting) / starting) * 100).toFixed(1) : '0.0';
        const best = Math.min(...values);

        return {
            current: current.toFixed(1),
            starting: starting.toFixed(1),
            change: change,
            best: best.toFixed(1)
        };
    };

    const stats = calculateStats();
    const currentUnit = formData.unit;

    const metricStats = [
        { label: 'Current', value: stats.current, unit: currentUnit, icon: Target },
        { label: 'Starting', value: stats.starting, unit: currentUnit, icon: BarChart2 },
        { label: 'Change', value: `${stats.change}%`, icon: TrendingUp, color: parseFloat(stats.change) > 0 ? 'positive' : parseFloat(stats.change) < 0 ? 'negative' : 'neutral' },
        { label: 'Best', value: stats.best, unit: currentUnit, icon: Award },
    ];

    return (
        <div className="app-content">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-content">
                    <h1 className="page-title">Progress</h1>
                    <p className="page-subtitle">Track your fitness metrics</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <div className="tabs-list">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tabs-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3" style={{ gap: 'var(--space-6)' }}>
                {/* Left Column - Log Metric Form */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Log Metric</h3>
                        <p className="card-description">Record your measurements</p>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            {/* Metric Selector */}
                            <div className="form-group">
                                <label className="form-label">Metric</label>
                                <select
                                    className="form-select"
                                    value={formData.metricType}
                                    onChange={handleMetricTypeChange}
                                >
                                    {metricTypeOptions[activeTab]?.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date Picker */}
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={formData.recordedAt}
                                    onChange={(e) => setFormData({ ...formData, recordedAt: e.target.value })}
                                />
                            </div>

                            {/* Value Input */}
                            <div className="form-group">
                                <label className="form-label">Value ({currentUnit})</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Enter value"
                                    step="0.1"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Notes */}
                            <div className="form-group">
                                <label className="form-label">Notes (Optional)</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Add any observations..."
                                    rows="3"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                <Calendar />
                                Log Entry
                            </button>
                        </form>
                    </div>

                    {/* Recent Entries */}
                    <div className="card-footer">
                        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                            Recent Entries
                        </h4>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--text-tertiary)' }}>
                                Loading...
                            </div>
                        ) : metrics.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-tertiary)' }}>
                                No entries yet
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {metrics.slice(0, 5).map((metric) => (
                                    <div key={metric.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 'var(--space-3)',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: 'var(--text-sm)'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                {metric.value} {metric.unit}
                                            </div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                                {new Date(metric.recordedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => handleDelete(metric.id)}
                                            style={{ color: 'var(--error)', padding: 'var(--space-1)' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Chart and Stats */}
                <div style={{ gridColumn: 'span 2' }}>
                    {/* Weight Trend Card */}
                    <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 className="card-title">Metric Trend</h3>
                                <p className="card-description">{metrics.length} entries in selected time range</p>
                            </div>

                            {/* Time Range Filters */}
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                {timeRanges.map((range) => (
                                    <button
                                        key={range}
                                        className={`btn btn-sm ${selectedTimeRange === range ? 'btn-primary' : 'btn-ghost'}`}
                                        onClick={() => setSelectedTimeRange(range)}
                                        style={{ minWidth: '45px' }}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="card-body">
                            {/* Empty State or Chart */}
                            <div style={{
                                minHeight: '300px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-lg)',
                                color: 'var(--text-tertiary)'
                            }}>
                                {metrics.length === 0 ? 'No data available for this time range' : 'Chart visualization coming soon'}
                            </div>
                        </div>
                    </div>

                    {/* Metric Stats Grid */}
                    <div className="grid grid-cols-4" style={{ gap: 'var(--space-4)' }}>
                        {metricStats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-card-header">
                                    <div className="stat-card-title">{stat.label}</div>
                                    <div className="stat-card-icon primary">
                                        <stat.icon size={20} />
                                    </div>
                                </div>
                                <div className="stat-card-value">
                                    {stat.value} {stat.unit && <span style={{ fontSize: 'var(--text-base)', fontWeight: 500 }}>{stat.unit}</span>}
                                </div>
                                {stat.color && (
                                    <div className={`stat-card-change ${stat.color}`}>
                                        {stat.color === 'positive' ? '↑' : stat.color === 'negative' ? '↓' : '→'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* All Metrics Section with Search, Filter, Sort, and Pagination */}
            <div style={{ marginTop: 'var(--space-6)' }}>
                {/* Search, Filter, and Sort Controls */}
                <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                    <div className="card-header">
                        <h3 className="card-title">All Metrics History</h3>
                        <p className="card-description">View and manage all your recorded metrics</p>
                    </div>
                    <div className="card-body">
                        <div className="grid grid-cols-4" style={{ gap: 'var(--space-4)', alignItems: 'end' }}>
                            {/* Search */}
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Search</label>
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
                                        placeholder="Search notes or type..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ paddingLeft: 'var(--space-12)' }}
                                    />
                                </div>
                            </div>

                            {/* Filter by Metric Type */}
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">
                                    <Filter size={14} style={{ display: 'inline', marginRight: 'var(--space-1)' }} />
                                    Metric Type
                                </label>
                                <select
                                    className="form-select"
                                    value={filterMetricType}
                                    onChange={(e) => setFilterMetricType(e.target.value)}
                                >
                                    {allMetricTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
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
                                    <option value="value-desc">Value (Highest)</option>
                                    <option value="value-asc">Value (Lowest)</option>
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
                            Showing {paginatedMetrics.length > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, sortedMetrics.length)} of {sortedMetrics.length} metrics
                            {searchQuery && ` (filtered from ${metrics.length} total)`}
                        </div>
                    </div>
                </div>

                {/* Metrics List */}
                <div className="card">
                    <div className="card-body">
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)' }}>
                                Loading...
                            </div>
                        ) : paginatedMetrics.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)' }}>
                                {searchQuery || filterMetricType !== 'All' ? 'No metrics match your filters.' : 'No metrics recorded yet.'}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {paginatedMetrics.map((metric) => (
                                    <div key={metric.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 'var(--space-4)',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-default)'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                                                <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>
                                                    {metric.value} {metric.unit}
                                                </div>
                                                <span className="badge badge-primary">{metric.metricType}</span>
                                            </div>
                                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                                                {new Date(metric.recordedAt).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            {metric.notes && (
                                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                                                    {metric.notes}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => handleDelete(metric.id)}
                                            style={{ color: 'var(--error)' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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
        </div>
    );
}

export default Progress;
