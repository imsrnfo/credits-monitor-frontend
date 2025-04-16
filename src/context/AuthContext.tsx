import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  login: (userData: any, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const navigate = useNavigate();

  const login = (userData: any, token: string) => {
    setIsAuthenticated(true);
    setUser(userData);
    setToken(token);
    localStorage.setItem('auth_token', token);
    navigate('/dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 