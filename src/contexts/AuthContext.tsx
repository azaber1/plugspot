import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Mock users database (in real app, this would be an API)
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'demo@plugspot.com',
    name: 'Demo User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
      role: 'host',
    verified: true,
    createdAt: new Date().toISOString(),
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('plugspot_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('plugspot_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const foundUser = MOCK_USERS.find((u) => u.email === email);
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      localStorage.setItem('plugspot_user', JSON.stringify(foundUser));
      return true;
    }
    
    // Allow any email/password for demo (create new user)
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role: 'user',
      verified: false,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('plugspot_user', JSON.stringify(newUser));
    return true;
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    // Mock signup
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role: 'user',
      verified: false,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('plugspot_user', JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('plugspot_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
