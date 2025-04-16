import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="407468779295-n5k2ibcrss2b08hm4b238ifslabsut65.apps.googleusercontent.com">
        <AuthProvider>
          <ThemeProvider>
            <AppWrapper>
              <App />
            </AppWrapper>
          </ThemeProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
