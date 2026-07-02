import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({ title: "", description: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/tasks`);
      if (!response.ok) {
        throw new Error("Unable to load tasks.");
      }
      const data = await response.json();
      setTasks(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formValues.title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formValues.title.trim(),
          description: formValues.description.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to create task.");
      }

      const newTask = await response.json();
      setTasks((prev) => [...prev, newTask]);
      setFormValues({ title: "", description: "" });
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create task.");
    }
  };

  const handleToggle = async (task) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update task status.");
      }

      const updated = await response.json();
      setTasks((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update task.");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok && response.status !== 204) {
        throw new Error("Unable to delete task.");
      }

      setTasks((prev) => prev.filter((item) => item.id !== taskId));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete task.");
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">React + FastAPI</p>
        <h1>Todo list</h1>
        <p className="subtitle">Create quick tasks and track progress across devices.</p>
      </header>

      <form className="task-form" onSubmit={handleSubmit}>
        <label>
          Task title
          <input
            value={formValues.title}
            onChange={(event) => setFormValues({ ...formValues, title: event.target.value })}
            placeholder="Buy groceries"
          />
        </label>
        <label>
          Description (optional)
          <textarea
            rows={3}
            value={formValues.description}
            onChange={(event) => setFormValues({ ...formValues, description: event.target.value })}
            placeholder="Milk, bread, and eggs"
          />
        </label>
        <button type="submit">Add task</button>
      </form>

      {error && <p className="error-banner">{error}</p>}

      <section className="task-list">
        {loading ? (
          <p className="status">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p className="status">No tasks yet. Add one above to get started.</p>
        ) : (
          tasks
            .slice()
            .sort((a, b) => Number(a.completed) - Number(b.completed) || a.id - b.id)
            .map((task) => (
              <article key={task.id} className={`task-card ${task.completed ? "completed" : ""}`}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description || "No description yet."}</p>
                </div>
                <div className="task-actions">
                  <button type="button" onClick={() => handleToggle(task)}>
                    {task.completed ? "Mark as pending" : "Mark as done"}
                  </button>
                  <button type="button" className="destructive" onClick={() => handleDelete(task.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
        )}
      </section>
    </div>
  );
}

export default App;
