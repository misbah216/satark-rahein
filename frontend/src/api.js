const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('sr_token') || localStorage.getItem('token');
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

export function registerUser(payload) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export function loginUser(payload) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

export function fetchQuizByCategory(category) {
  const encodedCategory = encodeURIComponent(category);
  return request(`/quiz/category/${encodedCategory}`, { method: 'GET' });
}

export function submitQuizAnswers(payload) {
  return request('/quiz/submit', { method: 'POST', body: JSON.stringify(payload) });
}
export function getCurrentUser() {
  return request('/auth/me', { method: 'GET' });
}
export function sendChatMessage(message) {
  return request('/chat/message', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}
export function getAdminStats() {
  return request('/admin/stats');
}

export function getAdminUsers() {
  return request('/admin/users');
}

export function sendCampusBroadcast(data) {
  return request('/admin/broadcast', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function createNewQuestion(data) {
  return request('/admin/questions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getActiveBroadcast() {
  return request('/admin/stats');
}