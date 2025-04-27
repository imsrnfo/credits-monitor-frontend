import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../services/api';

export const PrivateRoute = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      const creditMonitorToken = localStorage.getItem('credit-monitor-token');
      
      if (!creditMonitorToken) {
        logout();
        setValid(false);
        setLoading(false);
        return;
      }

      try {
        // Intentar hacer una petición al backend para validar el token
        const response = await api.get('/validate/token');

        if (response.status !== 200) {
          throw new Error('Token validation failed');
        }
        setValid(true);
      } catch (error) {
        logout();
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [logout]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (!valid) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}; 