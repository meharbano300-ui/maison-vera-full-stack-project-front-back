// Local dev mein Vite ka proxy "/api" ko http://localhost:5000 par bhej deta hai
// (dekhein vite.config.js). Production mein VITE_API_URL set kar ke kisi bhi
// deployed backend (Railway, Render, etc.) par point kar sakte hain.
let envUrl = import.meta.env.VITE_API_URL || "/api";

// Agar live URL set hai aur uske aakhir mein "/api" nahi laga hua, to khud hi jod do
if (envUrl !== "/api" && !envUrl.endsWith("/api")) {
  // Agar aakhir mein "/" hai to hatao, phir "/api" jodo
  if (envUrl.endsWith("/")) {
    envUrl = envUrl.slice(0, -1);
  }
  envUrl = `${envUrl}/api`;
}

const API_BASE = envUrl;

const ADMIN_TOKEN_KEY = "maison_admin_token";
const USER_EMAIL_KEY = "maison_user_email";

export function getAdminToken() {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getStoredUserEmail() {
  try {
    return localStorage.getItem(USER_EMAIL_KEY);
  } catch {
    return null;
  }
}

export function setStoredUserEmail(email) {
  if (email) localStorage.setItem(USER_EMAIL_KEY, email);
  else localStorage.removeItem(USER_EMAIL_KEY);
}

export async function apiFetch(path, options = {}) {
  const { admin = false, method = "GET", body, headers = {} } = options;
  const reqHeaders = { ...headers };

  if (body !== undefined && !(body instanceof FormData)) {
    reqHeaders["Content-Type"] = "application/json";
  }

  if (admin) {
    const token = getAdminToken();
    if (token) reqHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: reqHeaders,
    body: body !== undefined && !(body instanceof FormData) ? JSON.stringify(body) : body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.message || "Request failed");
  }

  if (res.status === 204) return null;
  return res.json();
}