const API_BASE = "/api"; // thanks to vite proxy

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export const api = {
  listTodos: () => request("/todos/"),
  createTodo: (data) =>
    request("/todos/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTodo: (id, data) =>
    request(`/todos/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteTodo: (id) =>
    request(`/todos/${id}/`, { method: "DELETE" }).then(() => ({})),
};
