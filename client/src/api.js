const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function fetchFaq() {
  const res = await fetch(`${API_BASE}/api/faq`);
  return res.json();
}

export async function fetchAnnouncements(query = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, value);
  });
  const suffix = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/api/announcements${suffix}`);
  return res.json();
}

export async function publishAnnouncement(payload) {
  const res = await fetch(`${API_BASE}/api/announcements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateAnnouncement(id, payload) {
  const res = await fetch(`${API_BASE}/api/announcements/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function removeAnnouncement(id) {
  const res = await fetch(`${API_BASE}/api/announcements/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function fetchDoubts(role = 'intern') {
  const res = await fetch(`${API_BASE}/api/doubts?role=${encodeURIComponent(role)}`);
  return res.json();
}

export async function submitDoubt(payload) {
  const res = await fetch(`${API_BASE}/api/doubts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function approveDoubt(id) {
  const res = await fetch(`${API_BASE}/api/doubts/${id}/approve`, { method: 'POST' });
  return res.json();
}

export async function rejectDoubt(id) {
  const res = await fetch(`${API_BASE}/api/doubts/${id}/reject`, { method: 'POST' });
  return res.json();
}

export async function answerDoubt(id, payload) {
  const res = await fetch(`${API_BASE}/api/doubts/${id}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function fetchAnnouncementReadState(userId) {
  const res = await fetch(`${API_BASE}/api/announcements/read-state?userId=${encodeURIComponent(userId)}`);
  return res.json();
}

export async function markAnnouncementRead(userId, announcementId) {
  const res = await fetch(`${API_BASE}/api/announcements/read-state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, announcementId }),
  });
  return res.json();
}

export async function fetchMyTeam(studentId, studentEmail = studentId) {
  const params = new URLSearchParams();
  params.set('studentId', studentId);
  if (studentEmail) params.set('studentEmail', studentEmail);
  const res = await fetch(`${API_BASE}/api/teams/me?${params.toString()}`);
  return res.json();
}

export async function createTeam(payload) {
  const res = await fetch(`${API_BASE}/api/teams/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function requestJoinTeam(payload) {
  const res = await fetch(`${API_BASE}/api/teams/request-join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function respondJoinRequest(requestId, action) {
  const res = await fetch(`${API_BASE}/api/teams/join-requests/${encodeURIComponent(requestId)}/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  return res.json();
}

export async function respondTeamInvite(inviteId, action) {
  const res = await fetch(`${API_BASE}/api/teams/invites/${encodeURIComponent(inviteId)}/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  return res.json();
}

export async function fetchAdminTeams() {
  const res = await fetch(`${API_BASE}/api/admin/teams`);
  return res.json();
}

export async function decideAdminTeam(teamId, action) {
  const res = await fetch(`${API_BASE}/api/admin/teams/${encodeURIComponent(teamId)}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  return res.json();
}
