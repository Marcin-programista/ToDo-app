import { setAuthToken } from './api';

const KEY = 'todo_token';
const EMAIL_KEY = 'todo_email';

export function getToken() {
  return localStorage.getItem(KEY);
}

export function getEmail() {
  return localStorage.getItem(EMAIL_KEY);
}

export function saveSession({ token, email }) {
  localStorage.setItem(KEY, token);
  localStorage.setItem(EMAIL_KEY, email);
  setAuthToken(token);
}

export function clearSession() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(EMAIL_KEY);
  setAuthToken(null);
}

export function initAuthFromStorage() {
  const token = getToken();
  if (token) setAuthToken(token);
}
