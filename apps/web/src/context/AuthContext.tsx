import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsDemo: (role: 'sample' | 'admin') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    // If guest with no stored access token, initialize as unauthenticated without 401 request spam
    if (!api.getAccessToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get<{ status: string; user: User }>('/auth/me');
      if (res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post<{ status: string; user: User; accessToken: string }>('/auth/login', {
        email,
        password,
      });
      if (res.accessToken) {
        api.setAccessToken(res.accessToken);
      }
      setUser(res.user);
    } catch (err: any) {
      const msg = err.message || 'Failed to sign in. Please verify your credentials.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post<{ status: string; user: User; accessToken: string }>('/auth/register', {
        email,
        password,
        name,
      });
      if (res.accessToken) {
        api.setAccessToken(res.accessToken);
      }
      setUser(res.user);
    } catch (err: any) {
      const msg = err.message || 'Failed to register account.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      api.setAccessToken(null);
      setUser(null);
    }
  };

  const loginAsDemo = async (persona: 'sample' | 'admin') => {
    if (persona === 'admin') {
      await login('demo@myrmyc.app', 'MyRmyC2026!');
    } else {
      try {
        await login('alex.rivera@myrmyc.app', 'MyRmyC2026!');
      } catch {
        // Fallback to demo admin if needed
        await login('demo@myrmyc.app', 'MyRmyC2026!');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        loginAsDemo,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
