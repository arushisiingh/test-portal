import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRegister } from '../api';

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  college: '',
  department: '',
};

function SignupPage({ onRegister }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateField(field, value) {
    setForm(current => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const college = form.college.trim();
    const department = form.department.trim();

    if (!name || !email || !form.password) {
      setError('Please fill in name, email, and password.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiRegister({
        name,
        email,
        password: form.password,
        college,
        department,
      });

      if (!data?.token || !data?.user) {
        throw new Error('Registration response was incomplete');
      }

      sessionStorage.setItem('samagama-token', data.token);
      sessionStorage.setItem('samagama-user-id', data.user._id);
      sessionStorage.setItem('samagama-user:v1', JSON.stringify(data.user));
      onRegister(data.user.role, data.user.email || email, data.user);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logo}>⚡</div>
          <div>
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>Join the Samagama internship portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="signup-name" style={styles.label}>Full Name</label>
            <input
              id="signup-name"
              type="text"
              value={form.name}
              onChange={event => updateField('name', event.target.value)}
              placeholder="Your name"
              style={styles.input}
              autoComplete="name"
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="signup-email" style={styles.label}>Email Address</label>
            <input
              id="signup-email"
              type="email"
              value={form.email}
              onChange={event => updateField('email', event.target.value)}
              placeholder="you@iitrpr.ac.in"
              style={styles.input}
              autoComplete="email"
            />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label htmlFor="signup-college" style={styles.label}>College</label>
              <input
                id="signup-college"
                type="text"
                value={form.college}
                onChange={event => updateField('college', event.target.value)}
                placeholder="IIT Ropar"
                style={styles.input}
                autoComplete="organization"
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="signup-department" style={styles.label}>Department</label>
              <input
                id="signup-department"
                type="text"
                value={form.department}
                onChange={event => updateField('department', event.target.value)}
                placeholder="CSE"
                style={styles.input}
                autoComplete="organization-title"
              />
            </div>
          </div>

          <div style={styles.field}>
            <label htmlFor="signup-password" style={styles.label}>Password</label>
            <input
              id="signup-password"
              type="password"
              value={form.password}
              onChange={event => updateField('password', event.target.value)}
              placeholder="••••••••"
              style={styles.input}
              autoComplete="new-password"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={styles.loginHint}>
          Already registered? <Link to="/login" style={styles.linkBtn}>Sign In →</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at 30% 30%, #1a1040 0%, #0d0d1a 50%, #07090f 100%)',
    position: 'relative',
    overflow: 'hidden',
    padding: '24px',
  },
  orb1: {
    position: 'absolute', top: '-15%', left: '-10%',
    width: 500, height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,111,247,0.18) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute', bottom: '-10%', right: '-5%',
    width: 400, height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative', zIndex: 1,
    width: '100%', maxWidth: 560,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 28,
    padding: '40px 36px',
    display: 'flex', flexDirection: 'column', gap: 24,
    backdropFilter: 'blur(20px)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
  },
  logoWrap: { display: 'flex', alignItems: 'center', gap: 14 },
  logo: {
    width: 48, height: 48,
    borderRadius: 14,
    background: 'linear-gradient(135deg, rgba(124,111,247,0.3), rgba(6,182,212,0.2))',
    border: '1px solid rgba(124,111,247,0.3)',
    display: 'grid', placeItems: 'center',
    fontSize: 22,
  },
  title: {
    margin: 0, fontSize: 22, fontWeight: 800,
    letterSpacing: 0, color: '#eef0f6',
  },
  subtitle: { margin: 0, fontSize: 12, color: '#64748b' },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 },
  label: { fontSize: 12, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.05em' },
  input: {
    width: '100%',
    padding: '12px 14px', borderRadius: 12,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#eef0f6', fontSize: 14,
    outline: 'none', transition: 'border-color 0.2s ease',
  },
  error: { margin: 0, color: '#f87171', fontSize: 13 },
  submitBtn: {
    padding: '14px', borderRadius: 14, border: 'none',
    background: 'linear-gradient(135deg, #7c6ff7, #6d5fd7)',
    color: 'white', fontWeight: 700, fontSize: 15,
    cursor: 'pointer', transition: 'all 0.2s ease',
    boxShadow: '0 4px 20px rgba(124,111,247,0.35)',
  },
  loginHint: { margin: 0, color: '#64748b', fontSize: 12, textAlign: 'center' },
  linkBtn: {
    color: '#7c6ff7',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
  },
};

export default SignupPage;
