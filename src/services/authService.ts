// RUTA: src/services/authService.ts
import api from '@/lib/axios';
import axios, { AxiosError } from 'axios';
// Importamos la interfaz de respuesta genérica que definimos antes
import { ServiceResponse } from './pedidosService';

// --- INTERFACES DE DATOS Y RESPUESTAS ---

export interface LoginData {
  correo: string;
  contrasena: string;
}

export interface RegisterData {
  nombreCompleto: string;
  correo: string;
  contrasena: string;
}

// Interfaz para el objeto de usuario
export interface User {
  id: string;
  nombreCompleto: string;
  correo: string;
  // Agrega aquí otros campos que la API devuelva para un usuario
}

// Interfaz para la respuesta del endpoint de login/registro
interface AuthResponse {
  token: string;
  user: User;
}

// Interfaz para los errores de la API (puede ser la misma que en otros servicios)
interface ApiError {
  message?: string;
  error?: string;
}

export const authService = {
  // --- LOGIN CORREGIDO ---
  async login(data: LoginData): Promise<ServiceResponse<AuthResponse>> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      return {
        success: true,
        data: response.data, // La respuesta completa (token y user)
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        return {
          success: false,
          error: apiError?.message || 'Error al iniciar sesión'
        };
      }
      return {
        success: false,
        error: (error as Error).message || 'Error inesperado al iniciar sesión'
      };
    }
  },

  // --- REGISTRO CORREGIDO ---
  async register(data: RegisterData): Promise<ServiceResponse<AuthResponse>> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        return {
          success: false,
          error: apiError?.message || 'Error al registrar usuario'
        };
      }
      return {
        success: false,
        error: (error as Error).message || 'Error inesperado al registrar'
      };
    }
  },

  // --- LOGOUT CORREGIDO ---
  // Devuelve `ServiceResponse<null>` porque no hay datos en caso de éxito
  async logout(): Promise<ServiceResponse<null>> {
    try {
      await api.post('/auth/logout/secure');
      return { success: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        return {
          success: false,
          error: apiError?.message || 'Error al cerrar sesión'
        };
      }
      return {
        success: false,
        error: (error as Error).message || 'Error inesperado al cerrar sesión'
      };
    }
  },

  // --- OBTENER PERFIL CORREGIDO ---
  async getProfile(): Promise<ServiceResponse<User>> {
    try {
      const response = await api.get<User>('/auth/me');
      return {
        success: true,
        data: response.data // Aquí la data es directamente el objeto User
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        return {
          success: false,
          error: apiError?.message || 'Error al obtener perfil'
        };
      }
      return {
        success: false,
        error: (error as Error).message || 'Error inesperado al obtener perfil'
      };
    }
  }
};
