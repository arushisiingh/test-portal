import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../authContext';

const topicChips = [
  'NOC', 'Eligibility', 'Certificate', 'Interview', 'Offer Letter', 'Stipend', 'Remote Internship',
  'Team Formation', 'Attendance', 'SP Points', 'FAQ', 'Documents', 'Results', 'Yaksha', 'Community', 'Leaderboard',
];

const duplicateLibrary = [
  {
    title: 'How to re-upload NOC?',
    hint: 'It looks like a NOC upload issue. This thread explains the re-upload flow.',
    keywords: ['noc', 're-upload', 'upload'],
    discussionId: 2,
  },
  {
    title: 'Wrong NOC uploaded by mistake',
    hint: 'Existing discussion about mistaken document uploads.',
    keywords: ['wrong noc', 'mistake', 'incorrect'],
    discussionId: 2,
  },
  {
    title: 'NOC approval taking too long',
    hint: 'Community reports on approval delays and follow-up steps.',
    keywords: ['noc', 'approval', 'delay'],
    discussionId: 1,
  },
  {
    title: 'When will certificates be released?',
    hint: 'Certificate release timeline discussion.',
    keywords: ['certificate', 'release'],
    discussionId: 3,
  },
  {
    title: 'How do I track SP Points?',
    hint: 'SP points clarification thread.',
    keywords: ['sp', 'points', 'track'],
    discussionId: 4,
  },
];

