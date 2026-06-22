import { apiFetch, setAdminToken, clearAdminToken, setStoredUserEmail } from "./client.js";

export async function adminPasswordLogin(password) {
  const data = await apiFetch("/auth/admin/password-login", {
    method: "POST",
    body: { password },
  });
  if (data.token) setAdminToken(data.token);
  return data;
}

export async function adminEmailLogin(email, password) {
  const data = await apiFetch("/auth/admin/login", {
    method: "POST",
    body: { email, password },
  });
  if (data.token) setAdminToken(data.token);
  return data;
}

export async function adminLogout() {
  clearAdminToken();
}

export async function getAdminMe() {
  return apiFetch("/auth/admin/me", { admin: true });
}

export async function registerUser({ email, name, phone, password }) {
  const data = await apiFetch("/auth/users/register", {
    method: "POST",
    body: { email, name, phone, password },
  });
  setStoredUserEmail(email);
  return data.user;
}

export async function loginUser({ email, password }) {
  const data = await apiFetch("/auth/users/login", {
    method: "POST",
    body: { email, password },
  });
  setStoredUserEmail(email);
  return data.user;
}
