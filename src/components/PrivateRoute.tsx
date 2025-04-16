import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export const PrivateRoute = () => {
  const { isAuthenticated, token, logout } = useAuth();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        logout();
        return;
      }

      try {
        // Validar el token con Google
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          logout();
        }
      } catch (error) {
        console.error('Error validating token:', error);
        logout();
      }
    };

    validateToken();
  }, [token, logout]);

  return isAuthenticated && token ? <Outlet /> : <Navigate to="/" replace />;
}; 