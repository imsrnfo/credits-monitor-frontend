import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Loading from '../pages/Loading';

interface ServerCheckProps {
  children: React.ReactNode;
}

export default function ServerCheck({ children }: ServerCheckProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(false);
  const [hasInitialCheck, setHasInitialCheck] = useState(false);

  const checkServerStatus = async (isInitialCheck = false) => {
    // Si ya estamos en la página de servidor offline, no necesitamos verificar
    if (location.pathname === '/server-offline' && !isInitialCheck) {
      return;
    }

    try {
      if (isInitialCheck) {
        setIsChecking(true);
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/`);
      
      if (!response.ok) {
        throw new Error('Server is not responding correctly');
      }

      // Si estábamos en la página de offline y la conexión se restauró, 
      // volvemos a la página principal
      if (location.pathname === '/server-offline') {
        navigate('/');
      }
    } catch (error) {
      navigate('/server-offline');
    } finally {
      setIsChecking(false);
      if (isInitialCheck) {
        setHasInitialCheck(true);
      }
    }
  };

  useEffect(() => {
    // Solo realizamos la verificación inicial una vez
    if (!hasInitialCheck) {
      checkServerStatus(true);
    }
    
    // Configurar un intervalo para verificar el estado del servidor cada 5 minutos
    const interval = setInterval(() => checkServerStatus(false), 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Solo mostramos la pantalla de carga durante la verificación inicial
  if (isChecking && !hasInitialCheck) {
    return <Loading />;
  }

  return <>{children}</>;
} 