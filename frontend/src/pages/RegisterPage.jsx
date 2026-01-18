import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { saveSession } from '../auth.js';

export default function RegisterPage() {
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
      const res = await api.post('/auth/register', { email, password });
      saveSession({ token: res.data.accessToken, email: res.data.user.email });
      navigate('/todos');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Nie udało się zarejestrować.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h1>Rejestracja</h1>
      <form onSubmit={onSubmit} className="form">
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Hasło (min. 6 znaków)
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} />
        </label>
        {error ? <div className="error">{error}</div> : null}
        <button className="btn primary" disabled={loading}>
          {loading ? 'Tworzę konto…' : 'Zarejestruj'}
        </button>
      </form>
      <p className="muted">
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </div>
  );
}
