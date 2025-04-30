import { useNavigate } from 'react-router-dom';

export default function ServerOffline() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('//');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Servidor Fuera de Línea
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Lo sentimos, no podemos conectar con el servidor en este momento. Por favor, inténtelo de nuevo más tarde.
        </p>
        <button
          onClick={handleRetry}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
} 