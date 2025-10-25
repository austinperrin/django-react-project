import { useEffect, useState } from "react";
import { api } from "./api";
import { clearTokens } from "./auth";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const [user, data] = await Promise.all([api.me(), api.listTodos()]);
      setMe(user);
      setTodos(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const newTodo = await api.createTodo({ title: title.trim() });
      setTodos((t) => [newTodo, ...t]);
      setTitle("");
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggleCompleted(todo) {
    try {
      const updated = await api.updateTodo(todo.id, { completed: !todo.completed });
      setTodos((ts) => ts.map((t) => (t.id === todo.id ? updated : t)));
    } catch (e) {
      setError(e.message);
    }
  }

  async function removeTodo(id) {
    try {
      await api.deleteTodo(id);
      setTodos((ts) => ts.filter((t) => t.id !== id));
    } catch (e) {
      setError(e.message);
    }
  }

  function logout() {
    clearTokens();
    window.location.reload(); // simplest state reset for demo
  }

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", padding: "0 1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Todos</h1>
        {me && (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ color: "#666" }}>Signed in as <b>{me.username}</b></span>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </header>

      <form onSubmit={addTodo} style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Add a todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button type="submit">Add</button>
      </form>

      {error && (
        <p style={{ color: "crimson", marginTop: 8 }}>
          <strong>Error:</strong> {error}
        </p>
      )}

      {loading ? (
        <p style={{ marginTop: 16 }}>Loading…</p>
      ) : todos.length === 0 ? (
        <p style={{ marginTop: 16 }}>No todos yet. Add one!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleCompleted(todo)}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#888" : "inherit",
                }}
              >
                {todo.title}
              </span>
              <button onClick={() => removeTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
