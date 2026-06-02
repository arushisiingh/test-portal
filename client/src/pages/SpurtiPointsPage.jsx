import { useContext, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthContext from '../authContext';

const glass = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 22,
  backdropFilter: 'blur(18px)',
  boxShadow: '0 12px 32px rgba(0,0,0,0.28)',
};

const tabs = ['SP Statement', 'Achievements', 'Badges', 'Leaderboard'];

const statementRows = [
  { date: '01 Jun', credit: '+10', debit: '', balance: '120', reason: 'Accepted Answer' },
  { date: '01 Jun', credit: '+5', debit: '', balance: '125', reason: 'Helpful Contribution' },
  { date: '02 Jun', credit: '', debit: '-2', balance: '123', reason: 'Spam / Duplicate' },
  { date: '03 Jun', credit: '+15', debit: '', balance: '138', reason: 'FAQ Contribution' },
  { date: '04 Jun', credit: '+8', debit: '', balance: '146', reason: 'Review Assistance' },
  { date: '05 Jun', credit: '', debit: '-4', balance: '142', reason: 'Late Response Adjustment' },
];

const achievements = [
  { title: 'FAQ Expert', level: 'Earned' },
  { title: 'Helpful Contributor', level: 'Earned' },
  { title: 'Top Reviewer', level: 'In progress' },
  { title: 'Positive Contributor', level: 'Earned' },
];

const badgeChips = ['FAQ Expert', 'Helpful Contributor', 'Top Reviewer', 'Positive Contributor', 'Community Helper'];

const leaderboardTop = [
  { rank: '🥇', name: 'Priya Sharma', sp: '4,210' },
  { rank: '🥈', name: 'Arjun Mehta', sp: '3,870' },
  { rank: '🥉', name: 'Sneha Reddy', sp: '3,540' },
];

const leaderboardList = [
  { rank: 4, name: 'Rahul Verma', sp: '3,220', badge: 'FAQ Expert' },
  { rank: 5, name: 'Ananya Iyer', sp: '3,105', badge: 'Helpful Contributor' },
  { rank: 6, name: 'Karan Patel', sp: '2,990', badge: 'Top Reviewer' },
  { rank: 7, name: 'Meera Nair', sp: '2,870', badge: 'Community Helper' },
];

function SpurtiPointsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('SP Statement');
  const [search, setSearch] = useState('');

  if (user !== 'student') {
    return <Navigate to="/dashboard" replace />;
  }

  const filteredStatements = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return statementRows;
    return statementRows.filter(row =>
      [row.date, row.credit, row.debit, row.balance, row.reason].some(value =>
        String(value).toLowerCase().includes(query),
      ),
    );
  }, [search]);

  const chartPoints = '50,170 110,145 170,150 230,112 290,124 350,92 410,80 470,110 530,76 590,64 650,54';

  return (
    <div style={page}>
      <div style={bgOrbA} />
      <div style={bgOrbB} />

      <div style={inner}>
        <header style={hero}>
          <button type="button" onClick={() => navigate('/dashboard')} style={backBtn}>
            ← Back to Dashboard
          </button>

          <div style={heroCenter}>
            <div style={eyebrow}>SPURTI POINTS BANK</div>
            <h1 style={title}>Student Name</h1>
            <p style={subtitle}>Track every credit, debit, rank change, and achievement in one place.</p>
          </div>

          <div style={summaryCard}>
            <span style={summaryLabel}>Current SP Points</span>
            <strong style={summaryValue}>177</strong>
            <span style={summaryLabel}>Current Rank</span>
            <strong style={summaryValue}>#133</strong>
          </div>
        </header>

        <section style={statsGrid}>
          <article style={card}>
            <SectionHeading title="Current Standing" />
            <div style={cardStack}>
              <LineItem label="Current Rank" value="#133" />
              <LineItem label="Need for next rank" value="2 SP" />
              <LineItem label="Need for Top 50" value="67 SP" />
            </div>
          </article>

          <article style={card}>
            <SectionHeading title="Community Comparison" />
            <div style={pillGrid}>
              <MiniStat label="Your SP" value="177" />
              <MiniStat label="Community Avg" value="124" />
              <MiniStat label="Top 50 Cutoff" value="244" />
              <MiniStat label="Top 10 Cutoff" value="312" />
            </div>
          </article>

          <article style={card}>
            <SectionHeading title="Activity Health" />
            <div style={cardStack}>
              <LineItem label="Attendance %" value="98%" />
              <LineItem label="Questions Answered" value="48" />
              <LineItem label="Accepted Answers" value="31" />
              <LineItem label="Helpful Contributions" value="22" />
            </div>
          </article>

          <article style={card}>
            <SectionHeading title="Badges" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {badgeChips.map(chip => (
                <span key={chip} style={badgeChip}>{chip}</span>
              ))}
            </div>
          </article>
        </section>

        <section style={chartRow}>
          <article style={{ ...card, flex: '1 1 520px' }}>
            <SectionHeading title="SP Growth Chart" />
            <div style={chartWrap}>
              <svg viewBox="0 0 700 220" preserveAspectRatio="none" style={chartSvg} aria-hidden="true">
                <defs>
                  <linearGradient id="spurtiLine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c6ff7" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  <linearGradient id="spurtiFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(124,111,247,0.45)" />
                    <stop offset="100%" stopColor="rgba(124,111,247,0.02)" />
                  </linearGradient>
                </defs>
                <polyline
                  points="50,170 110,145 170,150 230,112 290,124 350,92 410,80 470,110 530,76 590,64 650,54 650,200 50,200"
                  fill="url(#spurtiFill)"
                  stroke="none"
                />
                <polyline
                  points={chartPoints}
                  fill="none"
                  stroke="url(#spurtiLine)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div style={chartAxis}>
                <span>Days</span>
                <span>Weeks</span>
                <span>Months</span>
              </div>
            </div>
          </article>

          <article style={{ ...card, flex: '1 1 340px' }}>
            <SectionHeading title="What To Do Next" />
            <div style={cardStack}>
              <ActionLine text="Answer 3 more questions to enter Top 100" />
              <ActionLine text="Gain 15 SP to unlock FAQ Expert badge" />
              <ActionLine text="Contribute 5 accepted answers to reach Top 50" />
            </div>
          </article>
        </section>

        <section style={tabsBar}>
          {tabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                ...tabBtn,
                ...(activeTab === tab ? tabBtnActive : {}),
              }}
            >
              {tab}
            </button>
          ))}
        </section>

        <section style={{ ...card, padding: 20 }}>
          {activeTab === 'SP Statement' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={statementToolbar}>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search SP statement..."
                  style={searchInput}
                />
                <div style={statementHint}>Searchable and scrollable bank statement view</div>
              </div>

              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr>
                      <th style={th}>Date</th>
                      <th style={th}>Credit</th>
                      <th style={th}>Debit</th>
                      <th style={th}>Balance</th>
                      <th style={th}>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStatements.map(row => (
                      <tr key={`${row.date}-${row.reason}`}>
                        <td>{row.date}</td>
                        <td style={creditCell}>{row.credit}</td>
                        <td style={debitCell}>{row.debit}</td>
                        <td style={balanceCell}>{row.balance}</td>
                        <td>{row.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Achievements' && (
            <div style={achievementsGrid}>
              {achievements.map(item => (
                <div key={item.title} style={achievementCard}>
                  <strong style={{ color: '#eef0f6' }}>{item.title}</strong>
                  <span style={{ color: '#94a3b8', fontSize: 12 }}>{item.level}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Badges' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {badgeChips.map(chip => (
                <span key={chip} style={badgeChip}>{chip}</span>
              ))}
            </div>
          )}

          {activeTab === 'Leaderboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={topThree}>
                {leaderboardTop.map(item => (
                  <div key={item.name} style={topThreeItem}>
                    <div style={topThreeRank}>{item.rank}</div>
                    <strong style={{ color: '#eef0f6' }}>{item.name}</strong>
                    <span style={{ color: '#fbbf24', fontWeight: 800 }}>{item.sp} SP</span>
                  </div>
                ))}
              </div>

              <div style={tableWrap}>
                <table style={table}>
                  <thead>
                    <tr>
                      <th style={th}>Rank</th>
                      <th style={th}>Name</th>
                      <th style={th}>SP</th>
                      <th style={th}>Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardList.map(item => (
                      <tr key={item.rank}>
                        <td>{item.rank}</td>
                        <td>{item.name}</td>
                        <td style={{ color: '#fbbf24', fontWeight: 700 }}>{item.sp}</td>
                        <td>{item.badge}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <section style={stickyRankCard}>
          <div>
            <div style={stickyRankLabel}>Your SP Points: <strong style={{ color: '#f8fafc' }}>177</strong></div>
            <div style={stickyRankLabel}>Your Rank: <strong style={{ color: '#f8fafc' }}>#133</strong></div>
          </div>
          <div style={stickyRankText}>Keep contributing to climb the leaderboard.</div>
        </section>
      </div>
    </div>
  );
}

function SectionHeading({ title }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={sectionLabel}>{title}</div>
    </div>
  );
}

function LineItem({ label, value }) {
  return (
    <div style={lineItem}>
      <span style={lineLabel}>{label}</span>
      <strong style={lineValue}>{value}</strong>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={miniStat}>
      <span style={lineLabel}>{label}</span>
      <strong style={{ color: '#f8fafc', fontSize: 16 }}>{value}</strong>
    </div>
  );
}

function ActionLine({ text }) {
  return (
    <div style={actionLine}>
      <span style={actionDot} />
      <span style={{ color: '#dbeafe', fontSize: 13, lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

const page = {
  minHeight: '100vh',
  background: 'radial-gradient(ellipse at 20% 20%, #14102d 0%, #0d0d1a 50%, #07090f 100%)',
  color: '#eef0f6',
  position: 'relative',
  overflow: 'hidden',
};

const bgOrbA = {
  position: 'fixed',
  top: '-10%',
  left: '-8%',
  width: 560,
  height: 560,
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(124,111,247,0.16) 0%, transparent 70%)',
  pointerEvents: 'none',
};

const bgOrbB = {
  position: 'fixed',
  bottom: '-15%',
  right: '-8%',
  width: 500,
  height: 500,
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
  pointerEvents: 'none',
};

const inner = {
  position: 'relative',
  zIndex: 1,
  maxWidth: 1360,
  margin: '0 auto',
  padding: '24px 24px 84px',
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
};

const hero = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: 18,
  alignItems: 'center',
  padding: '18px 20px',
  ...glass,
};

const backBtn = {
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.05)',
  color: '#eef0f6',
  borderRadius: 14,
  padding: '10px 14px',
  fontWeight: 700,
};

const heroCenter = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const eyebrow = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.2em',
  color: '#a78bfa',
  textTransform: 'uppercase',
};

const title = {
  margin: 0,
  fontSize: 'clamp(24px, 3vw, 36px)',
  lineHeight: 1.05,
  letterSpacing: '-0.04em',
};

const subtitle = {
  margin: 0,
  color: '#cbd5e1',
  fontSize: 14,
};

const summaryCard = {
  minWidth: 220,
  padding: 18,
  borderRadius: 20,
  background: 'linear-gradient(135deg, rgba(124,111,247,0.22), rgba(59,130,246,0.14))',
  border: '1px solid rgba(124,111,247,0.26)',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const summaryLabel = {
  color: '#dbeafe',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontWeight: 700,
};

const summaryValue = {
  color: '#fff',
  fontSize: 20,
  fontWeight: 900,
  marginBottom: 6,
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
  gap: 16,
};

const card = {
  padding: 20,
  borderRadius: 22,
  ...glass,
};

const sectionLabel = {
  color: '#a78bfa',
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const cardStack = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const lineItem = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 14,
  padding: '12px 0',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

const lineLabel = {
  color: '#94a3b8',
  fontSize: 12,
};

const lineValue = {
  color: '#eef0f6',
  fontSize: 15,
};

const pillGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 10,
};

const miniStat = {
  padding: 14,
  borderRadius: 16,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const badgeChip = {
  padding: '8px 12px',
  borderRadius: 999,
  background: 'rgba(124,111,247,0.12)',
  border: '1px solid rgba(124,111,247,0.22)',
  color: '#dbeafe',
  fontSize: 12,
  fontWeight: 700,
};

const chartRow = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
};

const chartWrap = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const chartSvg = {
  width: '100%',
  height: 240,
  borderRadius: 18,
  background: 'rgba(255,255,255,0.02)',
};

const chartAxis = {
  display: 'flex',
  justifyContent: 'space-between',
  color: '#94a3b8',
  fontSize: 12,
  padding: '0 6px',
};

const actionLine = {
  display: 'flex',
  gap: 10,
  alignItems: 'flex-start',
  padding: '12px 0',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

const actionDot = {
  width: 8,
  height: 8,
  marginTop: 7,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #7c6ff7, #38bdf8)',
  boxShadow: '0 0 0 6px rgba(124,111,247,0.08)',
  flexShrink: 0,
};

const tabsBar = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
};

const tabBtn = {
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.04)',
  color: '#cbd5e1',
  padding: '10px 14px',
  borderRadius: 14,
  fontWeight: 700,
};

const tabBtnActive = {
  background: 'linear-gradient(135deg, rgba(124,111,247,0.28), rgba(59,130,246,0.16))',
  color: '#fff',
  borderColor: 'rgba(124,111,247,0.3)',
};

const statementToolbar = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  flexWrap: 'wrap',
};

const searchInput = {
  minWidth: 280,
  flex: '1 1 280px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 14,
  color: '#eef0f6',
  padding: '12px 14px',
  outline: 'none',
};

const statementHint = {
  color: '#94a3b8',
  fontSize: 12,
};

const tableWrap = {
  overflow: 'auto',
  maxHeight: 360,
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.06)',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 720,
};

