import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getAuthState, saveAuthState, clearAuthState } from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  apiKey: string;
  login: (apiKey: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState(() => getAuthState());

  const login = (apiKey: string) => {
    saveAuthState(apiKey);
    setAuthState({ isAuthenticated: true, apiKey });
  };

  const logout = () => {
    clearAuthState();
    setAuthState({ isAuthenticated: false, apiKey: '' });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
