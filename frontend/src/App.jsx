import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TodosPage from './pages/TodosPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { clearSession, getEmail, getToken } from './auth.js';

export default function App() {
  const navigate = useNavigate();
  const token = getToken();
  const email = getEmail();

  function logout() {
    clearSession();
    navigate('/login');
  }

  return (
    <div className="container">
      <header className="header">
        <Link to="/" className="brand">ToDo</Link>
        <div className="spacer" />
        {token ? (
          <div className="userbar">
            <span className="muted">{email}</span>
            <button className="btn" onClick={logout}>Wyloguj</button>
          </div>
        ) : (
          <nav className="nav">
            <Link className="link" to="/login">Logowanie</Link>
            <Link className="link" to="/register">Rejestracja</Link>
          </nav>
        )}
      </header>

      <Routes>
        <Route path="/" element={<Navigate to={token ? '/todos' : '/login'} replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <TodosPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
