import { useState } from 'react';

const recentConversations = [
  { title: 'NOC application timeline', meta: '2 hours ago' },
  { title: 'Resume review for internships', meta: 'Yesterday' },
  { title: 'Stipend eligibility check', meta: '3 days ago' },
  { title: 'Interview prep for CS roles', meta: 'Last week' },
];

const suggestedTopics = [
  'Eligibility criteria for Samagama',
  'Stipend and remote internship details',
  'Resume tips for research internships',
  'Mock interview question practice',
  'Career roadmap for CS students',
];

const quickPrompts = [
  'Resume Review',
  'Interview Preparation',
  'Internship Eligibility',
  'NOC Questions',
  'Stipend Queries',
  'Certificate Support',
];

const assistantFeatures = [
  'Internship Guidance',
  'Resume Feedback',
  'Interview Prep',
  'Career Roadmaps',
  'FAQ Help',
];

function YakshaPage() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Namaste! I am Yaksha-mini, your AI guide for Samagama. Ask me anything about the program or internship prep.',
    },
  ]);
  const [input, setInput] = useState('');

  function sendMessage() {
    if (!input.trim()) return;
    const userMessage = { role: 'user', text: input.trim() };
    const aiMessage = {
      role: 'ai',
      text: `That is a great question! Here is a quick response based on Samagama guidance for: "${input.trim()}".`,
    };
    setMessages(prev => [...prev, userMessage, aiMessage]);
    setInput('');
  }

  function startNewChat() {
    setMessages([
      {
        role: 'ai',
        text: 'Namaste! I am Yaksha-mini, your AI guide for Samagama. Ask me anything about the program or internship prep.',
      },
    ]);
    setInput('');
  }

  return (
    <div className="yaksha-page">
      <section className="yaksha-hero leaderboard-surface">
        <div className="yaksha-hero-main">
          <div className="yaksha-avatar" aria-hidden="true">
            ✦
          </div>
          <div className="yaksha-hero-copy">
            <p className="page-label">Yaksha-mini</p>
            <h1>Your personal AI companion for Samagama.</h1>
            <p>
              Ask anything about internships, NOC, stipends, certificates, interviews, resumes, and career guidance.
            </p>
          </div>
        </div>

        <div className="yaksha-hero-meta">
          {assistantFeatures.map(feature => (
            <span key={feature} className="yaksha-feature-pill">
              {feature}
            </span>
          ))}
        </div>
      </section>

      <div className="yaksha-shell">
        <aside className="yaksha-sidebar leaderboard-surface">
          <button className="new-chat-btn" onClick={startNewChat} type="button">
            <span>＋</span>
            New Chat
          </button>

          <div className="sidebar-section">
            <div className="sidebar-heading">
              <span className="sidebar-label">Recent Conversations</span>
            </div>
            <div className="sidebar-list">
              {recentConversations.map(item => (
                <button key={item.title} className="sidebar-item chat-item" type="button" onClick={() => setInput(item.title)}>
                  <strong>{item.title}</strong>
                  <span>{item.meta}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-heading">
              <span className="sidebar-label">Suggested Topics</span>
            </div>
            <div className="sidebar-list topic-list">
              {suggestedTopics.map(item => (
                <button key={item} onClick={() => setInput(item)} type="button" className="sidebar-item topic-item">
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section feature-section">
            <div className="sidebar-heading">
              <span className="sidebar-label">AI Assistant Features</span>
            </div>
            <div className="feature-list">
              {assistantFeatures.map(feature => (
                <div key={feature} className="feature-mini-card">
                  <span className="feature-mini-dot" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="chat-panel leaderboard-surface">
          <div className="chat-window">
            {messages.length === 1 && (
              <div className="yaksha-empty-state">
                <div className="empty-intro">
                  <div className="empty-avatar" aria-hidden="true">
                    AI
                  </div>
                  <div>
                    <h2>Start a conversation</h2>
                    <p>Choose a quick prompt or ask Yaksha anything to begin.</p>
                  </div>
                </div>

                <div className="quick-prompts">
                  {quickPrompts.map(prompt => (
                    <button key={prompt} type="button" className="quick-prompt-card" onClick={() => setInput(prompt)}>
                      <strong>{prompt}</strong>
                      <span>Tap to ask Yaksha</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`chat-row ${message.role}`}>
                <div className={`chat-bubble ${message.role}`}>
                  <div className="bubble-top">
                    <span className="bubble-name">{message.role === 'ai' ? 'Yaksha' : 'You'}</span>
                    <span className="bubble-time">{message.role === 'ai' ? 'Just now' : 'Sent'}</span>
                  </div>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-composer">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask Yaksha anything..."
              rows="2"
            />
            <button className="primary-btn send-btn" onClick={sendMessage} type="button">
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default YakshaPage;
