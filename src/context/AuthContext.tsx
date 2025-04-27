import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const [token, setToken] = useState<string | null>(localStorage.getItem('credit-monitor-token'));
  const navigate = useNavigate();
  const location = useLocation();

  // Función para interceptar errores de autenticación en las respuestas
  const setupAuthInterceptor = () => {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const response = await originalFetch(input, init);
        
        if (response.status === 401 || response.status === 403) {
          logout();
          return response;
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    };
  };

  useEffect(() => {
    setupAuthInterceptor();
    
    // Verificar token inicial y redirigir si es necesario
    const storedToken = localStorage.getItem('credit-monitor-token');
    if (storedToken && location.pathname === '/') {
      setIsAuthenticated(true);
      setToken(storedToken);
      navigate('/dashboard');
    } else if (!storedToken && location.pathname !== '/' && location.pathname !== '/server-offline') {
      navigate('/');
    }
  }, []);

  const login = (userData: any, newToken: string) => {
    setIsAuthenticated(true);
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('credit-monitor-token', newToken);
    navigate('/dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('credit-monitor-token');
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