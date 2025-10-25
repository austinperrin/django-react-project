import { getTokens, refreshAccessToken, clearTokens } from "./auth";

const API_BASE = "/api";

async function rawRequest(path, options = {}, withAuth = true) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (withAuth) {
    const tokens = getTokens();
    if (tokens?.access) headers["Authorization"] = `Bearer ${tokens.access}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  return res;
}

async function request(path, options = {}) {
  // First try
  let res = await rawRequest(path, options, true);

  // If unauthorized, attempt one refresh, then retry once
  if (res.status === 401) {
    try {
      await refreshAccessToken();
      res = await rawRequest(path, options, true);
    } catch (e) {
      clearTokens();
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  // 204?
  if (res.status === 204) return {};
  return res.json();
}

export const api = {
  // Auth-adjacent
  me: () => request("/auth/me/"),

  // Todos
  listTodos: () => request("/todos/"),
  createTodo: (data) =>
    request("/todos/", { method: "POST", body: JSON.stringify(data) }),
  updateTodo: (id, data) =>
    request(`/todos/${id}/`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteTodo: (id) => request(`/todos/${id}/`, { method: "DELETE" }),
};
