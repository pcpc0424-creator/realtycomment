const API = '/realtycomment/api';

function getToken() { return localStorage.getItem('admin_token'); }
function setToken(t) { localStorage.setItem('admin_token', t); }
function clearToken() { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_name'); }

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() };
}

async function api(path, opts = {}) {
  const res = await fetch(API + path, { headers: authHeaders(), ...opts });
  if (res.status === 401) { clearToken(); location.href = 'index.html'; return; }
  return res.json();
}

function checkAuth() {
  if (!getToken()) { location.href = 'index.html'; return false; }
  const nameEl = document.getElementById('adminName');
  if (nameEl) nameEl.textContent = localStorage.getItem('admin_name') || '관리자';
  return true;
}

function formatDate(d) {
  if (!d) return '-';
  const dt = new Date(d);
  return dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0') + ' ' + String(dt.getHours()).padStart(2,'0') + ':' + String(dt.getMinutes()).padStart(2,'0');
}

function badge(status) {
  return '<span class="badge badge-' + status + '">' + status + '</span>';
}

function logout() { clearToken(); location.href = 'index.html'; }
