import { useEffect, useMemo, useState } from 'react';
import { createAnnouncement, getAnnouncements, getPinnedAnnouncement, setAnnouncementPinned } from '../announcements';
import { createInternshipTask, getInternshipTasks, getTaskSummary } from '../internshipTasks';
import { getJourneyMilestone, getJourneyPendingReviews, issueJourneyOfferLetter, reviewJourneySubmission } from '../internshipJourney';
import { decideAdminTeam, fetchAdminTeams } from '../api';

/* ── Shared glass helpers (matching StudentDashboard) ──────────────────────────── */
function glassCard(style = {}) {
  return {
    background: `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 20,
    backdropFilter: 'blur(16px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
    padding: '24px',
    ...style,
  };
}

function SectionTitle({ icon, label, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        <span style={{ marginRight: 8, fontSize: 16 }}>{icon}</span>{label}
      </h3>
      {action && <span style={{ fontSize: 12, color: '#64748b' }}>{action}</span>}
    </div>
  );
}

function StatCard({ label, value, icon, trend }) {
  return (
    <div style={glassCard({ minWidth: 160 })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        {trend && <span style={{ fontSize: 12, color: trend > 0 ? '#10b981' : '#ef4444' }}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94a3b8' }}>{label}</div>
    </div>
  );
}

/* ── Main Admin Dashboard ──────────────────────────────────────────── */
export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [announcementItems, setAnnouncementItems] = useState(() => getAnnouncements());
  const [announcementDraft, setAnnouncementDraft] = useState({
    title: '',
    message: '',
    category: 'Announcement',
    priority: 'Medium',
    attachmentLink: '',
    attachmentLabel: 'Attachment',
    pinned: true,
  });
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [pinConflict, setPinConflict] = useState(null);
  const [taskItems, setTaskItems] = useState(() => getInternshipTasks());
  const [journeyReviews, setJourneyReviews] = useState(() => getJourneyPendingReviews());
  const [offerLetterMessage, setOfferLetterMessage] = useState('');
  const [teamItems, setTeamItems] = useState([]);
  const [teamMessage, setTeamMessage] = useState('');
  const [taskDraft, setTaskDraft] = useState({
    title: '',
    description: '',
    category: 'General',
    deadline: '',
    priority: 'Medium',
    attachmentLink: '',
    slots: '',
  });
  const [taskMessage, setTaskMessage] = useState('');
  const [journeySearch, setJourneySearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [students, setStudents] = useState([
    { id: 1, name: 'Arjun Singh', email: 'arjun@iitropar.ac.in', sp: 450, status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Priya Sharma', email: 'priya@iitropar.ac.in', sp: 320, status: 'active', joinDate: '2024-02-10' },
    { id: 3, name: 'Rahul Patel', email: 'rahul@iitropar.ac.in', sp: 180, status: 'inactive', joinDate: '2024-03-05' },
  ]);

  const [applications, setApplications] = useState([
    { id: 1, student: 'Arjun Singh', status: 'verified', date: '2024-05-15' },
    { id: 2, student: 'Priya Sharma', status: 'pending', date: '2024-05-16' },
    { id: 3, student: 'Rahul Patel', status: 'rejected', date: '2024-05-14' },
  ]);

  const [nocQueue, setNocQueue] = useState([
    { id: 1, student: 'Neha Gupta', submitted: '2024-05-15', status: 'pending' },
    { id: 2, student: 'Vikram Kumar', submitted: '2024-05-14', status: 'verified' },
  ]);
  const taskSummary = getTaskSummary(taskItems);
  const offerLetterMilestone = getJourneyMilestone(6);
  const leaderboardStudents = useMemo(
    () => [...students].sort((a, b) => (b.sp || 0) - (a.sp || 0)),
    [students],
  );
  const filteredLeaderboardStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
    if (!query) return leaderboardStudents;
    return leaderboardStudents.filter(student => [
      student.name,
      student.email,
      student.status,
      student.id,
      student.sp,
    ].filter(Boolean).join(' ').toLowerCase().includes(query));
  }, [leaderboardStudents, studentSearch]);
  const topThreeStudents = filteredLeaderboardStudents.slice(0, 3);
  const studentTotals = useMemo(() => ({
    total: students.length,
    active: students.filter(student => student.status === 'active').length,
    inactive: students.filter(student => student.status !== 'active').length,
    average: students.length ? Math.round(students.reduce((sum, student) => sum + Number(student.sp || 0), 0) / students.length) : 0,
  }), [students]);
  const filteredJourneyReviews = journeyReviews.filter(item => {
    const haystack = [
      item.milestoneTitle,
      item.submittedBy,
      item.comment,
      item.category,
      item.id,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(journeySearch.trim().toLowerCase());
  });

  function handleIssueOfferLetter() {
    issueJourneyOfferLetter({
      issuedBy: 'Samagama Admin Team',
      remarks: 'Offer letter issued from the admin dashboard.',
      fileName: offerLetterMilestone?.data?.fileName || 'Vicharanashala_Offer_Letter.pdf',
    });
    setOfferLetterMessage('Offer letter issued successfully.');
    window.setTimeout(() => setOfferLetterMessage(''), 1800);
  }

  const stats = [
    { label: 'Total Students', value: '2,840', icon: '👥', trend: 12 },
    { label: 'Active Now', value: '642', icon: '🟢', trend: 8 },
    { label: 'Applications', value: '98%', icon: '📋', trend: 15 },
    { label: 'Avg SP Points', value: '385', icon: '⚡', trend: 22 },
  ];

  useEffect(() => {
    function syncAnnouncements() {
      setAnnouncementItems(getAnnouncements());
    }

    function syncTasks() {
      setTaskItems(getInternshipTasks());
    }

    function syncJourney() {
      setJourneyReviews(getJourneyPendingReviews());
    }

    async function syncTeams() {
      try {
        const data = await fetchAdminTeams();
        setTeamItems(Array.isArray(data) ? data : []);
      } catch {
        setTeamItems([]);
      }
    }

    window.addEventListener('samagama-announcements-updated', syncAnnouncements);
    window.addEventListener('samagama-tasks-updated', syncTasks);
    window.addEventListener('samagama-journey-updated', syncJourney);
    window.addEventListener('samagama-teams-updated', syncTeams);
    window.addEventListener('storage', syncAnnouncements);
    window.addEventListener('storage', syncTasks);
    window.addEventListener('storage', syncJourney);
    window.addEventListener('storage', syncTeams);
    syncTeams();
    const teamInterval = window.setInterval(syncTeams, 20000);
    return () => {
      window.removeEventListener('samagama-announcements-updated', syncAnnouncements);
      window.removeEventListener('samagama-tasks-updated', syncTasks);
      window.removeEventListener('samagama-journey-updated', syncJourney);
      window.removeEventListener('samagama-teams-updated', syncTeams);
      window.removeEventListener('storage', syncAnnouncements);
      window.removeEventListener('storage', syncTasks);
      window.removeEventListener('storage', syncJourney);
      window.removeEventListener('storage', syncTeams);
      window.clearInterval(teamInterval);
    };
  }, []);

  function refreshAnnouncementItems() {
    setAnnouncementItems(getAnnouncements());
  }

  function handlePublishAnnouncement(event) {
    event.preventDefault();
    if (!announcementDraft.title.trim() || !announcementDraft.message.trim()) return;

    const existingPinned = getPinnedAnnouncement(getAnnouncements());
    if (announcementDraft.pinned && existingPinned) {
      setPinConflict({
        mode: 'publish',
        existingPinned,
        draft: { ...announcementDraft },
      });
      return;
    }

    const next = createAnnouncement({
      title: announcementDraft.title,
      message: announcementDraft.message,
      category: announcementDraft.category,
      priority: announcementDraft.priority,
      attachmentLink: announcementDraft.attachmentLink,
      attachmentLabel: announcementDraft.attachmentLabel,
      pinned: announcementDraft.pinned,
      replacePinned: announcementDraft.pinned,
      postedBy: 'Samagama Admin Team',
    });

    setAnnouncementItems(next);
    setAnnouncementDraft({
      title: '',
      message: '',
      category: 'Announcement',
      priority: 'Medium',
      attachmentLink: '',
      attachmentLabel: 'Attachment',
      pinned: true,
    });
    setAnnouncementMessage('Announcement published successfully.');
    setTimeout(() => setAnnouncementMessage(''), 1800);
  }

  function resetAnnouncementDraft() {
    setAnnouncementDraft({
      title: '',
      message: '',
      category: 'Announcement',
      priority: 'Medium',
      attachmentLink: '',
      attachmentLabel: 'Attachment',
      pinned: true,
    });
  }

  function finalizePublishAnnouncement({ replacePinned = false } = {}) {
    const next = createAnnouncement({
      title: announcementDraft.title,
      message: announcementDraft.message,
      category: announcementDraft.category,
      priority: announcementDraft.priority,
      attachmentLink: announcementDraft.attachmentLink,
      attachmentLabel: announcementDraft.attachmentLabel,
      pinned: announcementDraft.pinned,
      replacePinned,
      postedBy: 'Samagama Admin Team',
    });

    setAnnouncementItems(next);
    resetAnnouncementDraft();
    setAnnouncementMessage('Announcement published successfully.');
    setTimeout(() => setAnnouncementMessage(''), 1800);
  }

  function handleReplacePinnedAnnouncement() {
    if (!pinConflict) return;

    if (pinConflict.mode === 'publish') {
      finalizePublishAnnouncement({ replacePinned: true });
    } else if (pinConflict.mode === 'toggle') {
      setAnnouncementPinned(pinConflict.targetId, true, { replacePinned: true });
      refreshAnnouncementItems();
    }

    setPinConflict(null);
  }

  function handleCancelPinnedReplacement() {
    setPinConflict(null);
  }

  function handlePublishTask(event) {
    event.preventDefault();
    if (!taskDraft.title.trim() || !taskDraft.description.trim() || !taskDraft.deadline) return;

    const next = createInternshipTask({
      title: taskDraft.title,
      description: taskDraft.description,
      category: taskDraft.category,
      deadline: taskDraft.deadline,
      priority: taskDraft.priority,
      attachmentLink: taskDraft.attachmentLink,
      slots: taskDraft.slots.split(',').map(slot => slot.trim()).filter(Boolean),
    });
    setTaskItems(next);
    setTaskDraft({
      title: '',
      description: '',
      category: 'General',
      deadline: '',
      priority: 'Medium',
      attachmentLink: '',
      slots: '',
    });
    setTaskMessage('Internship task assigned successfully.');
    setTimeout(() => setTaskMessage(''), 1800);
  }

  function handleJourneyReview(reviewId, decision) {
    reviewJourneySubmission(reviewId, decision, decision === 'approved' ? 'Approved by admin moderation.' : 'Please revise and resubmit.');
    setJourneyReviews(getJourneyPendingReviews());
  }

  async function handleTeamDecision(teamId, action) {
    try {
      const response = await decideAdminTeam(teamId, action);
      if (response?.error) throw new Error(response.error);
      setTeamItems(prev => prev.map(item => (item._id === teamId ? { ...item, ...response } : item)));
      setTeamMessage(action === 'approve' ? 'Team approved successfully.' : 'Team rejected successfully.');
      window.dispatchEvent(new Event('samagama-teams-updated'));
      window.setTimeout(() => setTeamMessage(''), 2000);
    } catch (error) {
      setTeamMessage(error?.message || 'Unable to update team status.');
      window.setTimeout(() => setTeamMessage(''), 2000);
    }
  }

  return (
    <div style={styles.dashboard}>
      {/* Cosmic background */}
      <div style={styles.cosmicBg1} />
      <div style={styles.cosmicBg2} />

      <div style={styles.container}>
        {/* ═══ Dashboard Overview ═══════════════════════════ */}
        {activeSection === 'overview' && (
          <>
            <div style={styles.headerSection}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff' }}>Dashboard Overview</h2>
              <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 14 }}>Monitor platform activity, student progress, and critical operations</p>
            </div>

            <div style={styles.statsGrid}>
              {stats.map((s, i) => (
                <StatCard key={i} {...s} />
              ))}
            </div>

            <div style={styles.gridRow}>
              <div style={glassCard({ flex: 1 })}>
                <SectionTitle icon="📢" label="Recent Announcements" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[...announcementItems]
                    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.dateTime) - new Date(a.dateTime))
                    .slice(0, 4)
                    .map(a => (
                    <div key={a.id} style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', gap: 12, border: a.pinned ? '1px solid rgba(124,111,247,0.22)' : '1px solid transparent' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{a.title}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(a.dateTime))}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {a.pinned && (
                          <span style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(251,191,36,0.15)', fontSize: 11, color: '#fde68a' }}>
                            Pinned
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (a.pinned) {
                              setAnnouncementPinned(a.id, false);
                              refreshAnnouncementItems();
                              return;
                            }

                            const currentPinned = getPinnedAnnouncement(getAnnouncements());
                            if (currentPinned && currentPinned.id !== a.id) {
                              setPinConflict({
                                mode: 'toggle',
                                existingPinned: currentPinned,
                                targetId: a.id,
                              });
                              return;
                            }

                            setAnnouncementPinned(a.id, true, { replacePinned: true });
                            refreshAnnouncementItems();
                          }}
                          style={{
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: a.pinned ? 'rgba(239,68,68,0.12)' : 'rgba(124,111,247,0.12)',
                            color: a.pinned ? '#fecaca' : '#e9d5ff',
                            borderRadius: 10,
                            padding: '8px 10px',
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        >
                          {a.pinned ? 'Unpin' : 'Pin'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={glassCard({ flex: 1 })}>
                <SectionTitle icon="📢" label="Publish Announcement" />
                <form onSubmit={handlePublishAnnouncement} style={{ display: 'grid', gap: 12 }}>
                  <input
                    value={announcementDraft.title}
                    onChange={e => setAnnouncementDraft(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Title"
                  />
                  <textarea
                    value={announcementDraft.message}
                    onChange={e => setAnnouncementDraft(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Message"
                    rows="5"
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <select value={announcementDraft.category} onChange={e => setAnnouncementDraft(prev => ({ ...prev, category: e.target.value }))}>
                      {['Announcement', 'Meeting', 'Internship', 'NOC', 'Certificate', 'SP Points', 'Important'].map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <select value={announcementDraft.priority} onChange={e => setAnnouncementDraft(prev => ({ ...prev, priority: e.target.value }))}>
                      {['Low', 'Medium', 'High'].map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    value={announcementDraft.attachmentLink}
                    onChange={e => setAnnouncementDraft(prev => ({ ...prev, attachmentLink: e.target.value }))}
                    placeholder="Attachment Link (optional)"
                  />
                  <input
                    value={announcementDraft.attachmentLabel}
                    onChange={e => setAnnouncementDraft(prev => ({ ...prev, attachmentLabel: e.target.value }))}
                    placeholder="Attachment Label"
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#cbd5e1', fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={announcementDraft.pinned}
                      onChange={e => setAnnouncementDraft(prev => ({ ...prev, pinned: e.target.checked }))}
                      style={{ width: 16, height: 16 }}
                    />
                    Pin Announcement
                  </label>
                  <button className="primary-btn" type="submit">Publish</button>
                  {announcementMessage && (
                    <div style={{ padding: 12, borderRadius: 12, background: 'rgba(16,185,129,0.14)', color: '#a7f3d0' }}>
                      {announcementMessage}
                    </div>
                  )}
                </form>
              </div>
            </div>

            <div style={{ ...styles.gridRow, marginTop: 20 }}>
              <div style={glassCard({ flex: 1 })}>
                <SectionTitle icon="📋" label="Assign Internship Task" />
                <form onSubmit={handlePublishTask} style={{ display: 'grid', gap: 12 }}>
                  <input
                    value={taskDraft.title}
                    onChange={e => setTaskDraft(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Task Title"
                  />
                  <textarea
                    value={taskDraft.description}
                    onChange={e => setTaskDraft(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description"
                    rows="4"
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <select value={taskDraft.category} onChange={e => setTaskDraft(prev => ({ ...prev, category: e.target.value }))}>
                      {['General', 'Project', 'NOC', 'Meeting', 'Setup', 'Internship'].map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <select value={taskDraft.priority} onChange={e => setTaskDraft(prev => ({ ...prev, priority: e.target.value }))}>
                      {['Low', 'Medium', 'High'].map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="date"
                    value={taskDraft.deadline}
                    onChange={e => setTaskDraft(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                  <input
                    value={taskDraft.attachmentLink}
                    onChange={e => setTaskDraft(prev => ({ ...prev, attachmentLink: e.target.value }))}
                    placeholder="Attachment / Link (optional)"
                  />
                  <input
                    value={taskDraft.slots}
                    onChange={e => setTaskDraft(prev => ({ ...prev, slots: e.target.value }))}
                    placeholder="Slots (optional, comma separated)"
                  />
                  <button className="primary-btn" type="submit">Assign Task</button>
                  {taskMessage && (
                    <div style={{ padding: 12, borderRadius: 12, background: 'rgba(16,185,129,0.14)', color: '#a7f3d0' }}>
                      {taskMessage}
                    </div>
                  )}
                </form>
              </div>

              <div style={glassCard({ flex: 1 })}>
                <SectionTitle icon="📊" label="Task Summary" action={`${taskSummary.total} tasks`} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginBottom: 14 }}>
                  {[
                    { label: 'Total', value: taskSummary.total },
                    { label: 'Pending', value: taskSummary.pending },
                    { label: 'Completed', value: taskSummary.completed },
                    { label: 'Missed', value: taskSummary.missed },
                  ].map(item => (
                    <div key={item.label} style={{ padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{item.label}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 6 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 330, overflowY: 'auto', paddingRight: 4 }}>
                  {[...taskItems].slice(0, 5).map(task => (
                    <div key={task.id} style={{ padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{task.title}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{task.category} · Due {task.deadline}</div>
                        </div>
                        <div style={{ fontSize: 12, color: '#c4b5fd', fontWeight: 700 }}>{task.priority}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {pinConflict && (
              <div style={styles.modalBackdrop} onClick={handleCancelPinnedReplacement}>
                <div style={styles.pinModal} onClick={event => event.stopPropagation()}>
                  <div style={styles.pinModalHeader}>
                    <div>
                      <div style={styles.pinModalKicker}>Pinned announcement conflict</div>
                      <h3 style={styles.pinModalTitle}>Replace current pinned announcement?</h3>
                    </div>
                    <button type="button" onClick={handleCancelPinnedReplacement} style={styles.pinModalClose}>✕</button>
                  </div>
                  <p style={styles.pinModalText}>
                    Only one pinned announcement can stay at the top. Replace the current pinned item with the new one, or cancel and keep the existing pin.
                  </p>
                  <div style={styles.pinModalPreview}>
                    <div style={styles.pinModalPreviewLabel}>Current pinned</div>
                    <strong style={styles.pinModalPreviewTitle}>{pinConflict.existingPinned?.title}</strong>
                  </div>
                  <div style={styles.pinModalActions}>
                    <button type="button" onClick={handleCancelPinnedReplacement} style={styles.pinCancelBtn}>
                      Cancel
                    </button>
                    <button type="button" onClick={handleReplacePinnedAnnouncement} style={styles.pinReplaceBtn}>
                      Replace Pin
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ═══ Student Management ════════════════════════════ */}
        {activeSection === 'students' && (
          <>
            <div style={styles.headerSection}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff' }}>Student Management</h2>
              <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 14 }}>Track student profiles, SP Points, and account activity</p>
            </div>

            <div style={glassCard()}>
              <SectionTitle icon="👥" label="Active Students" action={`${students.length} total`} />
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Email</th>
                      <th style={{ textAlign: 'center', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>SP Points</th>
                      <th style={{ textAlign: 'center', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '12px 0', color: '#fff' }}>{s.name}</td>
                        <td style={{ padding: '12px 0', color: '#94a3b8' }}>{s.email}</td>
                        <td style={{ padding: '12px 0', textAlign: 'center', color: '#fbbf24' }}>⚡ {s.sp}</td>
                        <td style={{ padding: '12px 0', textAlign: 'center' }}>
                          <span style={{ padding: '4px 8px', borderRadius: 6, background: s.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)', fontSize: 12, color: s.status === 'active' ? '#6ee7b7' : '#9ca3af' }}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ═══ Leaderboard ══════════════════════════════════ */}
        {activeSection === 'leaderboard' && (
          <>
            <div style={styles.headerSection}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff' }}>Student Leaderboard</h2>
              <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 14 }}>View all students ranked by SP Points and contribution status</p>
            </div>

            <div style={styles.leaderboardSummaryGrid}>
              <div style={glassCard()}>
                <SectionTitle icon="🏆" label="Leaderboard Summary" />
                <div style={styles.leaderboardStats}>
                  <div style={styles.leaderStat}><strong>{studentTotals.total}</strong><span>Total Students</span></div>
                  <div style={styles.leaderStat}><strong>{studentTotals.active}</strong><span>Active</span></div>
                  <div style={styles.leaderStat}><strong>{studentTotals.inactive}</strong><span>Inactive</span></div>
                  <div style={styles.leaderStat}><strong>{studentTotals.average}</strong><span>Avg SP</span></div>
                </div>
              </div>

              <div style={glassCard()}>
                <SectionTitle icon="🔎" label="Search Students" action={`${filteredLeaderboardStudents.length} shown`} />
                <input
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  placeholder="Search by name, email, status, or SP points..."
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#e2e8f0',
                    padding: '12px 14px',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginTop: 14 }}>
                  {topThreeStudents.map((student, index) => (
                    <div key={student.id} style={{
                      padding: 14,
                      borderRadius: 16,
                      background: index === 0 ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
                      border: index === 0 ? '1px solid rgba(59,130,246,0.24)' : '1px solid rgba(255,255,255,0.08)',
                    }}>
                      <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>#{index + 1}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginTop: 8 }}>{student.name}</div>
                      <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>{student.email}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#fbbf24', marginTop: 8 }}>⚡ {student.sp}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={glassCard({ marginTop: 20 })}>
              <SectionTitle icon="📋" label="All Students" action="Ranked by SP Points" />
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Rank</th>
                      <th style={{ textAlign: 'left', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Email</th>
                      <th style={{ textAlign: 'center', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>SP Points</th>
                      <th style={{ textAlign: 'center', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaderboardStudents.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '18px 0', color: '#94a3b8', textAlign: 'center' }}>
                          No students match your search.
                        </td>
                      </tr>
                    ) : filteredLeaderboardStudents.map((student, index) => (
                      <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '12px 0', color: index < 3 ? '#fbbf24' : '#e2e8f0', fontWeight: 800 }}>#{index + 1}</td>
                        <td style={{ padding: '12px 0', color: '#fff', fontWeight: 700 }}>{student.name}</td>
                        <td style={{ padding: '12px 0', color: '#94a3b8' }}>{student.email}</td>
                        <td style={{ padding: '12px 0', textAlign: 'center', color: '#fbbf24', fontWeight: 800 }}>⚡ {student.sp}</td>
                        <td style={{ padding: '12px 0', textAlign: 'center' }}>
                          <span style={{ padding: '4px 8px', borderRadius: 6, background: student.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)', fontSize: 12, color: student.status === 'active' ? '#6ee7b7' : '#9ca3af' }}>
                            {student.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 0', color: '#94a3b8' }}>
                          {student.joinDate ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(student.joinDate)) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ═══ Applications ══════════════════════════════════ */}
        {activeSection === 'applications' && (
          <>
            <div style={styles.headerSection}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff' }}>Internship Applications</h2>
              <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 14 }}>Review and manage student internship applications</p>
            </div>

            <div style={glassCard({ marginBottom: 20 })}>
              <SectionTitle icon="📨" label="Offer Letter Management" action={offerLetterMilestone?.data?.issuedAt ? 'Issued' : 'Awaiting issue'} />
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Download Offer Letter</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                      {offerLetterMilestone?.data?.issuedAt
                        ? `Issued on ${new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(offerLetterMilestone.data.issuedAt))}`
                        : 'Locked until admin issues the offer letter.'}
                    </div>
                  </div>
                  <span style={{
                    padding: '6px 10px',
                    borderRadius: 999,
                    background: offerLetterMilestone?.data?.issuedAt ? 'rgba(34,197,94,0.14)' : 'rgba(107,114,128,0.16)',
                    border: offerLetterMilestone?.data?.issuedAt ? '1px solid rgba(34,197,94,0.22)' : '1px solid rgba(107,114,128,0.22)',
                    color: offerLetterMilestone?.data?.issuedAt ? '#86efac' : '#cbd5e1',
                    fontSize: 12,
                    fontWeight: 800,
                  }}>
                    {offerLetterMilestone?.data?.issuedAt ? 'Issued' : 'Locked'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <button
                    type="button"
                    onClick={handleIssueOfferLetter}
                    style={{
                      border: '1px solid rgba(59,130,246,0.22)',
                      background: 'linear-gradient(135deg, rgba(124,111,247,0.16), rgba(56,189,248,0.14))',
                      color: '#e0e7ff',
                      borderRadius: 12,
                      padding: '10px 14px',
                      fontWeight: 800,
                    }}
                  >
                    {offerLetterMilestone?.data?.issuedAt ? 'Reissue Offer Letter' : 'Issue Offer Letter'}
                  </button>
                </div>
                {offerLetterMessage && (
                  <div style={{ color: '#a7f3d0', fontSize: 13, fontWeight: 700 }}>
                    {offerLetterMessage}
                  </div>
                )}
              </div>
            </div>

            <div style={glassCard()}>
              <SectionTitle icon="📝" label="Application Status" />
              <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <div style={{ flex: 1, padding: 12, background: 'rgba(16,185,129,0.1)', borderRadius: 12, border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981' }}>98%</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Verification Rate</div>
                </div>
                <div style={{ flex: 1, padding: 12, background: 'rgba(245,158,11,0.1)', borderRadius: 12, border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>{applications.filter(a => a.status === 'pending').length}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Pending Review</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {applications.map(app => (
                  <div key={app.id} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{app.student}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Applied {app.date}</div>
                    </div>
                    <span style={{ padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: app.status === 'verified' ? 'rgba(16,185,129,0.15)' : app.status === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', color: app.status === 'verified' ? '#6ee7b7' : app.status === 'pending' ? '#fbbf24' : '#f87171' }}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ═══ Teams ═══════════════════════════════════════ */}
        {activeSection === 'teams' && (
          <>
            <div style={styles.headerSection}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff' }}>Project Teams</h2>
              <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 14 }}>Monitor team formation, approvals, invitations, and progress</p>
            </div>

            <div style={glassCard()}>
              <SectionTitle icon="👥" label="All Teams" action={`${teamItems.length} teams`} />
              {teamMessage && (
                <div style={{ padding: 12, borderRadius: 12, background: 'rgba(16,185,129,0.14)', color: '#a7f3d0', marginBottom: 14 }}>
                  {teamMessage}
                </div>
              )}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Team</th>
                      <th style={{ textAlign: 'left', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Leader</th>
                      <th style={{ textAlign: 'center', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Members</th>
                      <th style={{ textAlign: 'center', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Pending Invites</th>
                      <th style={{ textAlign: 'center', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Join Requests</th>
                      <th style={{ textAlign: 'center', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Accepted / Rejected</th>
                      <th style={{ textAlign: 'center', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Created</th>
                      <th style={{ textAlign: 'right', padding: '12px 0', color: '#94a3b8', fontWeight: 600 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamItems.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ padding: '18px 0', color: '#94a3b8', textAlign: 'center' }}>
                          No project teams yet.
                        </td>
                      </tr>
                    ) : teamItems.map(team => (
                      <tr key={team._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '12px 0', color: '#fff', fontWeight: 700 }}>
                          {team.name}
                          <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>{team.domain}</div>
                        </td>
                        <td style={{ padding: '12px 0', color: '#e2e8f0' }}>{team.leaderName || team.leaderId}</td>
                        <td style={{ padding: '12px 0', textAlign: 'center', color: '#fbbf24' }}>{team.memberCount || 0}</td>
                        <td style={{ padding: '12px 0', textAlign: 'center', color: '#93c5fd' }}>{team.pendingInviteCount || 0}</td>
                        <td style={{ padding: '12px 0', textAlign: 'center', color: '#c4b5fd' }}>{Array.isArray(team.joinRequests) ? team.joinRequests.length : 0}</td>
                        <td style={{ padding: '12px 0', textAlign: 'center', color: '#e9d5ff' }}>
                          {team.acceptedMemberCount || 1} / {team.rejectedMemberCount || 0}
                        </td>
                        <td style={{ padding: '12px 0', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: 999,
                            background: team.status === 'active'
                              ? 'rgba(16,185,129,0.15)'
                              : team.status === 'rejected'
                                ? 'rgba(239,68,68,0.15)'
                                : 'rgba(251,191,36,0.15)',
                            fontSize: 12,
                            color: team.status === 'active'
                              ? '#6ee7b7'
                              : team.status === 'rejected'
                                ? '#f87171'
                                : '#fbbf24',
                            fontWeight: 700,
                          }}>
                            {team.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 0', color: '#94a3b8' }}>
                          {team.createdAt ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(team.createdAt)) : '—'}
                        </td>
                        <td style={{ padding: '12px 0', textAlign: 'right' }}>
                          {team.status !== 'active' ? (
                            <div style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              <button type="button" onClick={() => handleTeamDecision(team._id, 'approve')} style={{
                                border: '1px solid rgba(16,185,129,0.22)',
                                background: 'rgba(16,185,129,0.12)',
                                color: '#a7f3d0',
                                borderRadius: 10,
                                padding: '8px 10px',
                                fontSize: 11,
                                fontWeight: 800,
                              }}>
                                Approve
                              </button>
                              <button type="button" onClick={() => handleTeamDecision(team._id, 'reject')} style={{
                                border: '1px solid rgba(239,68,68,0.22)',
                                background: 'rgba(239,68,68,0.12)',
                                color: '#fecaca',
                                borderRadius: 10,
                                padding: '8px 10px',
                                fontSize: 11,
                                fontWeight: 800,
                              }}>
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: 12 }}>Monitored</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ═══ Moderation ════════════════════════════════════ */}
        {activeSection === 'moderation' && (
          <>
            <div style={styles.headerSection}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff' }}>Community Moderation</h2>
              <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 14 }}>Review milestone submissions, approvals, and student journey updates</p>
            </div>

            <div style={glassCard()}>
              <SectionTitle icon="🛡️" label="Journey Review Queue" action={`${filteredJourneyReviews.length} pending`} />
              <div style={{ marginBottom: 14 }}>
                <input
                  value={journeySearch}
                  onChange={e => setJourneySearch(e.target.value)}
                  placeholder="Search student name, milestone, or submission ID..."
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#e2e8f0',
                    padding: '12px 14px',
                    outline: 'none',
                  }}
                />
              </div>
              {filteredJourneyReviews.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                  <p style={{ fontSize: 14 }}>📭 No milestone submissions pending review</p>
                  <p style={{ fontSize: 12, marginTop: 8, color: '#64748b' }}>Approval actions will appear here when students submit a reviewable milestone.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {filteredJourneyReviews.map(item => (
                    <div key={item.id} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', display: 'grid', gap: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{item.milestoneTitle}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                            {item.category} · {item.submittedBy || 'Student'} · Submitted {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.submittedAt))}
                          </div>
                        </div>
                        <span style={{ padding: '6px 10px', borderRadius: 999, background: 'rgba(124,111,247,0.14)', border: '1px solid rgba(124,111,247,0.22)', color: '#c4b5fd', fontSize: 12, fontWeight: 800 }}>
                          Pending Review
                        </span>
                      </div>
                      {item.comment && <div style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{item.comment}</div>}
                      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                        <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
                          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Student</div>
                          <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, marginTop: 4 }}>{item.submittedBy || 'Student'}</div>
                        </div>
                        <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
                          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Uploaded File</div>
                          <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, marginTop: 4 }}>
                            {item.files?.[0]?.name || item.data?.fileName || 'No file attached'}
                          </div>
                        </div>
                        <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
                          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Submitted Link</div>
                          <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, marginTop: 4, wordBreak: 'break-all' }}>
                            {item.links?.[0] || item.data?.submittedLink || 'No link attached'}
                          </div>
                        </div>
                        {item.milestoneId === 4 && (
                          <>
                            <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
                              <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Start Date</div>
                              <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, marginTop: 4 }}>
                                {item.data?.startDate ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(item.data.startDate)) : '—'}
                              </div>
                            </div>
                            <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
                              <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>End Date</div>
                              <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, marginTop: 4 }}>
                                {item.data?.endDate ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(item.data.endDate)) : '—'}
                              </div>
                            </div>
                            <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)' }}>
                              <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Duration</div>
                              <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, marginTop: 4 }}>
                                {item.data?.durationDays ? `${item.data.durationDays} days` : '—'}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      {(item.files?.[0]?.previewUrl || item.data?.submittedFilePreview) && (
                        <a
                          href={item.files?.[0]?.previewUrl || item.data?.submittedFilePreview}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#93c5fd', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
                        >
                          Download / view uploaded file →
                        </a>
                      )}
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleJourneyReview(item.id, 'approved')}
                          style={{
                            border: '1px solid rgba(16,185,129,0.22)',
                            background: 'rgba(16,185,129,0.12)',
                            color: '#a7f3d0',
                            borderRadius: 12,
                            padding: '10px 14px',
                            fontWeight: 800,
                          }}
                          >
                            Approve
                          </button>
                        <button
                          type="button"
                          onClick={() => handleJourneyReview(item.id, 'needs_changes')}
                          style={{
                            border: '1px solid rgba(251,191,36,0.22)',
                            background: 'rgba(251,191,36,0.12)',
                            color: '#fde68a',
                            borderRadius: 12,
                            padding: '10px 14px',
                            fontWeight: 800,
                          }}
                        >
                          Needs Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleJourneyReview(item.id, 'rejected')}
                          style={{
                            border: '1px solid rgba(239,68,68,0.22)',
                            background: 'rgba(239,68,68,0.12)',
                            color: '#fecaca',
                            borderRadius: 12,
                            padding: '10px 14px',
                            fontWeight: 800,
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══ Analytics ════════════════════════════════════ */}
        {activeSection === 'analytics' && (
          <>
            <div style={styles.headerSection}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff' }}>Analytics & Reports</h2>
              <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 14 }}>Track engagement, participation, and platform growth</p>
            </div>

            <div style={styles.gridRow}>
              <div style={glassCard({ flex: 1 })}>
                <SectionTitle icon="📈" label="Student Engagement" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: '#94a3b8', fontSize: 12 }}>Daily Active Users</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>642 / 2,840</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: '22%', height: '100%', background: '#7c6ff7', borderRadius: 999 }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: '#94a3b8', fontSize: 12 }}>Questions Solved</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>9,400 / 12,000</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: '78%', height: '100%', background: '#10b981', borderRadius: 999 }} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={glassCard({ flex: 1 })}>
                <SectionTitle icon="🎯" label="Key Metrics" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>Avg Response Time</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 4 }}>2.3 hours</div>
                  </div>
                  <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>Contribution Rate</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 4 }}>340+ active</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══ Navigation Menu ═══════════════════════════════ */}
        <div style={styles.navMenu}>
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'students', label: 'Students', icon: '👥' },
              { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
              { id: 'applications', label: 'Applications', icon: '📋' },
              { id: 'teams', label: 'Teams', icon: '🧑‍🤝‍🧑' },
              { id: 'moderation', label: 'Moderation', icon: '🛡️' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
            ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                ...styles.navBtn,
                ...(activeSection === item.id ? styles.navBtnActive : {}),
              }}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  dashboard: {
    minHeight: '100vh',
    background: '#07090f',
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: 80,
  },
  cosmicBg1: {
    position: 'fixed',
    top: '10%',
    left: '5%',
    width: 600,
    height: 600,
    background: 'radial-gradient(circle, rgba(124,111,247,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  cosmicBg2: {
    position: 'fixed',
    bottom: '15%',
    right: '10%',
    width: 400,
    height: 400,
    background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '40px 20px',
    position: 'relative',
    zIndex: 1,
  },
  headerSection: {
    marginBottom: 32,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    marginBottom: 32,
  },
  leaderboardSummaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: 20,
    marginBottom: 20,
  },
  leaderboardStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 12,
  },
  leaderStat: {
    padding: 14,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'grid',
    gap: 6,
  },
  leaderboardStatLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 700,
  },
  leaderboardStatValue: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 800,
  },
  gridRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: 20,
  },
  navMenu: {
    position: 'fixed',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 8,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 8,
    backdropFilter: 'blur(16px)',
    zIndex: 50,
  },
  navBtn: {
    padding: '8px 14px',
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 10,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.2s ease',
  },
  navBtnActive: {
    background: 'rgba(124,111,247,0.15)',
    color: '#a5b4fc',
    border: '1px solid rgba(124,111,247,0.3)',
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(3, 7, 18, 0.72)',
    backdropFilter: 'blur(10px)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 200,
    padding: 20,
  },
  pinModal: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 24,
    background: 'linear-gradient(180deg, rgba(15,20,40,0.98), rgba(8,11,22,0.98))',
    border: '1px solid rgba(124,111,247,0.18)',
    boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
    padding: 22,
  },
  pinModalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  pinModalKicker: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#a5b4fc',
    fontWeight: 800,
    marginBottom: 8,
  },
  pinModalTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: '#f8fafc',
    letterSpacing: '-0.03em',
  },
  pinModalClose: {
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#cbd5e1',
    width: 36,
    height: 36,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
  },
  pinModalText: {
    margin: '14px 0 16px',
    color: '#cbd5e1',
    lineHeight: 1.6,
    fontSize: 14,
  },
  pinModalPreview: {
    padding: 14,
    borderRadius: 18,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 18,
  },
  pinModalPreviewLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#94a3b8',
    fontWeight: 700,
  },
  pinModalPreviewTitle: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: 700,
  },
  pinModalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    flexWrap: 'wrap',
  },
  pinCancelBtn: {
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#e2e8f0',
    borderRadius: 14,
    padding: '11px 16px',
    fontWeight: 800,
  },
  pinReplaceBtn: {
    border: '1px solid rgba(124,111,247,0.25)',
    background: 'linear-gradient(135deg, #7c6ff7, #3b82f6)',
    color: '#fff',
    borderRadius: 14,
    padding: '11px 16px',
    fontWeight: 800,
    boxShadow: '0 18px 30px rgba(124,111,247,0.18)',
  },
};
