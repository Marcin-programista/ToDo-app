import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const stats = useMemo(() => {
    const done = todos.filter((t) => t.completed).length;
    return { done, total: todos.length };
  }, [todos]);

  async function load() {
    setError('');
    setLoading(true);
    try {
      const res = await api.get('/todos');
      setTodos(res.data);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Nie udało się pobrać listy.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addTodo(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setSaving(true);
    setError('');
    try {
      const res = await api.post('/todos', { title: trimmed });
      setTodos((prev) => [res.data, ...prev]);
      setTitle('');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Nie udało się dodać zadania.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function toggle(todo) {
    setError('');
    // optimistic
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t)));
    try {
      const res = await api.patch(`/todos/${todo.id}`);
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? res.data : t)));
    } catch (err) {
      // rollback
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)));
      const msg = err?.response?.data?.message || 'Nie udało się zmienić statusu.';
      setError(msg);
    }
  }

  async function remove(todo) {
    setError('');
    const snapshot = todos;
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    try {
      await api.delete(`/todos/${todo.id}`);
    } catch (err) {
      setTodos(snapshot);
      const msg = err?.response?.data?.message || 'Nie udało się usunąć zadania.';
      setError(msg);
    }
  }

  return (
    <div className="card">
      <div className="row">
        <h1>Twoje zadania</h1>
        <div className="muted">Ukończone: {stats.done}/{stats.total}</div>
      </div>

      <form onSubmit={addTodo} className="row gap">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Dodaj nowe zadanie…"
          maxLength={140}
        />
        <button className="btn primary" disabled={saving}>Dodaj</button>
      </form>

      {error ? <div className="error">{error}</div> : null}

      {loading ? (
        <p className="muted">Ładuję…</p>
      ) : todos.length === 0 ? (
        <p className="muted">Brak zadań. Dodaj pierwsze 🙂</p>
      ) : (
        <ul className="list">
          {todos.map((t) => (
            <li key={t.id} className="item">
              <label className="checkbox">
                <input type="checkbox" checked={t.completed} onChange={() => toggle(t)} />
                <span className={t.completed ? 'done' : ''}>{t.title}</span>
              </label>
              <button className="btn" onClick={() => remove(t)}>Usuń</button>
            </li>
          ))}
        </ul>
      )}

      <div className="row">
        <button className="btn" onClick={load}>Odśwież</button>
        <span className="muted">API: {import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}</span>
      </div>
    </div>
  );
}
