import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export const PrivateRoute = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const validateToken = async () => {
      const creditMonitorToken = localStorage.getItem('credit-monitor-token');
      
      if (!creditMonitorToken) {
        logout();
        return;
      }
    };

    validateToken();
  }, [logout]);

  const creditMonitorToken = localStorage.getItem('credit-monitor-token');
  return creditMonitorToken ? <Outlet /> : <Navigate to="/" replace />;
}; 