const th = {
  position: 'sticky',
  top: 0,
  background: 'rgba(9,12,22,0.96)',
  color: '#cbd5e1',
  textAlign: 'left',
  padding: '14px 14px',
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

const td = {
  padding: '13px 14px',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  color: '#eef0f6',
  fontSize: 13,
};

const creditCell = { ...td, color: '#22c55e', fontWeight: 800 };
const debitCell = { ...td, color: '#ef4444', fontWeight: 800 };
const balanceCell = { ...td, color: '#f8fafc', fontWeight: 800 };

const achievementsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 14,
};

const achievementCard = {
  padding: 16,
  borderRadius: 18,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const topThree = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 12,
};

const topThreeItem = {
  padding: 16,
  borderRadius: 18,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const topThreeRank = {
  fontSize: 18,
};

const stickyRankCard = {
  position: 'sticky',
  bottom: 16,
  marginTop: 4,
  padding: '16px 18px',
  borderRadius: 18,
  background: 'linear-gradient(135deg, rgba(124,111,247,0.2), rgba(56,189,248,0.12))',
  border: '1px solid rgba(124,111,247,0.22)',
  boxShadow: '0 16px 32px rgba(0,0,0,0.24)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
};

const stickyRankLabel = {
  color: '#cbd5e1',
  fontSize: 13,
  fontWeight: 600,
};

const stickyRankText = {
  color: '#eef0f6',
  fontSize: 13,
  fontWeight: 700,
};

export default SpurtiPointsPage;
