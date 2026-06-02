const ANNOUNCEMENTS_KEY = 'samagama-announcements';
const READ_STATE_KEY = 'samagama-announcement-read-state';

const defaultAnnouncements = [
  {
    id: 'ann-zoom-meeting',
    title: 'Zoom Meeting Tomorrow',
    preview: 'Meeting starts at 10:00 AM IST. Join the orientation session on time.',
    content:
      'The internship orientation meeting will be conducted tomorrow at 10:00 AM IST.\n\nZoom Link: https://zoom.us/j/123456789\nMeeting ID: 123456789\n\nPlease keep your camera ready and join 5 minutes early.',
    postedBy: 'Samagama Admin Team',
    dateTime: '2026-06-01T08:30:00.000Z',
    category: 'Meeting',
    pinned: true,
    priority: 'High',
    links: [
      { label: 'Zoom Link', url: 'https://zoom.us/j/123456789' },
    ],
  },
  {
    id: 'ann-noc-guidelines',
    title: 'NOC Submission Guidelines',
    preview: 'Please ensure signed copies and correct dates before uploading your NOC.',
    content:
      'Please make sure your NOC contains a handwritten signature from the authorized signatory, the correct internship start/end dates, and a clear student signature.\n\nYou can upload it from the dashboard once you are ready.',
    postedBy: 'Samagama Admin Team',
    dateTime: '2026-06-01T06:50:00.000Z',
    category: 'NOC',
    pinned: false,
    priority: 'Medium',
    links: [],
  },
  {
    id: 'ann-certificate-window',
    title: 'Certificate Release Window',
    preview: 'E-certificates will be released after the completion review cycle.',
    content:
      'Certificates will be released after the completion checks are processed for the current cohort.\n\nPlease keep an eye on your dashboard and official announcements for the release timeline.',
    postedBy: 'Samagama Admin Team',
    dateTime: '2026-05-31T14:00:00.000Z',
    category: 'Certificate',
    pinned: false,
    priority: 'Medium',
    links: [],
  },
  {
    id: 'ann-sp-points',
    title: 'SP Points Update',
    preview: 'Helpful answers and accepted solutions now reflect faster in Spurti Points.',
    content:
      'We have improved the Spurti Points update flow. Accepted answers, helpful marks, and resolved questions should now reflect more quickly in your profile and leaderboard.\n\nIf you notice delays, refresh your dashboard after a few minutes.',
    postedBy: 'Samagama Admin Team',
    dateTime: '2026-05-31T10:10:00.000Z',
    category: 'SP Points',
    pinned: false,
    priority: 'Low',
    links: [],
  },
];

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getInitialAnnouncements() {
  if (typeof window === 'undefined') return defaultAnnouncements;
  const saved = readJson(ANNOUNCEMENTS_KEY, null);
  if (Array.isArray(saved) && saved.length > 0) return saved;
  writeJson(ANNOUNCEMENTS_KEY, defaultAnnouncements);
  return defaultAnnouncements;
}

export function getAnnouncements() {
  if (typeof window === 'undefined') return defaultAnnouncements;
  return readJson(ANNOUNCEMENTS_KEY, defaultAnnouncements);
}

export function saveAnnouncements(announcements) {
  if (typeof window === 'undefined') return;
  writeJson(ANNOUNCEMENTS_KEY, announcements);
  window.dispatchEvent(new Event('samagama-announcements-updated'));
}

export function getPinnedAnnouncement(announcements = getAnnouncements()) {
  return announcements.find(item => item.pinned) || null;
}

function getReadState() {
  if (typeof window === 'undefined') return {};
  return readJson(READ_STATE_KEY, {});
}

function saveReadState(state) {
  if (typeof window === 'undefined') return;
  writeJson(READ_STATE_KEY, state);
  window.dispatchEvent(new Event('samagama-announcements-updated'));
}

export function getReadMap(userId) {
  const state = getReadState();
  return state[userId] || { ids: [], readAt: {} };
}

export function isAnnouncementRead(userId, announcementId) {
  const readMap = getReadMap(userId);
  return readMap.ids.includes(announcementId);
}

export function getUnreadAnnouncementCount(userId, announcements = getAnnouncements()) {
  return announcements.filter(item => !isAnnouncementRead(userId, item.id)).length;
}

export function markAnnouncementRead(userId, announcementId) {
  if (!userId) return;
  const state = getReadState();
  const current = state[userId] || { ids: [], readAt: {} };
  if (!current.ids.includes(announcementId)) {
    current.ids = [announcementId, ...current.ids];
    current.readAt = {
      ...current.readAt,
      [announcementId]: new Date().toISOString(),
    };
    state[userId] = current;
    saveReadState(state);
  }
}

export function markAllAnnouncementsRead(userId, announcements = getAnnouncements()) {
  if (!userId) return;
  const state = getReadState();
  const now = new Date().toISOString();
  state[userId] = {
    ids: announcements.map(item => item.id),
    readAt: Object.fromEntries(announcements.map(item => [item.id, now])),
  };
  saveReadState(state);
}

export function createAnnouncement(input) {
  const existing = getAnnouncements();
  const pinnedExisting = getPinnedAnnouncement(existing);
  const shouldReplacePinned = Boolean(input.replacePinned);
  const wantPinned = Boolean(input.pinned);
  const shouldPinNew = wantPinned && (!pinnedExisting || shouldReplacePinned);
  const next = [
    {
      id: `ann-${Date.now()}`,
      title: input.title.trim(),
      preview: input.message.trim().slice(0, 110),
      content: input.message.trim(),
      postedBy: input.postedBy || 'Samagama Admin Team',
      dateTime: new Date().toISOString(),
      category: input.category || 'Announcement',
      pinned: shouldPinNew,
      priority: input.priority || 'Medium',
      links: input.attachmentLink
        ? [{ label: input.attachmentLabel || 'Attachment', url: input.attachmentLink }]
        : [],
    },
    ...existing.map(item => ({
      ...item,
      pinned: shouldPinNew ? false : item.pinned,
    })),
  ];
  saveAnnouncements(next);
  return next;
}

export function setAnnouncementPinned(announcementId, pinned, { replacePinned = false } = {}) {
  const existing = getAnnouncements();
  const pinnedExisting = getPinnedAnnouncement(existing);

  if (pinned && pinnedExisting && pinnedExisting.id !== announcementId && !replacePinned) {
    return { status: 'needs-replace', pinnedExisting, announcements: existing };
  }

  const next = existing.map(item => ({
    ...item,
    pinned: pinned ? item.id === announcementId : (item.id === announcementId ? false : item.pinned),
  }));

  saveAnnouncements(next);
  return { status: 'ok', announcements: next };
}

export function formatAnnouncementTime(dateTime) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateTime));
  } catch {
    return new Date(dateTime).toLocaleString();
  }
}

export function getAnnouncementCategoryIcon(category) {
  const map = {
    Announcement: '📢',
    Meeting: '📅',
    Internship: '🎓',
    NOC: '📄',
    Certificate: '🏆',
    'SP Points': '⭐',
    Important: '⚠',
  };
  return map[category] || '📢';
}
