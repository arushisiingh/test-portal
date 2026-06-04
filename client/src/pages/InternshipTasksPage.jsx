import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyTasks, submitTask } from '../api';

const PHASE_ORDER = ['bronze', 'silver', 'gold', 'platinum'];
const PHASE_LABELS = { bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum' };
const PHASE_COLORS = { bronze: '#cd7f32', silver: '#c0c0c0', gold: '#ffd700', platinum: '#e5e4e2' };

const STATUS_LABELS = {
  locked: '🔒 Locked',
  available: '📋 Available',
  submitted: '⏳ Submitted',
  graded: '✅ Graded',
};

function TaskCard({ task, onSubmit }) {
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(task.status === 'submitted' || task.status === 'graded');
  const [error, setError] = useState('');

  const isLocked = task.status === 'locked';
  const isSubmitted = submitted || task.status === 'submitted' || task.status === 'graded';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!link.trim()) {
      setError('Please enter a submission link');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const result = await submitTask(task._id, { link: link.trim(), notes: notes.trim() });
      if (result && (result.status || result._id)) {
        setSubmitted(true);
        if (onSubmit) onSubmit(task._id);
      } else {
        setError(result?.error || 'Submission failed');
      }
    } catch (err) {
      setError('Network error — please try again');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{
      ...glass,
      opacity: isLocked ? 0.55 : 1,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {isLocked && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          padding: '6px 12px',
          background: 'rgba(0,0,0,0.5)',
          fontSize: 11,
          color: '#94a3b8',
          textAlign: 'center',
          letterSpacing: '0.06em',
        }}>
          Complete earlier tasks to unlock
        </div>
      )}

      <div style={{ paddingTop: isLocked ? 28 : 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: PHASE_COLORS[task.phase] || '#a78bfa',
              textTransform: 'uppercase',
            }}>
              {PHASE_LABELS[task.phase] || task.phase}
            </span>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.3 }}>
              {task.title}
            </h3>
          </div>
          <span style={{ fontSize: 12, color: isSubmitted ? '#22c55e' : '#94a3b8', whiteSpace: 'nowrap' }}>
            {STATUS_LABELS[task.status] || task.status}
          </span>
        </div>

        <p style={{ margin: '0 0 14px', fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
          {task.description}
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
          {task.spReward > 0 && (
            <span style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700 }}>
              🏆 {task.spReward} SP
            </span>
          )}
          {task.deadline && (
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              📅 Due: {new Date(task.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
          {task.isOptional && (
            <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700 }}>Optional</span>
          )}
        </div>

        {!isLocked && !isSubmitted && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="url"
              placeholder="Submission link (GitHub/Replit/etc.)"
              value={link}
              onChange={e => setLink(e.target.value)}
              style={inputStyle}
              required
            />
            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
            />
            {error && <p style={{ color: '#ef4444', fontSize: 12, margin: 0 }}>{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...submitBtn,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Submitting…' : 'Submit Task'}
            </button>
          </form>
        )}

        {isSubmitted && !isLocked && (
          <div style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 700 }}>
              {task.status === 'graded' ? `✅ Graded: ${task.grade || '—'}` : '⏳ Submitted — awaiting review'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function InternshipTasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterPhase, setFilterPhase] = useState('all');

  useEffect(() => {
    fetchMyTasks()
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setError('Failed to load tasks');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, []);

  const filteredTasks = filterPhase === 'all'
    ? tasks
    : tasks.filter(t => t.phase === filterPhase);

  const byPhase = PHASE_ORDER.reduce((acc, phase) => {
    acc[phase] = filteredTasks.filter(t => t.phase === phase);
    return acc;
  }, {});

  const handleTaskSubmitted = (taskId) => {
    setTasks(prev => prev.map(t =>
      t._id === taskId ? { ...t, status: 'submitted' } : t
    ));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 15% 40%, #12082a 0%, #0d0d1a 45%, #07090f 100%)',
      padding: '24px',
    }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Header */}
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

        {/* Phase filter */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {['all', ...PHASE_ORDER].map(phase => (
            <button
              key={phase}
              onClick={() => setFilterPhase(phase)}
              style={{
                padding: '8px 14px',
                borderRadius: 12,
                border: '1px solid',
                borderColor: filterPhase === phase
                  ? (phase === 'all' ? 'rgba(124,111,247,0.5)' : `${PHASE_COLORS[phase]}55`)
                  : 'rgba(255,255,255,0.08)',
                background: filterPhase === phase
                  ? `rgba(${phase === 'all' ? '124,111,247' : '255,255,255'},0.1)`
                  : 'rgba(255,255,255,0.04)',
                color: filterPhase === phase
                  ? '#fff'
                  : phase === 'all' ? '#a78bfa'
                  : PHASE_COLORS[phase],
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {phase === 'all' ? 'All Phases' : PHASE_LABELS[phase]}
            </button>
          ))}
        </div>

        {/* Loading / Error */}
        {loading && (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: 48 }}>
            Loading tasks…
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', color: '#ef4444', padding: 24 }}>{error}</div>
        )}

        {/* Tasks by phase */}
        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {PHASE_ORDER.map(phase => {
              const phaseTasks = byPhase[phase];
              if (filterPhase !== 'all' && filterPhase !== phase) return null;
              if (!phaseTasks?.length) return null;

              return (
                <section key={phase}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.16em',
                      color: PHASE_COLORS[phase],
                      textTransform: 'uppercase',
                    }}>
                      {PHASE_LABELS[phase]} Phase
                    </span>
                    <div style={{ flex: 1, height: 1, background: `${PHASE_COLORS[phase]}22` }} />
                    <span style={{ fontSize: 11, color: '#64748b' }}>
                      {phaseTasks.filter(t => t.status === 'graded').length}/{phaseTasks.length} done
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: 14,
                  }}>
                    {phaseTasks.map(task => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onSubmit={handleTaskSubmitted}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {filteredTasks.length === 0 && !loading && (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '48px 0' }}>
                No tasks found for this phase.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const glass = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 18,
  backdropFilter: 'blur(16px)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  padding: '18px',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  color: '#f1f5f9',
  padding: '10px 12px',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
};

const submitBtn = {
  padding: '10px 16px',
  borderRadius: 12,
  background: 'linear-gradient(135deg, #7c6ff7, #5b4fd4)',
  border: 'none',
  color: '#fff',
  fontWeight: 800,
  fontSize: 13,
  cursor: 'pointer',
};

export default InternshipTasksPage;