const initialDiscussions = [
  {
    id: 1,
    title: 'How long does NOC approval take?',
    preview: 'I uploaded my NOC and I am unsure how long the approval usually takes. Is there a typical timeline?',
    author: 'Arushi Singh',
    authorSp: 245,
    badge: 'FAQ Expert',
    time: '12 min ago',
    category: 'NOC',
    tags: ['NOC', 'Documents', 'Help'],
    answersCount: 12,
    views: 240,
    status: 'Resolved',
    resolutionState: 'resolved',
    helpfulBy: 24,
    isMine: true,
    canAccept: true,
    questionMeta: {
      author: 'Arushi Singh',
      date: '01 Jun 2026',
      category: 'NOC',
      tags: ['NOC', 'Documents', 'Help'],
      views: 240,
      status: 'Resolved',
    },
    body: 'I uploaded my signed NOC through the dashboard and wanted to know the expected approval time. If there are any common delays, please share the process so others can learn too.',
    answers: [
      {
        id: 11,
        user: 'Priya Sharma',
        role: 'Mentor',
        sp: 312,
        badge: 'Top Reviewer',
        content: 'Usually approvals take 1-3 working days. If your document is clear and signed, it often clears faster. Keep an eye on the dashboard and email notifications.',
        helpful: 24,
        accepted: true,
        replies: [
          { id: 111, user: 'Arushi Singh', content: 'Thanks, this helps a lot. I will wait for the dashboard update.' },
        ],
      },
      {
        id: 12,
        user: 'Rahul Verma',
        role: 'Contributor',
        sp: 198,
        badge: 'Helpful Contributor',
        content: 'Mine was approved after two days. The bottleneck is usually a signature mismatch, so double-check the signatory details before uploading.',
        helpful: 16,
        accepted: false,
        replies: [],
      },
    ],
  },
  {
    id: 2,
    title: 'I uploaded wrong NOC by mistake. What should I do?',
    preview: 'The wrong file went live and I want to know the fastest way to correct it before the review queue starts.',
    author: 'Rahul Verma',
    authorSp: 198,
    badge: 'Helpful Contributor',
    time: '33 min ago',
    category: 'Documents',
    tags: ['NOC', 'Documents', 'Urgent'],
    answersCount: 4,
    views: 112,
    status: 'Community Reviewing',
    resolutionState: 'reviewing',
    helpfulBy: 9,
    isMine: true,
    canAccept: false,
    questionMeta: {
      author: 'Rahul Verma',
      date: '01 Jun 2026',
      category: 'Documents',
      tags: ['NOC', 'Documents', 'Urgent'],
      views: 112,
      status: 'Community Reviewing',
    },
    body: 'I accidentally uploaded the wrong NOC file. I am looking for the cleanest way to replace it without missing the review window.',
    answers: [
      {
        id: 21,
        user: 'Sneha Reddy',
        role: 'Community Helper',
        sp: 221,
        badge: 'Community Helper',
        content: 'Go to the dashboard support flow and re-upload the corrected document. If that does not appear, post the issue with your original upload timestamp so the team can help.',
        helpful: 9,
        accepted: false,
        replies: [
          { id: 211, user: 'Rahul Verma', content: 'Thanks! I found the re-upload option after refreshing the dashboard.' },
          { id: 212, user: 'Priya Sharma', content: 'Good catch. This is exactly the kind of case we keep seeing.' },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'When are internship certificates released?',
    preview: 'I want to know whether certificates arrive immediately after completion or after the final review cycle.',
    author: 'Meera Nair',
    authorSp: 176,
    badge: 'Positive Contributor',
    time: '1h ago',
    category: 'Certificate',
    tags: ['Certificate', 'Completion', 'Timeline'],
    answersCount: 8,
    views: 179,
    status: 'Resolved',
    resolutionState: 'resolved',
    helpfulBy: 18,
    isMine: false,
    canAccept: true,
    questionMeta: {
      author: 'Meera Nair',
      date: '31 May 2026',
      category: 'Certificate',
      tags: ['Certificate', 'Completion', 'Timeline'],
      views: 179,
      status: 'Resolved',
    },
    body: 'I am trying to understand the certificate timeline after completion. Is it immediate, or does it wait for the final project review and moderation?',
    answers: [
      {
        id: 31,
        user: 'Arjun Mehta',
        role: 'Mentor',
        sp: 401,
        badge: 'Top Reviewer',
        content: 'Certificates are typically processed after the completion requirements are verified. If your final checkpoints are complete, you should see the certificate in the release window.',
        helpful: 18,
        accepted: true,
        replies: [],
      },
      {
        id: 32,
        user: 'Ananya Iyer',
        role: 'Contributor',
        sp: 284,
        badge: 'FAQ Expert',
        content: 'You may also get an email announcement when the batch is released. Keep checking the portal and your registered email.',
        helpful: 11,
        accepted: false,
        replies: [],
      },
    ],
  },
  {
    id: 4,
    title: 'How do I track my SP Points and rank?',
    preview: 'I can see contributions, but I am not sure where the balance and rank update appears in the portal.',
    author: 'Karan Patel',
    authorSp: 210,
    badge: 'Community Helper',
    time: '2h ago',
    category: 'SP Points',
    tags: ['SP Points', 'Leaderboard', 'Profile'],
    answersCount: 6,
    views: 154,
    status: 'Resolved',
    resolutionState: 'resolved',
    helpfulBy: 15,
    isMine: false,
    canAccept: true,
    questionMeta: {
      author: 'Karan Patel',
      date: '31 May 2026',
      category: 'SP Points',
      tags: ['SP Points', 'Leaderboard', 'Profile'],
      views: 154,
      status: 'Resolved',
    },
    body: 'I want to understand where the SP balance and rank are shown, and how quickly the leaderboard reflects new contributions.',
    answers: [
      {
        id: 41,
        user: 'Priya Sharma',
        role: 'Mentor',
        sp: 312,
        badge: 'Top Reviewer',
        content: 'Your current balance appears in the Spurti Points screen and profile summary. Rank updates usually follow shortly after the moderation step confirms the contribution.',
        helpful: 15,
        accepted: true,
        replies: [],
      },
    ],
  },
  {
    id: 5,
    title: 'Interview prep tips for Yaksha interview?',
    preview: 'Looking for practical tips on how to prepare for the initial interview and what kinds of questions usually appear.',
    author: 'Sneha Reddy',
    authorSp: 221,
    badge: 'Community Helper',
    time: '4h ago',
    category: 'Interview',
    tags: ['Interview', 'Yaksha', 'Preparation'],
    answersCount: 5,
    views: 97,
    status: 'Awaiting Answers',
    resolutionState: 'open',
    helpfulBy: 6,
    isMine: true,
    canAccept: false,
    questionMeta: {
      author: 'Sneha Reddy',
      date: '31 May 2026',
      category: 'Interview',
      tags: ['Interview', 'Yaksha', 'Preparation'],
      views: 97,
      status: 'Awaiting Answers',
    },
    body: 'I am preparing for the Yaksha interview and want to know what the most useful preparation strategy is for first-time applicants.',
    answers: [
      {
        id: 51,
        user: 'Rahul Verma',
        role: 'Contributor',
        sp: 198,
        badge: 'Helpful Contributor',
        content: 'Focus on the basics, your project story, and why you want the internship. The interview usually rewards clarity and consistency more than memorized answers.',
        helpful: 6,
        accepted: false,
        replies: [],
      },
    ],
  },
  {
    id: 6,
    title: 'Does team formation happen before or after NOC upload?',
    preview: 'Trying to understand the order of onboarding steps so I can avoid missing a deadline.',
    author: 'Aman Khan',
    authorSp: 167,
    badge: 'Positive Contributor',
    time: '6h ago',
    category: 'Team Formation',
    tags: ['Team Formation', 'NOC', 'Onboarding'],
    answersCount: 7,
    views: 131,
    status: 'Community Reviewing',
    resolutionState: 'reviewing',
    helpfulBy: 8,
    isMine: false,
    canAccept: false,
    questionMeta: {
      author: 'Aman Khan',
      date: '31 May 2026',
      category: 'Team Formation',
      tags: ['Team Formation', 'NOC', 'Onboarding'],
      views: 131,
      status: 'Community Reviewing',
    },
    body: 'I am a little confused about the order of the onboarding steps. Does team formation happen before or after NOC upload and approval?',
    answers: [
      {
        id: 61,
        user: 'Meera Nair',
        role: 'Contributor',
        sp: 176,
        badge: 'Positive Contributor',
        content: 'Team formation usually starts after the onboarding information is stabilized, so do not panic if your team is not final on day one.',
        helpful: 8,
        accepted: false,
        replies: [],
      },
    ],
  },
];

function CommunityHubPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState('All');
  const [feedTab, setFeedTab] = useState('All Discussions');
  const [selectedId, setSelectedId] = useState(null);
  const [askOpen, setAskOpen] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [draft, setDraft] = useState({ title: '', description: '', category: 'NOC', tags: '', screenshot: null });
  const [replyOpen, setReplyOpen] = useState(null);
  const [replyText, setReplyText] = useState('');

  const selectedDiscussion = useMemo(
    () => discussions.find(item => item.id === selectedId) || null,
    [discussions, selectedId],
  );

  const filteredDiscussions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return discussions.filter(item => {
      const matchesQuery =
        !q ||
        [item.title, item.preview, item.author, item.category, item.tags.join(' '), item.status]
          .some(value => value.toLowerCase().includes(q));
      const matchesChip = activeChip === 'All' || item.tags.some(tag => tag.toLowerCase() === activeChip.toLowerCase()) || item.category.toLowerCase() === activeChip.toLowerCase();
      const matchesTab = feedTab === 'All Discussions' || item.isMine;
      return matchesQuery && matchesChip && matchesTab;
    });
  }, [activeChip, discussions, feedTab, searchQuery]);

  const askQuery = `${draft.title} ${draft.description}`.trim().toLowerCase();
  const smartSuggestions = useMemo(() => {
    if (!askQuery) return [];
    const matches = duplicateLibrary.filter(item => item.keywords.some(keyword => askQuery.includes(keyword)));
    return matches.slice(0, 3);
  }, [askQuery]);

  function openDiscussion(id) {
    setSelectedId(id);
  }

  function closeDiscussion() {
    setSelectedId(null);
    setReplyOpen(null);
    setReplyText('');
  }

  function updateDiscussion(id, updater) {
    setDiscussions(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        return typeof updater === 'function' ? updater(item) : item;
      }),
    );
  }

  function handleHelpfulClick(discussionId, answerId) {
    updateDiscussion(discussionId, item => ({
      ...item,
      helpfulBy: item.helpfulBy + 1,
      answers: item.answers.map(answer => {
        if (answer.id !== answerId) return answer;
        return {
          ...answer,
          helpful: answer.helpful + 1,
          sp: answer.sp + 5,
        };
      }),
    }));
  }

  function handleAcceptAnswer(discussionId, answerId) {
    updateDiscussion(discussionId, item => ({
      ...item,
      status: 'Resolved',
      resolutionState: 'resolved',
      answers: item.answers.map(answer => ({
        ...answer,
        accepted: answer.id === answerId,
      })),
    }));
  }

  function handleReplySubmit(discussionId, answerId) {
    if (!replyText.trim()) return;
    updateDiscussion(discussionId, item => ({
      ...item,
      answers: item.answers.map(answer => {
        if (answer.id !== answerId) return answer;
        return {
          ...answer,
          replies: [
            ...answer.replies,
            { id: Date.now(), user: 'Student', content: replyText.trim() },
          ],
        };
      }),
    }));
    setReplyText('');
    setReplyOpen(null);
  }

  function handleAskSubmit(event) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.description.trim()) return;

    const newDiscussion = {
      id: Date.now(),
      title: draft.title.trim(),
      preview: draft.description.trim().slice(0, 120),
      author: 'Student',
      authorSp: 177,
      badge: 'Community Contributor',
      time: 'Just now',
      category: draft.category,
      tags: draft.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      answersCount: 0,
      views: 0,
      status: 'Community Reviewing',
      resolutionState: 'reviewing',
      helpfulBy: 0,
      isMine: true,
      canAccept: true,
      questionMeta: {
        author: 'Student',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        category: draft.category,
        tags: draft.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        views: 0,
        status: 'Community Reviewing',
      },
      body: draft.description.trim(),
      answers: [],
    };

    setDiscussions(prev => [newDiscussion, ...prev]);
    setDraft({ title: '', description: '', category: 'NOC', tags: '', screenshot: null });
    setSubmitMessage('Question Posted Successfully');
    setTimeout(() => {
      setAskOpen(false);
      setSubmitMessage('');
      openDiscussion(newDiscussion.id);
    }, 900);
  }

  const totalDiscussions = 4821;
  const solvedDiscussions = 3945;
  const resolutionRate = 91;
  const activeContributors = 1240;
  const todaysAnswers = 87;

  const topContributors = [
    { rank: 1, name: 'Priya Sharma', sp: 4210, badge: 'FAQ Expert' },
    { rank: 2, name: 'Arjun Mehta', sp: 3870, badge: 'Top Reviewer' },
    { rank: 3, name: 'Sneha Reddy', sp: 3540, badge: 'Community Helper' },
    { rank: 4, name: 'Rahul Verma', sp: 3220, badge: 'Helpful Contributor' },
    { rank: 5, name: 'Ananya Iyer', sp: 3105, badge: 'Positive Contributor' },
  ];

  const trending = [
    'NOC Approval Delays',
    'Internship Joining Date',
    'Certificate Release',
    'SP Points Clarification',
  ];

  const notifications = [
    { text: 'Someone answered your question', accent: 'purple' },
    { text: 'A reply was added to your answer', accent: 'blue' },
    { text: 'Your answer became helpful', accent: 'green' },
    { text: 'Your question was marked resolved', accent: 'green' },
  ];

  const myQuestions = discussions.filter(item => item.isMine);
  const openQuestions = myQuestions.filter(item => item.resolutionState !== 'resolved').length;
  const resolvedQuestions = myQuestions.filter(item => item.resolutionState === 'resolved').length;
  const answeredQuestions = discussions.filter(item => item.answersCount > 0).length;
  const helpfulEarned = 58;
  const displayName = user === 'student' ? 'Student' : 'Community Member';

  const currentStatusColor = status => {
    if (status === 'Resolved') return '#22c55e';
    if (status === 'Community Reviewing') return '#38bdf8';
    return '#f59e0b';
  };

  return (
    <div style={page}>
      <div style={bgGlowA} />
      <div style={bgGlowB} />

      <div style={inner}>
        <header style={topBar}>
          <button type="button" onClick={() => navigate('/dashboard')} style={backBtn}>
            ← Back to Dashboard
          </button>
          <div style={portalLabel}>Community Hub</div>
          <div style={spacer} />
        </header>

        <section style={heroCard}>
            <div style={heroCopy}>
              <div style={eyebrow}>Community Hub</div>
              <h1 style={heroTitle}>Ask questions, help peers, and learn from the community.</h1>
              <p style={heroSubtitle}>
                Browse discussions, catch duplicate questions before posting, and earn Spurti Points for helpful contributions.
              </p>
            </div>
            <div style={heroRight}>
            <button type="button" style={askButton} onClick={() => setAskOpen(true)}>
              Ask a Question
            </button>
            <div style={heroQuickCard}>
              <span style={heroQuickLabel}>Resolved today</span>
              <strong style={heroQuickValue}>{resolutionRate}%</strong>
              <span style={heroQuickSub}>{solvedDiscussions.toLocaleString()} solved discussions</span>
              <span style={heroQuickSub}>Signed in as {displayName}</span>
            </div>
          </div>
        </section>

        <section style={heroSearchWrap}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search discussions, NOC, certificates, eligibility, stipend..."
            style={searchInput}
          />
        </section>

        <section style={topicRow}>
          {['All', ...topicChips].map(chip => (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveChip(chip)}
              style={{
                ...topicChip,
                ...(activeChip === chip ? topicChipActive : {}),
              }}
            >
              {chip}
            </button>
          ))}
        </section>

        <section style={mainGrid}>
          <div style={leftColumn}>
            <div style={feedCard}>
              <div style={feedHeader}>
                <div style={segmentTabs}>
                  {['All Discussions', 'My Questions'].map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setFeedTab(tab)}
                      style={{
                        ...feedTabBtn,
                        ...(feedTab === tab ? feedTabBtnActive : {}),
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div style={feedCount}>{filteredDiscussions.length} discussions</div>
              </div>

              <div style={feedList}>
                {filteredDiscussions.map(item => (
                  <article key={item.id} style={discussionCard} onClick={() => openDiscussion(item.id)}>
                    <div style={discussionTop}>
                      <div style={discussionCopy}>
                        <div style={discussionTitleRow}>
                          <h3 style={discussionTitle}>{item.title}</h3>
                          <span style={{ ...statusPill, color: currentStatusColor(item.status), borderColor: `${currentStatusColor(item.status)}33` }}>
                            {item.status}
                          </span>
                        </div>
                        <p style={discussionPreview}>{item.preview}</p>
                        <div style={discussionMeta}>
                          <span>{item.author} · SP: {item.authorSp}</span>
                          <span>{item.time}</span>
                          <span>{item.category}</span>
                          <span>{item.answersCount} Answers</span>
                          <span>{item.views} Views</span>
                        </div>
                      </div>
                      <div style={discussionVoteBox}>
                        <div style={discussionVoteValue}>❤️ {item.helpfulBy}</div>
                        <div style={discussionVoteLabel}>Helpful by students</div>
                      </div>
                    </div>

                    <div style={tagWrap}>
                      {item.tags.map(tag => (
                        <span key={tag} style={tagPill}>{tag}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside style={sidebar}>
            <div style={sideCard}>
              <SectionTitle title="Community Stats" />
              <StatLine label="Total Discussions" value={totalDiscussions.toLocaleString()} />
              <StatLine label="Questions Solved" value={solvedDiscussions.toLocaleString()} />
              <StatLine label="Active Contributors" value={activeContributors.toLocaleString()} />
              <StatLine label="Today's Answers" value={todaysAnswers.toLocaleString()} />
              <StatLine label="Resolution Rate" value={`${resolutionRate}%`} />
            </div>

            <div style={sideCard}>
              <SectionTitle title="Trending Discussions" />
              <div style={stackGap}>
                {trending.map(item => (
                  <button key={item} type="button" style={trendItem} onClick={() => setSearchQuery(item)}>
                    🔥 {item}
                  </button>
                ))}
              </div>
            </div>

            <div style={sideCard}>
              <SectionTitle title="Top Contributors" />
              <div style={leaderMini}>
                {topContributors.map(item => (
                  <div key={item.rank} style={leaderMiniItem}>
                    <div style={leaderMiniRank}>#{item.rank}</div>
                    <div style={leaderMiniMeta}>
                      <strong style={{ color: '#eef0f6' }}>{item.name}</strong>
                      <span style={{ color: '#94a3b8', fontSize: 12 }}>{item.badge} · SP {item.sp}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" style={viewBtn} onClick={() => navigate('/leaderboard')}>
                View Full Leaderboard
              </button>
            </div>

            <div style={sideCard}>
              <SectionTitle title="Notifications" />
              <div style={stackGap}>
                {notifications.map(item => (
                  <div key={item.text} style={notificationItem}>
                    <span style={{ ...notifDot, background: notificationColors[item.accent] }} />
                    <span style={notificationText}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={sideCard}>
              <SectionTitle title="My Questions" />
              <div style={stackGap}>
                <StatLine label="Questions Asked" value={myQuestions.length.toString()} />
                <StatLine label="Open Questions" value={openQuestions.toString()} />
                <StatLine label="Resolved Questions" value={resolvedQuestions.toString()} />
                <StatLine label="Questions Answered" value={answeredQuestions.toString()} />
                <StatLine label="Helpful Count Earned" value={helpfulEarned.toString()} />
              </div>
            </div>
          </aside>
        </section>
      </div>

      {askOpen && (
        <div style={modalBackdrop} onClick={() => setAskOpen(false)}>
          <div style={modalCard} onClick={e => e.stopPropagation()}>
            <div style={modalHeader}>
              <div>
                <div style={eyebrow}>Ask a Question</div>
                <h2 style={modalTitle}>Share your doubt with the community</h2>
              </div>
              <button type="button" onClick={() => setAskOpen(false)} style={closeBtn}>✕</button>
            </div>

            <form style={askForm} onSubmit={handleAskSubmit}>
              <input
                value={draft.title}
                onChange={e => setDraft(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Question Title"
                style={field}
              />
              <textarea
                value={draft.description}
                onChange={e => setDraft(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
                style={{ ...field, minHeight: 140, resize: 'vertical' }}
              />

              {smartSuggestions.length > 0 && (
                <div style={suggestionBlock}>
                  <div style={suggestionLabel}>Do you mean:</div>
                  <div style={suggestionGrid}>
                    {smartSuggestions.map(item => (
                      <button
                        type="button"
                        key={item.title}
                        style={suggestionCard}
                        onClick={() => {
                          setAskOpen(false);
                          openDiscussion(item.discussionId);
                        }}
                      >
                        <strong style={{ color: '#eef0f6' }}>{item.title}</strong>
                        <span style={{ color: '#94a3b8', fontSize: 12 }}>{item.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={formGrid}>
                <select
                  value={draft.category}
                  onChange={e => setDraft(prev => ({ ...prev, category: e.target.value }))}
                  style={field}
                >
                  {['NOC', 'Eligibility', 'Certificate', 'Interview', 'Offer Letter', 'Stipend', 'Team Formation', 'SP Points'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  value={draft.tags}
                  onChange={e => setDraft(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Tags (comma separated)"
                  style={field}
                />
              </div>

              <input
                type="file"
                onChange={e => setDraft(prev => ({ ...prev, screenshot: e.target.files?.[0] || null }))}
                style={fileField}
              />

              <button type="submit" style={submitBtn}>Submit Question</button>
              {submitMessage && <div style={successMessage}>{submitMessage}</div>}
            </form>
          </div>
        </div>
      )}

      {selectedDiscussion && (
        <div style={modalBackdrop} onClick={closeDiscussion}>
          <div style={detailModal} onClick={e => e.stopPropagation()}>
            <div style={detailHeader}>
              <div>
                <div style={eyebrow}>Discussion Detail</div>
                <h2 style={detailTitle}>{selectedDiscussion.title}</h2>
                <div style={detailMeta}>
                  <span>{selectedDiscussion.questionMeta.author}</span>
                  <span>{selectedDiscussion.questionMeta.date}</span>
                  <span>{selectedDiscussion.questionMeta.category}</span>
                  <span>{selectedDiscussion.questionMeta.views} Views</span>
                  <span style={{ color: currentStatusColor(selectedDiscussion.status), fontWeight: 800 }}>
                    {selectedDiscussion.questionMeta.status}
                  </span>
                </div>
              </div>
              <button type="button" onClick={closeDiscussion} style={closeBtn}>✕</button>
            </div>

            <div style={questionPanel}>
              <p style={questionBody}>{selectedDiscussion.body}</p>
              <div style={tagWrap}>
                {selectedDiscussion.questionMeta.tags.map(tag => (
                  <span key={tag} style={tagPill}>{tag}</span>
                ))}
              </div>
            </div>

            <div style={answersHeader}>
              <h3 style={answersTitle}>Answers</h3>
              <span style={answersCount}>{selectedDiscussion.answers.length} replies</span>
            </div>

            <div style={answerList}>
              {[...selectedDiscussion.answers]
                .sort((a, b) => Number(b.accepted) - Number(a.accepted) || b.helpful - a.helpful)
                .map(answer => (
                  <div key={answer.id} style={{
                    ...answerCard,
                    ...(answer.accepted ? acceptedAnswerCard : {}),
                  }}>
                    <div style={answerTop}>
                      <div style={avatar}>{answer.user.slice(0, 1)}</div>
                      <div style={answerMeta}>
                        <div style={answerNameRow}>
                          <strong style={{ color: '#eef0f6' }}>{answer.user}</strong>
                          <span style={roleBadge}>{answer.role}</span>
                          <span style={spBadge}>SP {answer.sp}</span>
                          {answer.badge && <span style={miniBadge}>{answer.badge}</span>}
                        </div>
                        <div style={answerMetaText}>
                          <span>❤️ Helpful by {answer.helpful} students</span>
                          {answer.accepted && <span style={acceptedPill}>Community Verified</span>}
                        </div>
                      </div>
                    </div>
                    <p style={answerContent}>{answer.content}</p>

                    <div style={answerActions}>
                      <button type="button" style={actionBtn} onClick={() => handleHelpfulClick(selectedDiscussion.id, answer.id)}>
                        ❤️ Helpful
                      </button>
                      <button type="button" style={actionBtn} onClick={() => setReplyOpen(prev => prev === answer.id ? null : answer.id)}>
                        Reply
                      </button>
                      {selectedDiscussion.canAccept && !answer.accepted && (
                        <button type="button" style={acceptBtn} onClick={() => handleAcceptAnswer(selectedDiscussion.id, answer.id)}>
                          ✓ Accepted Answer
                        </button>
                      )}
                    </div>

                    {answer.replies.length > 0 && (
                      <div style={replyThread}>
                        {answer.replies.map(reply => (
                          <div key={reply.id} style={replyItem}>
                            <div style={replyAvatar}>{reply.user.slice(0, 1)}</div>
                            <div>
                              <strong style={{ color: '#eef0f6' }}>{reply.user}</strong>
                              <p style={replyTextStyle}>{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {replyOpen === answer.id && (
                      <div style={replyComposer}>
                        <textarea
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          style={replyField}
                        />
                        <button type="button" style={submitReplyBtn} onClick={() => handleReplySubmit(selectedDiscussion.id, answer.id)}>
                          Post Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div style={{
      color: '#a78bfa',
      fontSize: 13,
      fontWeight: 800,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: 12,
    }}>
      {title}
    </div>
  );
}

function StatLine({ label, value }) {
  return (
    <div style={statLine}>
      <span style={statLabel}>{label}</span>
      <strong style={statValue}>{value}</strong>
    </div>
  );
}

const notificationColors = {
  purple: '#7c6ff7',
  blue: '#38bdf8',
  green: '#22c55e',
};

const page = {
  minHeight: '100vh',
  background: 'radial-gradient(ellipse at 15% 20%, #13112b 0%, #0d0d1a 45%, #07090f 100%)',
  position: 'relative',
  overflow: 'hidden',
  color: '#eef0f6',
};

const bgGlowA = {
  position: 'fixed',
  top: '-8%',
  left: '-10%',
  width: 560,
  height: 560,
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(124,111,247,0.15), transparent 70%)',
  pointerEvents: 'none',
};

const bgGlowB = {
  position: 'fixed',
  right: '-12%',
  bottom: '-12%',
  width: 560,
  height: 560,
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(56,189,248,0.12), transparent 70%)',
  pointerEvents: 'none',
};

const inner = {
  position: 'relative',
  zIndex: 1,
  maxWidth: 1460,
  margin: '0 auto',
  padding: '24px 24px 92px',
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
};

const topBar = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '8px 0 0',
};

const backBtn = {
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.05)',
  color: '#eef0f6',
  borderRadius: 14,
  padding: '10px 14px',
  fontWeight: 700,
};

const portalLabel = {
  color: '#a78bfa',
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  fontWeight: 800,
};

const spacer = {
  flex: 1,
};

const heroCard = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 18,
  alignItems: 'center',
  padding: 22,
  borderRadius: 26,
  background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(18px)',
};

const heroCopy = {
  maxWidth: 760,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const eyebrow = {
  color: '#a78bfa',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
};

const heroTitle = {
  margin: 0,
  fontSize: 'clamp(28px, 3vw, 40px)',
  letterSpacing: '-0.04em',
  lineHeight: 1.05,
};

const heroSubtitle = {
  margin: 0,
  color: '#cbd5e1',
  fontSize: 15,
  lineHeight: 1.55,
};

const heroRight = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  minWidth: 220,
};

const askButton = {
  border: 'none',
  borderRadius: 16,
  padding: '14px 18px',
  background: 'linear-gradient(135deg, #7c6ff7, #38bdf8)',
  color: '#fff',
  fontWeight: 800,
  boxShadow: '0 14px 28px rgba(124,111,247,0.24)',
};

const heroQuickCard = {
  padding: 16,
  borderRadius: 18,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const heroQuickLabel = { color: '#94a3b8', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 };
const heroQuickValue = { color: '#eef0f6', fontSize: 28, fontWeight: 900, letterSpacing: '-0.04em' };
const heroQuickSub = { color: '#cbd5e1', fontSize: 13 };

const heroSearchWrap = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const searchInput = {
  width: '100%',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 18,
  background: 'rgba(255,255,255,0.04)',
  color: '#eef0f6',
  padding: '16px 18px',
  fontSize: 14,
  outline: 'none',
  boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
};

const topicRow = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
};

const topicChip = {
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
  color: '#cbd5e1',
  padding: '9px 12px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
};

const topicChipActive = {
  background: 'linear-gradient(135deg, rgba(124,111,247,0.22), rgba(56,189,248,0.14))',
  borderColor: 'rgba(124,111,247,0.28)',
  color: '#fff',
};

const mainGrid = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 2.35fr) minmax(320px, 1fr)',
  gap: 18,
  alignItems: 'start',
};

const leftColumn = {
  minWidth: 0,
};

const feedCard = {
  ...glassCardStyle(),
  padding: 20,
};

function glassCardStyle() {
  return {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    backdropFilter: 'blur(18px)',
    boxShadow: '0 12px 32px rgba(0,0,0,0.28)',
  };
}

const feedHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
  marginBottom: 16,
};

const segmentTabs = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
};

const feedTabBtn = {
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
  color: '#cbd5e1',
  padding: '10px 14px',
  borderRadius: 14,
  fontWeight: 700,
};

const feedTabBtnActive = {
  background: 'linear-gradient(135deg, rgba(124,111,247,0.22), rgba(56,189,248,0.14))',
  color: '#fff',
  borderColor: 'rgba(124,111,247,0.28)',
};

const feedCount = {
  color: '#94a3b8',
  fontSize: 12,
  fontWeight: 700,
};

const feedList = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

const discussionCard = {
  padding: 18,
  borderRadius: 20,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  cursor: 'pointer',
};

const discussionTop = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 16,
  alignItems: 'flex-start',
};

const discussionCopy = {
  minWidth: 0,
  flex: 1,
};

const discussionTitleRow = {
  display: 'flex',
  gap: 10,
  alignItems: 'flex-start',
  justifyContent: 'space-between',
};

const discussionTitle = {
  margin: 0,
  color: '#eef0f6',
  fontSize: 18,
  letterSpacing: '-0.03em',
};

const discussionPreview = {
  margin: '8px 0 0',
  color: '#cbd5e1',
  lineHeight: 1.55,
  fontSize: 14,
};

const discussionMeta = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px 14px',
  marginTop: 12,
  color: '#94a3b8',
  fontSize: 12,
};

const discussionVoteBox = {
  minWidth: 120,
  padding: 14,
  borderRadius: 16,
  background: 'rgba(124,111,247,0.08)',
  border: '1px solid rgba(124,111,247,0.18)',
  textAlign: 'center',
};

const discussionVoteValue = {
  fontSize: 20,
  fontWeight: 900,
  color: '#fff',
};

const discussionVoteLabel = {
  color: '#cbd5e1',
  fontSize: 12,
  marginTop: 4,
};

const tagWrap = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
};

const tagPill = {
  padding: '8px 11px',
  borderRadius: 999,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  color: '#dbeafe',
  fontSize: 12,
  fontWeight: 700,
};

const statusPill = {
  padding: '7px 10px',
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
  fontSize: 11,
  fontWeight: 800,
  whiteSpace: 'nowrap',
};

const sidebar = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  minWidth: 0,
};

const sideCard = {
  ...glassCardStyle(),
  padding: 18,
};

const stackGap = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const statLine = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  padding: '10px 0',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
};

const statLabel = {
  color: '#94a3b8',
  fontSize: 12,
};

const statValue = {
  color: '#eef0f6',
  fontSize: 14,
};

const trendItem = {
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
  color: '#eef0f6',
  padding: '12px 14px',
  borderRadius: 16,
  textAlign: 'left',
  fontWeight: 700,
};

const leaderMini = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const leaderMiniItem = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
};

const leaderMiniRank = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: 'rgba(124,111,247,0.16)',
  display: 'grid',
  placeItems: 'center',
  color: '#fff',
  fontSize: 12,
  fontWeight: 800,
  flexShrink: 0,
};

const leaderMiniMeta = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const viewBtn = {
  marginTop: 12,
  width: '100%',
  border: 'none',
  borderRadius: 14,
  padding: '12px 14px',
  background: 'linear-gradient(135deg, #7c6ff7, #38bdf8)',
  color: '#fff',
  fontWeight: 800,
};

const notificationItem = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 0',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
};

const notifDot = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
};

const notificationText = {
  color: '#dbeafe',
  fontSize: 13,
  lineHeight: 1.45,
};

const modalBackdrop = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(3, 7, 18, 0.82)',
  backdropFilter: 'blur(12px)',
  display: 'grid',
  placeItems: 'center',
  zIndex: 100,
  padding: 18,
};

const modalCard = {
  width: 'min(920px, 100%)',
  maxHeight: '88vh',
  overflow: 'auto',
  padding: 22,
  borderRadius: 26,
  background: 'linear-gradient(135deg, rgba(12,14,24,0.98), rgba(17,23,39,0.98))',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 24px 70px rgba(0,0,0,0.5)',
};

const modalHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  alignItems: 'flex-start',
  marginBottom: 16,
};

const modalTitle = {
  margin: '8px 0 0',
  fontSize: 'clamp(22px, 2.4vw, 32px)',
  letterSpacing: '-0.04em',
  lineHeight: 1.1,
};

const closeBtn = {
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.05)',
  color: '#eef0f6',
  borderRadius: 12,
  width: 40,
  height: 40,
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
};

const askForm = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const field = {
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  background: 'rgba(255,255,255,0.04)',
  color: '#eef0f6',
  padding: '14px 16px',
  outline: 'none',
  fontSize: 14,
};

const suggestionBlock = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: 14,
  borderRadius: 18,
  background: 'rgba(124,111,247,0.06)',
  border: '1px solid rgba(124,111,247,0.12)',
};

const suggestionLabel = {
  color: '#cbd5e1',
  fontWeight: 700,
  fontSize: 13,
};

const suggestionGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 10,
};

const suggestionCard = {
  textAlign: 'left',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
  borderRadius: 16,
  padding: 14,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  color: '#eef0f6',
};

const formGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 12,
};

const fileField = {
  color: '#cbd5e1',
  fontSize: 13,
};

const submitBtn = {
  border: 'none',
  borderRadius: 16,
  padding: '14px 16px',
  background: 'linear-gradient(135deg, #7c6ff7, #38bdf8)',
  color: '#fff',
  fontWeight: 800,
};

const successMessage = {
  padding: '12px 14px',
  borderRadius: 14,
  background: 'rgba(34,197,94,0.12)',
  border: '1px solid rgba(34,197,94,0.2)',
  color: '#bbf7d0',
  fontWeight: 700,
};

const detailModal = {
  width: 'min(1100px, 100%)',
  maxHeight: '90vh',
  overflow: 'auto',
  padding: 22,
  borderRadius: 28,
  background: 'linear-gradient(135deg, rgba(12,14,24,0.99), rgba(17,23,39,0.99))',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 28px 80px rgba(0,0,0,0.55)',
};

const detailHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  alignItems: 'flex-start',
  marginBottom: 16,
};

const detailTitle = {
  margin: '8px 0 0',
  fontSize: 'clamp(24px, 2.5vw, 34px)',
  lineHeight: 1.08,
  letterSpacing: '-0.04em',
};

const detailMeta = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px 12px',
  color: '#94a3b8',
  fontSize: 12,
  marginTop: 10,
};

const questionPanel = {
  padding: 18,
  borderRadius: 20,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  marginBottom: 16,
};

const questionBody = {
  margin: 0,
  color: '#dbeafe',
  lineHeight: 1.7,
  fontSize: 15,
};

const answersHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  marginBottom: 14,
};

const answersTitle = {
  margin: 0,
  fontSize: 18,
  letterSpacing: '-0.03em',
};

const answersCount = {
  color: '#94a3b8',
  fontSize: 12,
  fontWeight: 700,
};

const answerList = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

const answerCard = {
  padding: 16,
  borderRadius: 20,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const acceptedAnswerCard = {
  background: 'rgba(34,197,94,0.08)',
  border: '1px solid rgba(34,197,94,0.24)',
  boxShadow: '0 0 0 1px rgba(34,197,94,0.06), 0 0 32px rgba(34,197,94,0.08)',
};

const answerTop = {
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
};

const avatar = {
  width: 42,
  height: 42,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(124,111,247,0.95), rgba(56,189,248,0.85))',
  display: 'grid',
  placeItems: 'center',
  fontWeight: 900,
  color: '#fff',
  flexShrink: 0,
};

const answerMeta = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  minWidth: 0,
};

const answerNameRow = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
};

const roleBadge = {
  padding: '5px 8px',
  borderRadius: 999,
  background: 'rgba(56,189,248,0.12)',
  border: '1px solid rgba(56,189,248,0.2)',
  color: '#dbeafe',
  fontSize: 11,
  fontWeight: 800,
};

const spBadge = {
  padding: '5px 8px',
  borderRadius: 999,
  background: 'rgba(124,111,247,0.12)',
  border: '1px solid rgba(124,111,247,0.22)',
  color: '#eef0f6',
  fontSize: 11,
  fontWeight: 800,
};

const miniBadge = {
  padding: '5px 8px',
  borderRadius: 999,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#cbd5e1',
  fontSize: 11,
  fontWeight: 700,
};

const answerMetaText = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  color: '#94a3b8',
  fontSize: 12,
};

const acceptedPill = {
  color: '#86efac',
  fontWeight: 800,
};

const answerContent = {
  margin: 0,
  color: '#e5e7eb',
  lineHeight: 1.65,
  fontSize: 14,
};

const answerActions = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
};

const actionBtn = {
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
  color: '#e5e7eb',
  padding: '9px 12px',
  borderRadius: 14,
  fontWeight: 700,
};

const acceptBtn = {
  border: '1px solid rgba(34,197,94,0.25)',
  background: 'rgba(34,197,94,0.12)',
  color: '#bbf7d0',
  padding: '9px 12px',
  borderRadius: 14,
  fontWeight: 800,
};

const replyThread = {
  marginLeft: 54,
  paddingLeft: 14,
  borderLeft: '1px solid rgba(124,111,247,0.22)',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const replyItem = {
  display: 'flex',
  gap: 10,
  alignItems: 'flex-start',
  padding: '10px 0',
};

const replyAvatar = {
  width: 30,
  height: 30,
  borderRadius: '50%',
  background: 'rgba(124,111,247,0.16)',
  display: 'grid',
  placeItems: 'center',
  color: '#eef0f6',
  fontSize: 12,
  fontWeight: 800,
  flexShrink: 0,
};

const replyTextStyle = {
  margin: '4px 0 0',
  color: '#cbd5e1',
  fontSize: 13,
  lineHeight: 1.6,
};

const replyComposer = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const replyField = {
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  background: 'rgba(255,255,255,0.04)',
  color: '#eef0f6',
  minHeight: 88,
  padding: 14,
  outline: 'none',
  resize: 'vertical',
};

const submitReplyBtn = {
  alignSelf: 'flex-start',
  border: 'none',
  borderRadius: 14,
  padding: '11px 14px',
  background: 'linear-gradient(135deg, #7c6ff7, #38bdf8)',
  color: '#fff',
  fontWeight: 800,
};

export default CommunityHubPage;
