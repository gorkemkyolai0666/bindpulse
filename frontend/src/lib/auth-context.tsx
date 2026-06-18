'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; firmName: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('bindpulse_token');
    if (saved) {
      setToken(saved);
      api.auth.me(saved)
        .then((u: any) => setUser(u))
        .catch(() => { localStorage.removeItem('bindpulse_token'); setToken(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res: any = await api.auth.login({ email, password });
    setToken(res.accessToken);
    setUser(res.user);
    localStorage.setItem('bindpulse_token', res.accessToken);
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string; firmName: string }) => {
    const res: any = await api.auth.register(data);
    setToken(res.accessToken);
    setUser(res.user);
    localStorage.setItem('bindpulse_token', res.accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bindpulse_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
