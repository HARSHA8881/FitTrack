import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Dumbbell, AlertCircle } from 'lucide-react';
import api from '../api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user || { username: email.split('@')[0], email }));
      navigate('/dashboard');
      window.location.reload(); // Refresh to update navbar
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated Background */}
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="auth-container">
        {/* Logo/Brand */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Dumbbell size={32} style={{ color: 'white' }} />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 0
          }}>
            FitTrack
          </h1>
        </div>

        <div className="auth-header">
          <h2>Welcome Back!</h2>
          <p>Sign in to continue your fitness journey</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <Mail size={16} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
              Email Address
            </label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
              Password
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '24px' }}
          >
            {loading ? (
              <>
                <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup">Create one now</Link>
          </p>
          <p style={{ marginTop: '12px' }}>
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
