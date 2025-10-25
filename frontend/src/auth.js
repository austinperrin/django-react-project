// A tiny auth helper for demo purposes (localStorage).
// For production, prefer httpOnly cookies for refresh tokens + CSRF protection.

const STORAGE_KEY = "auth_tokens"; // { access, refresh }

export function getTokens() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setTokens(tokens) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function clearTokens() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function login(username, password) {
  const res = await fetch("/api/auth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  const data = await res.json(); // {access, refresh}
  setTokens(data);
  return data;
}

export async function refreshAccessToken() {
  const tokens = getTokens();
  if (!tokens?.refresh) throw new Error("No refresh token");
  const res = await fetch("/api/auth/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });
  if (!res.ok) throw new Error("Refresh failed");
  const data = await res.json(); // {access}
  const next = { ...tokens, access: data.access };
  setTokens(next);
  return next.access;
}
