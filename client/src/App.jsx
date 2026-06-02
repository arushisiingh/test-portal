import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FaqPage from './pages/FaqPage';
import DoubtPage from './pages/DoubtPage';
import YakshaPage from './pages/YakshaPage';
import LeaderboardPage from './pages/LeaderboardPage';
import OverviewPage from './pages/OverviewPage';
import SpurtiPointsPage from './pages/SpurtiPointsPage';
import CommunityHubPage from './pages/CommunityHubPage';
import InternshipTasksPage from './pages/InternshipTasksPage';
import AuthContext from './authContext';
import './index.css';

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState(null); // null = logged out, 'student', 'admin'
  const [authLoaded, setAuthLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function deriveDisplayName(selectedRole, email) {
    if (selectedRole === 'admin') return 'Samagama Admin Team';

    const localPart = (email || '').split('@')[0].trim();
    if (!localPart) return 'Arushi Singh';

    const normalized = localPart.replace(/[._-]+/g, ' ').trim();
    if (!normalized || normalized.length < 3) return 'Arushi Singh';

    if (/^(student|demo|test|user)$/i.test(normalized)) return 'Arushi Singh';

    const titleCased = normalized
      .split(/\s+/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');

    return titleCased.length >= 5 ? titleCased : 'Arushi Singh';
  }

  useEffect(() => {
    const savedRole = sessionStorage.getItem('samagama-role');
    if (savedRole) setUser(savedRole);
    setAuthLoaded(true);
  }, []);

  function handleLogin(selectedRole, email) {
    setUser(selectedRole);
    sessionStorage.setItem('samagama-role', selectedRole);
    sessionStorage.setItem('samagama-email', email || '');
    sessionStorage.setItem('samagama-display-name', deriveDisplayName(selectedRole, email));
    if (selectedRole === 'admin') navigate('/admin');
    else navigate('/dashboard');
  }

  function handleLogout() {
    setUser(null);
    sessionStorage.removeItem('samagama-role');
    sessionStorage.removeItem('samagama-email');
    navigate('/');
  }

  const isHome = location.pathname === '/';
  const isLogin = location.pathname === '/login';
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAdmin = location.pathname.startsWith('/admin');

  // Global header — shown on all non-homepage, non-dashboard pages
  const showGlobalHeader = !isHome && !isLogin && !isDashboard && !isAdmin;

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      <div className="app-shell">

        {/* ── Homepage Header ───────────────────────────── */}
        {isHome && (
          <header className="home-header">
            <div className="brand-wrap">
              <span className="brand">Samagama</span>
            </div>
            <nav className="nav-links">
              {user ? (
                <button onClick={handleLogout} className="sign-btn ghost">Sign Out</button>
              ) : (
                <NavLink to="/login" className="sign-btn">Sign In</NavLink>
              )}
            </nav>
          </header>
        )}

        {/* ── Login Page — no header needed ─────────────── */}

        {/* ── Admin Dashboard Header ────────────────────── */}
        {isAdmin && (
          <header className="dash-header">
            <div className="brand-wrap">
              <span className="brand">Samagama</span>
              <span className="badge admin">Admin Portal</span>
            </div>
            <nav className="nav-links">
              <button onClick={handleLogout} className="sign-btn ghost">Sign Out</button>
            </nav>
          </header>
        )}

        <main className={isHome ? 'page-container home-container' : 'page-container'}>
          {!authLoaded ? (
            <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', color: '#94a3b8' }}>
              Loading community portal...
            </div>
          ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={user ? <Navigate to={user === 'admin' ? '/admin' : '/dashboard'} /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/dashboard" element={user === 'student' ? <StudentDashboard /> : <Navigate to="/" />} />
            <Route path="/admin" element={user === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/doubts" element={<DoubtPage user={user} />} />
            <Route path="/yaksha" element={<YakshaPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/student/leaderboard" element={user === 'student' ? <LeaderboardPage variant="student" /> : <Navigate to="/" />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/student/spurti-points" element={user === 'student' ? <SpurtiPointsPage /> : <Navigate to="/" />} />
            <Route path="/student/tasks" element={user === 'student' ? <InternshipTasksPage /> : <Navigate to="/" />} />
            <Route
              path="/community-hub"
              element={
                <RouteErrorBoundary
                  fallback={
                    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center', gap: 12, color: '#eef0f6' }}>
                      <div>
                        <h2 style={{ margin: 0, fontSize: 28 }}>Community Hub</h2>
                        <p style={{ margin: '10px 0 0', color: '#94a3b8' }}>We hit a rendering issue while loading the discussion hub.</p>
                        <button
                          type="button"
                          onClick={() => navigate('/dashboard')}
                          style={{
                            marginTop: 18,
                            border: 'none',
                            borderRadius: 14,
                            padding: '12px 16px',
                            background: 'linear-gradient(135deg, #7c6ff7, #38bdf8)',
                            color: '#fff',
                            fontWeight: 800,
                          }}
                        >
                          Back to Dashboard
                        </button>
                      </div>
                    </div>
                  }
                >
                  <CommunityHubPage />
                </RouteErrorBoundary>
              }
            />
          </Routes>
          )}
        </main>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
