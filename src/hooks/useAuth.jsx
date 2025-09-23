import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { logout as apiLogout } from '../api/auth';

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
    function sync() {
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

    function syncStorage(e) {
      if (!e || (e.key && !['user', 'auth_token'].includes(e.key))) return;
      sync();
    }

    window.addEventListener('auth:user-updated', sync);
    window.addEventListener('storage', syncStorage);
    return () => {
      window.removeEventListener('auth:user-updated', sync);
      window.removeEventListener('storage', syncStorage);
    };
  }, []);

  const isAuthed = !!token;

  function logout() {
    try {
      apiLogout();
    } finally {
      setUser(null);
      setToken('');
    }
  }

  const value = useMemo(() => ({ user, setUser, isAuthed, logout }), [user, isAuthed]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


