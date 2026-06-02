import { useNavigate } from 'react-router-dom';
import { InternshipTasks } from './StudentDashboard';

function InternshipTasksPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 15% 40%, #12082a 0%, #0d0d1a 45%, #07090f 100%)',
      padding: '24px',
    }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '14px 18px',
          borderRadius: 18,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 10px 28px rgba(0,0,0,0.22)',
          color: '#eef0f6',
        }}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              color: '#e2e8f0',
              borderRadius: 14,
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ← Back to Dashboard
          </button>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>Internship Tasks</div>
          <div style={{ width: 126 }} />
        </div>

        <InternshipTasks />
      </div>
    </div>
  );
}

export default InternshipTasksPage;
