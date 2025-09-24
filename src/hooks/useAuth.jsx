import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('auth_token') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    function syncStorage(e) {
      if (!e || (e.key && !['user', 'auth_token'].includes(e.key))) return;
      try {
        const raw = localStorage.getItem('user');
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
      try {
        setToken(localStorage.getItem('auth_token') || '');
      } catch {
        setToken('');
      }
    }
    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);

  const isAuthed = !!token;

  const login = useCallback(async ({ email, password }) => {
    const data = await apiLogin({ email, password });
    const tokenFromApi = data?.token || '';
    const userFromApi = data?.user || null;
    try {
      if (tokenFromApi) localStorage.setItem('auth_token', tokenFromApi);
      if (userFromApi) localStorage.setItem('user', JSON.stringify(userFromApi));
    } catch {}
    setToken(tokenFromApi);
    setUser(userFromApi);
    return data;
  }, []);

  const register = useCallback(async ({ username, email, password, passwordConfirmation, avatar }) => {
    const data = await apiRegister({ username, email, password, passwordConfirmation, avatar });
    const tokenFromApi = data?.token || '';
    const userFromApi = data?.user || null;
    try {
      if (tokenFromApi) localStorage.setItem('auth_token', tokenFromApi);
      if (userFromApi) localStorage.setItem('user', JSON.stringify(userFromApi));
    } catch {}
    setToken(tokenFromApi);
    setUser(userFromApi);
    return data;
  }, []);

  const logout = useCallback(() => {
    try {
      apiLogout();
    } finally {
      setUser(null);
      setToken('');
    }
  }, []);

  const value = useMemo(() => ({ user, setUser, isAuthed, login, register, logout }), [user, isAuthed, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


