import axios, { InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Add a request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('credit-monitor-token');
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      if (!config.headers.get('Authorization')) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

export default api; 