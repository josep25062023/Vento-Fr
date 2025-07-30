// src/lib/axios.ts
import axios from 'axios';

const API_BASE_URL = 'https://vento-ba-production.up.railway.app';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Importante para enviar cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar tokens si los necesitas
    console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data);
    console.error('❌ Error details:', {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      headers: error.config?.headers
    });
    
    // Si hay error 401, redirigir a login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

