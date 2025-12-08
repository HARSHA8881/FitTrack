import { Link } from 'react-router-dom';
import { TrendingUp, Target, Zap, Shield, Heart } from 'lucide-react';

function Landing() {
    const features = [
        {
            icon: <Target size={32} />,
            title: 'Workout Logging',
            description: 'Log exercises with sets, reps, weight, and duration. Never forget your previous workout weights again.',
            gradient: '#0EA5E9'
        },
        {
            icon: <TrendingUp size={32} />,
            title: 'Progress Tracking',
            description: 'Visual charts showing strength gains, workout frequency calendar, and personal records for each exercise.',
            gradient: '#0EA5E9'
        },
        {
            icon: <Target size={32} />,
            title: 'Exercise Library',
            description: 'Predefined list of common exercises with the ability to add your own custom exercises.',
            gradient: '#0EA5E9'
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
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--space-6)',
                        fontSize: '3.5rem',
                        fontWeight: 800,
                        color: 'white',
                        fontFamily: 'var(--font-heading)'
                    }}>
                        FitTrack
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
                            Start Free Today
                        </Link>
                        <Link to="/login" className="btn btn-secondary btn-lg" style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '2px solid white' }}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: 'var(--space-16) var(--space-8)', background: 'var(--bg-secondary)'}}>
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
                                color: 'var(--primary-400)',
                                marginBottom: 'var(--space-3)'
                            }}>
                                100%
                            </div>
                            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                                Free Forever
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                No fees, no premium
                            </p>
                        </div>

                        <div className="stat-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                            <div style={{
                                fontSize: 'clamp(3rem, 6vw, 4rem)',
                                fontWeight: 900,
                                color: 'var(--primary-400)',
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
                                color: 'var(--primary-400)',
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
                background: '#0EA5E9',
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
                        Join thousands of people tracking their progress with FitTrack
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
            </footer>
        </div>
    );
}

export default Landing;
