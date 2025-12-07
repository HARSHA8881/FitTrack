import { Link } from 'react-router-dom';
import { Dumbbell, TrendingUp, Target, Zap, Shield, Activity, Rocket, Hand, Heart } from 'lucide-react';

function Landing() {
    const features = [
        {
            icon: <Dumbbell size={32} />,
            title: 'Workout Logging',
            description: 'Log exercises with sets, reps, weight, and duration. Never forget your previous workout weights again.',
            gradient: 'linear-gradient(135deg, var(--primary-400) 0%, var(--primary-600) 100%)'
        },
        {
            icon: <TrendingUp size={32} />,
            title: 'Progress Tracking',
            description: 'Visual charts showing strength gains, workout frequency calendar, and personal records for each exercise.',
            gradient: 'linear-gradient(135deg, var(--secondary-400) 0%, var(--secondary-600) 100%)'
        },
        {
            icon: <Target size={32} />,
            title: 'Exercise Library',
            description: 'Predefined list of common exercises with the ability to add your own custom exercises.',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        },
        {
            icon: <Activity size={32} />,
            title: 'Smart Analytics',
            description: 'Get insights into your workout patterns, track your streaks, and monitor your fitness journey.',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        },
        {
            icon: <Shield size={32} />,
            title: 'Secure & Private',
            description: 'Your data is encrypted and secure. JWT authentication ensures your workouts stay private.',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
        },
        {
            icon: <Zap size={32} />,
            title: 'Lightning Fast',
            description: 'Built with modern technologies for a smooth, responsive experience on any device.',
            gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
        }
    ];

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>

                <div className="hero-content">
                    {/* Logo */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 'var(--radius-2xl)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--space-6)',
                        border: '2px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <Dumbbell size={48} style={{ color: 'white' }} />
                    </div>

                    <h1 className="hero-title">
                        Transform Your Fitness Journey
                    </h1>
                    <p className="hero-subtitle">
                        Track your workouts, monitor progress, and achieve your fitness goals with FitTrack -
                        the ultimate free platform for serious athletes and fitness enthusiasts.
                    </p>
                    <div className="hero-cta">
                        <Link to="/signup" className="btn btn-primary btn-lg" style={{ background: 'white', color: 'var(--primary-400)' }}>
                            <Rocket size={20} /> Start Free Today
                        </Link>
                        <Link to="/login" className="btn btn-secondary btn-lg" style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '2px solid white' }}>
                            <Hand size={20} /> Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: 'var(--space-16) var(--space-8)', background: 'var(--bg-secondary)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                        <h2 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 800,
                            marginBottom: 'var(--space-4)',
                            color: 'var(--text-primary)'
                        }}>
                            Why Choose FitTrack?
                        </h2>
                        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                            Everything you need to track and improve your fitness
                        </p>
                    </div>

                    <div className="grid grid-cols-3" style={{ gap: 'var(--space-8)' }}>
                        {features.map((feature, index) => (
                            <div key={index} className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: feature.gradient,
                                    borderRadius: 'var(--radius-xl)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--space-6)',
                                    color: 'white'
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{ padding: 'var(--space-16) var(--space-8)', background: 'var(--bg-primary)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="grid grid-cols-3" style={{ gap: 'var(--space-8)' }}>
                        <div className="stat-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                            <div style={{
                                fontSize: 'clamp(3rem, 6vw, 4rem)',
                                fontWeight: 900,
                                background: 'linear-gradient(135deg, var(--primary-400) 0%, var(--secondary-400) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: 'var(--space-3)'
                            }}>
                                100%
                            </div>
                            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                                Free Forever
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                No hidden fees, no premium tiers
                            </p>
                        </div>

                        <div className="stat-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                            <div style={{
                                fontSize: 'clamp(3rem, 6vw, 4rem)',
                                fontWeight: 900,
                                background: 'linear-gradient(135deg, var(--primary-400) 0%, var(--secondary-400) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: 'var(--space-3)'
                            }}>
                                ∞
                            </div>
                            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                                Unlimited Workouts
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                Log as many workouts as you want
                            </p>
                        </div>

                        <div className="stat-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                            <div style={{
                                fontSize: 'clamp(3rem, 6vw, 4rem)',
                                fontWeight: 900,
                                background: 'linear-gradient(135deg, var(--primary-400) 0%, var(--secondary-400) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: 'var(--space-3)'
                            }}>
                                24/7
                            </div>
                            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                                Always Available
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                Access your data anytime, anywhere
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: 'var(--space-16) var(--space-8)',
                background: 'linear-gradient(135deg, var(--primary-400) 0%, var(--secondary-400) 100%)',
                textAlign: 'center',
                color: 'white'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 900,
                        marginBottom: 'var(--space-6)',
                        color: 'white'
                    }}>
                        Ready to Transform Your Fitness?
                    </h2>
                    <p style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-8)', color: 'rgba(255,255,255,0.95)' }}>
                        Join thousands of athletes tracking their progress with FitTrack
                    </p>
                    <Link
                        to="/signup"
                        className="btn btn-lg"
                        style={{
                            background: 'white',
                            color: 'var(--primary-400)',
                            padding: 'var(--space-5) var(--space-12)',
                            fontSize: 'var(--text-lg)'
                        }}
                    >
                        <Zap size={20} /> Get Started Now
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: 'var(--space-8)',
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-default)',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
                        © 2024 FitTrack. Built with <Heart size={16} style={{ color: 'var(--error)' }} /> for fitness enthusiasts.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-6)', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="#" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
                            Privacy Policy
                        </a>
                        <a href="#" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
                            Terms of Service
                        </a>
                        <a href="#" style={{ color: 'var(--text-tertiary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
                            Contact
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
