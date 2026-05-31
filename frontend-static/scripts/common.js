const API_BASE = '/api';
const TOKEN_KEY = 'inventory_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authFetch(path, options = {}) {
  const token = getToken();
  if (!token) {
    window.location.href = '/login.html';
    return Promise.reject(new Error('Authentication required'));
  }
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(options.headers || {})
  };
  return fetch(`${API_BASE}${path}`, { ...options, headers }).then(handleResponse);
}

function handleResponse(response) {
  return response.json().then((data) => {
    if (!response.ok) {
      if (response.status === 401) {
        removeToken();
        window.location.href = '/login.html';
      }
      throw new Error(data?.message || response.statusText || 'Request failed');
    }
    return data;
  });
}

function onLoginSuccess(token) {
  setToken(token);
  window.location.href = '/index.html';
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '/login.html';
  }
}

function logout() {
  removeToken();
  window.location.href = '/login.html';
}

function setActiveLink(path) {
  const links = document.querySelectorAll('.sidebar a');
  links.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === path);
  });
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function showNotice(container, type, message) {
  if (!container) return;
  container.innerHTML = `<div class="alert ${type}">${message}</div>`;
  setTimeout(() => {
    if (container.innerHTML.includes(message)) {
      container.innerHTML = '';
    }
  }, 6000);
}
