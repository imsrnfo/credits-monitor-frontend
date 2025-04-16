import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export default function Login() {
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credentials received from Google');
      }

      // Decode the JWT to get user info
      const userInfo: GoogleUserInfo = jwtDecode(credentialResponse.credential);

      // First validate with our backend
      const backendResponse = await fetch('http://127.0.0.1:8080/api/secure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${credentialResponse.credential}`
        }
      });

      if (backendResponse.status !== 200) {
        throw new Error('Backend validation failed');
      }

      // Get the token from backend response
      const backendToken = await backendResponse.text();
      
      // Store the backend token in localStorage
      localStorage.setItem('credit-monitor-token', backendToken);

      // Use the decoded user info directly
      login(userInfo, credentialResponse.credential);
    } catch (error) {
      console.error('Error during login process:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Iniciar Sesión
        </h1>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.error('Login Failed');
            }}
            useOneTap
            theme="filled_black"
            shape="pill"
            size="large"
            text="continue_with"
            locale="es"
          />
        </div>
      </div>
    </div>
  );
} 