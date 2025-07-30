// src/services/authService.ts
import api from '@/lib/axios';

export interface LoginData {
  correo: string;
  contrasena: string;
}

export interface RegisterData {
  nombreCompleto: string;
  correo: string;
  contrasena: string;
}

export interface User {
  id: string;
  nombreCompleto: string;
  correo: string;
  // agregar otros campos según la respuesta de la API
}

export const authService = {
  // Login
  async login(data: LoginData) {
    try {
      const response = await api.post('/auth/login', data);
      return {
        success: true,
        data: response.data,
        user: response.data.user || response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  },

  // Registro
  async register(data: RegisterData) {
    try {
      const response = await api.post('/auth/register', data);
      return {
        success: true,
        data: response.data,
        user: response.data.user || response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrar usuario'
      };
    }
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout/secure');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cerrar sesión'
      };
    }
  },

  // Obtener perfil del usuario
  async getProfile() {
    try {
      const response = await api.get('/auth/me');
      return {
        success: true,
        user: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener perfil'
      };
    }
  }
};


