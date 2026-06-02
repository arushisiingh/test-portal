import { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const publicLeaderboardDataByPeriod = {
  'all-time': [
    { rank: 1, name: 'Arjun Kumar', sp: 2850 },
    { rank: 2, name: 'Priya Singh', sp: 2640 },
    { rank: 3, name: 'Raj Patel', sp: 2520 },
    { rank: 4, name: 'Neha Verma', sp: 2380 },
    { rank: 5, name: 'Aditya Sharma', sp: 2250 },
    { rank: 6, name: 'Riya Gupta', sp: 2140 },
    { rank: 7, name: 'Vikram Singh', sp: 2010 },
    { rank: 8, name: 'Anjali Nair', sp: 1920 },
    { rank: 9, name: 'Deepak Roy', sp: 1840 },
    { rank: 10, name: 'Sneha Das', sp: 1760 },
    { rank: 11, name: 'Rohit Joshi', sp: 1680 },
    { rank: 12, name: 'Divya Sharma', sp: 1590 },
  ],
  monthly: [
    { rank: 1, name: 'Arjun Kumar', sp: 740 },
    { rank: 2, name: 'Priya Singh', sp: 690 },
    { rank: 3, name: 'Raj Patel', sp: 655 },
    { rank: 4, name: 'Neha Verma', sp: 612 },
    { rank: 5, name: 'Aditya Sharma', sp: 585 },
    { rank: 6, name: 'Riya Gupta', sp: 552 },
    { rank: 7, name: 'Vikram Singh', sp: 512 },
    { rank: 8, name: 'Anjali Nair', sp: 478 },
    { rank: 9, name: 'Deepak Roy', sp: 452 },
    { rank: 10, name: 'Sneha Das', sp: 430 },
    { rank: 11, name: 'Rohit Joshi', sp: 395 },
    { rank: 12, name: 'Divya Sharma', sp: 372 },
  ],
  weekly: [
    { rank: 1, name: 'Arjun Kumar', sp: 180 },
    { rank: 2, name: 'Priya Singh', sp: 168 },
    { rank: 3, name: 'Raj Patel', sp: 161 },
    { rank: 4, name: 'Neha Verma', sp: 149 },
    { rank: 5, name: 'Aditya Sharma', sp: 141 },
    { rank: 6, name: 'Riya Gupta', sp: 136 },
    { rank: 7, name: 'Vikram Singh', sp: 129 },
    { rank: 8, name: 'Anjali Nair', sp: 121 },
    { rank: 9, name: 'Deepak Roy', sp: 116 },
    { rank: 10, name: 'Sneha Das', sp: 108 },
    { rank: 11, name: 'Rohit Joshi', sp: 101 },
    { rank: 12, name: 'Divya Sharma', sp: 94 },
  ],
};

const studentExtrasByPeriod = {
  'all-time': [
    { rank: 13, name: 'Maya Iyer', sp: 1540, badge: 'Helpful Contributor' },
    { rank: 14, name: 'Kabir Khan', sp: 1485, badge: 'FAQ Expert' },
    { rank: 15, name: 'Ananya Das', sp: 1430, badge: 'Community Helper' },
    { rank: 16, name: 'Dev Malhotra', sp: 1395, badge: 'Top Reviewer' },
    { rank: 17, name: 'Isha Nair', sp: 1335, badge: 'Positive Contributor' },
    { rank: 18, name: 'Arnav Joshi', sp: 1280, badge: 'Mentor Support' },
    { rank: 19, name: 'Pooja Menon', sp: 1220, badge: 'Community Helper' },
    { rank: 20, name: 'Rohan Sen', sp: 1180, badge: 'FAQ Expert' },
  ],
  monthly: [
    { rank: 13, name: 'Maya Iyer', sp: 356, badge: 'Helpful Contributor' },
    { rank: 14, name: 'Kabir Khan', sp: 341, badge: 'FAQ Expert' },
    { rank: 15, name: 'Ananya Das', sp: 330, badge: 'Community Helper' },
    { rank: 16, name: 'Dev Malhotra', sp: 322, badge: 'Top Reviewer' },
    { rank: 17, name: 'Isha Nair', sp: 309, badge: 'Positive Contributor' },
    { rank: 18, name: 'Arnav Joshi', sp: 296, badge: 'Mentor Support' },
    { rank: 19, name: 'Pooja Menon', sp: 284, badge: 'Community Helper' },
    { rank: 20, name: 'Rohan Sen', sp: 271, badge: 'FAQ Expert' },
  ],
  weekly: [
    { rank: 13, name: 'Maya Iyer', sp: 76, badge: 'Helpful Contributor' },
    { rank: 14, name: 'Kabir Khan', sp: 72, badge: 'FAQ Expert' },
    { rank: 15, name: 'Ananya Das', sp: 69, badge: 'Community Helper' },
    { rank: 16, name: 'Dev Malhotra', sp: 66, badge: 'Top Reviewer' },
    { rank: 17, name: 'Isha Nair', sp: 63, badge: 'Positive Contributor' },
    { rank: 18, name: 'Arnav Joshi', sp: 60, badge: 'Mentor Support' },
    { rank: 19, name: 'Pooja Menon', sp: 57, badge: 'Community Helper' },
    { rank: 20, name: 'Rohan Sen', sp: 54, badge: 'FAQ Expert' },
  ],
};

const studentProfileByPeriod = {
  'all-time': {
    rank: 133,
    sp: 177,
    nextRankNeed: 2,
    top50Need: 67,
    badge: 'FAQ Expert',
    summaryLabel: 'All-Time',
  },
  monthly: {
    rank: 48,
    sp: 64,
    nextRankNeed: 3,
    top50Need: 18,
    badge: 'Helpful Contributor',
    summaryLabel: 'Monthly',
  },
  weekly: {
    rank: 16,
    sp: 24,
    nextRankNeed: 1,
    top50Need: 4,
    badge: 'Community Helper',
    summaryLabel: 'Weekly',
  },
};

const filters = [
  { key: 'all-time', label: 'All Time' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'weekly', label: 'Weekly' },
];

function getInitials(name) {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('');
}

function getStudentDisplayName() {
  if (typeof window === 'undefined') return 'Arushi Singh';
  const saved = sessionStorage.getItem('samagama-display-name');
  if (saved) return saved;
  return 'Arushi Singh';
}

function readLeaderboardState(storageKey) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function LeaderboardPage({ variant = 'public' }) {
  const navigate = useNavigate();
  const isStudentView = variant === 'student';
  const studentName = useMemo(() => getStudentDisplayName(), []);
  const storageKey = isStudentView ? 'samagama-leaderboard-student-state' : 'samagama-leaderboard-public-state';

  const [activeFilter, setActiveFilter] = useState(() => readLeaderboardState(storageKey)?.filter || 'all-time');
  const [searchQuery, setSearchQuery] = useState(() => readLeaderboardState(storageKey)?.search || '');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(storageKey, JSON.stringify({ filter: activeFilter, search: searchQuery }));
  }, [activeFilter, searchQuery, storageKey]);

  const studentStats = studentProfileByPeriod[activeFilter];
  const sourceData = isStudentView
    ? [...publicLeaderboardDataByPeriod[activeFilter], ...studentExtrasByPeriod[activeFilter], {
        rank: studentStats.rank,
        name: studentName,
        sp: studentStats.sp,
        badge: studentStats.badge,
        me: true,
      }]
    : publicLeaderboardDataByPeriod[activeFilter] || [];

  const visibleData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return sourceData
      .filter(item => !query || item.name.toLowerCase().includes(query) || (item.badge || '').toLowerCase().includes(query))
      .sort((a, b) => a.rank - b.rank);
  }, [searchQuery, sourceData]);

  const top3 = visibleData.slice(0, 3);
  const hasResults = visibleData.length > 0;
  const leaderboardColumns = isStudentView
    ? ['Rank', 'Name', 'SP Points', 'Badge']
    : ['Rank', 'Name', 'SP Points'];

  const studentCards = isStudentView
    ? [
        { label: 'Your Rank', value: `#${studentStats.rank}` },
        { label: 'Your SP Points', value: `${studentStats.sp}` },
        { label: 'Next Rank', value: `${studentStats.nextRankNeed} SP` },
        { label: 'Top 50 Gap', value: `${studentStats.top50Need} SP` },
      ]
    : [];

  return (
    <div className={`leaderboard-page ${isStudentView ? 'student-mode' : ''}`}>
      <section className="leaderboard-hero leaderboard-surface">
        <div className="hero-content">
          {isStudentView && (
            <div className="leaderboard-back-row">
              <button type="button" className="leaderboard-back-btn" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
              </button>
              <span className="leaderboard-back-copy">Personalized student rankings</span>
            </div>
          )}

          <h1 className="hero-title">Community Leaderboard</h1>
          <p className="hero-sub">
            {isStudentView
              ? 'Track your personal rank, compare contributions, and keep climbing the Samagama leaderboard.'
              : 'Top contributors helping students across Samagama'}
          </p>

          {isStudentView && (
            <div className="student-personal-grid">
              {studentCards.map(card => (
                <article key={card.label} className="student-personal-card">
                  <span className="student-personal-label">{card.label}</span>
                  <strong className="student-personal-value">{card.value}</strong>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="leaderboard-toolbar leaderboard-surface">
        <div className="search-bar-wrapper">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder={isStudentView ? 'Search user, badge, or your name' : 'Search contributor by name'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="leaderboard-toolbar-row">
          <div className="filter-chips" role="tablist" aria-label="Leaderboard period">
            {filters.map(filter => (
              <button
                key={filter.key}
                type="button"
                className={`filter-chip ${activeFilter === filter.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.key)}
                aria-pressed={activeFilter === filter.key}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {isStudentView && (
            <div className="leaderboard-toolbar-note">
              Your row is highlighted automatically, and your view stays saved when you come back.
            </div>
          )}
        </div>
      </section>

      <section className="podium-section">
        <div className="section-heading">
          <h2 className="section-title">Top 3 Contributors</h2>
          <p className="section-subtitle">
            A clean look at the leaders for the selected period.
          </p>
        </div>

        <div className="podium-container">
          {[
            { podiumClass: 'silver', item: top3[1] },
            { podiumClass: 'gold', item: top3[0] },
            { podiumClass: 'bronze', item: top3[2] },
          ].map(({ podiumClass, item }) => {
            if (!item) return null;

            return (
              <article key={`${item.rank}-${item.name}`} className={`podium-card ${podiumClass}`}>
                <div className="rank-chip">#{item.rank}</div>
                <div className="podium-avatar" aria-hidden="true">
                  {getInitials(item.name)}
                </div>
                <div className="podium-info">
                  <h3>{item.name}</h3>
                  <p className="podium-sp">{item.sp} SP Points</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="table-section leaderboard-surface">
        <div className="section-heading compact">
          <h2 className="section-title">Leaderboard</h2>
          <p className="section-subtitle">
            Rankings based on SP points for the selected period.
          </p>
        </div>

        <div className="table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                {leaderboardColumns.map(column => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hasResults ? (
                visibleData.map(item => (
                  <tr key={`${activeFilter}-${item.rank}-${item.name}`} className={item.me ? 'leaderboard-row-you' : ''}>
                    <td className="rank-cell">#{item.rank}</td>
                    <td className="user-cell">
                      <span className="user-avatar">{getInitials(item.name)}</span>
                      <span className="user-name">
                        {item.name}
                        {item.me && <span className="leaderboard-you-badge">You</span>}
                      </span>
                    </td>
                    <td className="sp-cell">{item.sp}</td>
                    {isStudentView && (
                      <td className="badge-cell">
                        {item.me ? (
                          <span className="badge-pill featured">{item.badge}</span>
                        ) : (
                          <span className="badge-pill">{item.badge || '—'}</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isStudentView ? 4 : 3}>
                    <div className="leaderboard-empty-state">
                      No contributors matched your search.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="leaderboard-bottom">
        {isStudentView ? (
          <article className="cta-card leaderboard-surface student-cta">
            <div className="cta-copy">
              <span className="cta-kicker">Your contribution snapshot</span>
              <h2 className="section-title">Know Your Rank</h2>
              <p className="section-subtitle">
                Here&apos;s your current SP standing for the selected period.
              </p>
            </div>

            <div className="cta-stats signed-in">
              <div className="cta-stat">
                <span className="cta-stat-label">Your SP Points</span>
                <strong className="cta-stat-value">{studentStats.sp}</strong>
              </div>
              <div className="cta-stat">
                <span className="cta-stat-label">Your Rank</span>
                <strong className="cta-stat-value">#{studentStats.rank}</strong>
              </div>
              <div className="cta-stat">
                <span className="cta-stat-label">Next Rank</span>
                <strong className="cta-stat-value">Need {studentStats.nextRankNeed} SP</strong>
              </div>
              <div className="cta-stat">
                <span className="cta-stat-label">Top 50 Gap</span>
                <strong className="cta-stat-value">Need {studentStats.top50Need} SP</strong>
              </div>
            </div>

            <div className="cta-status-row student-footer-actions">
              <span className="cta-status-label">Status</span>
              <span className="cta-status-pill">Active · {studentStats.summaryLabel}</span>
              <div className="student-footer-buttons">
                <button type="button" className="student-footer-btn" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </button>
                <NavLink to="/student/spurti-points" className="student-footer-btn student-footer-btn-secondary">
                  View Spurti Points
                </NavLink>
              </div>
            </div>
          </article>
        ) : (
          <article className="cta-card leaderboard-surface">
            <div className="cta-copy">
              <span className="cta-kicker">Private leaderboard details</span>
              <h2 className="section-title">Want to know your rank?</h2>
              <p className="section-subtitle">
                Sign in to view your SP Points, rank, achievements, and contribution history.
              </p>
            </div>

            <NavLink to="/login" className="cta-button">
              Sign In Here
            </NavLink>
          </article>
        )}
      </section>
    </div>
  );
}

export default LeaderboardPage;
