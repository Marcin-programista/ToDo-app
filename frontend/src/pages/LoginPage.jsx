import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { saveSession } from '../auth.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      saveSession({ token: res.data.accessToken, email: res.data.user.email });
      navigate('/todos');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Nie udało się zalogować.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h1>Logowanie</h1>
      <form onSubmit={onSubmit} className="form">
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Hasło
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        {error ? <div className="error">{error}</div> : null}
        <button className="btn primary" disabled={loading}>
          {loading ? 'Loguję…' : 'Zaloguj'}
        </button>
      </form>
      <p className="muted">
        Nie masz konta? <Link to="/register">Zarejestruj się</Link>
      </p>
    </div>
  );
}
