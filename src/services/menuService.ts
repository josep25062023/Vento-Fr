// RUTA: src/services/menuService.ts
import api from '@/lib/axios';
import axios, { AxiosError } from 'axios';
// Importamos la interfaz de respuesta genérica
import { ServiceResponse } from './pedidosService';

// --- INTERFACES DE DATOS Y RESPUESTAS ---

// La interfaz Platillo ya estaba bien definida y exportada.
export interface Platillo {
  id: string; // Se asume que la API siempre devuelve un ID
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  disponible: boolean;
  categoria: string;
}

// Interfaz para los errores de la API
interface ApiError {
  message?: string;
  error?: string;
}

export const menuService = {
  // --- CREAR PLATILLO CORREGIDO ---
  async createPlatillo(data: Omit<Platillo, 'id'>): Promise<ServiceResponse<Platillo>> {
    try {
      console.log('🚀 Creating platillo:', data);
      const response = await api.post<Platillo>('/menu', data);
      console.log('✅ Platillo created:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Create platillo error:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        return {
          success: false,
          error: apiError?.message || apiError?.error || 'Error al crear platillo'
        };
      }
      return {
        success: false,
        error: (error as Error).message || 'Error inesperado al crear platillo'
      };
    }
  },

  // --- OBTENER MIS PLATILLOS CORREGIDO ---
  async getMisPlatillos(): Promise<ServiceResponse<Platillo[]>> {
    try {
      const response = await api.get<Platillo[]>('/menu/mis-platillos');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        return {
          success: false,
          error: apiError?.message || 'Error al obtener platillos'
        };
      }
      return {
        success: false,
        error: (error as Error).message || 'Error inesperado al obtener platillos'
      };
    }
  },

  // --- ACTUALIZAR PLATILLO CORREGIDO ---
  async updatePlatillo(id: string, data: Partial<Omit<Platillo, 'id'>>): Promise<ServiceResponse<Platillo>> {
    try {
      const response = await api.patch<Platillo>(`/menu/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        return {
          success: false,
          error: apiError?.message || 'Error al actualizar platillo'
        };
      }
      return {
        success: false,
        error: (error as Error).message || 'Error inesperado al actualizar platillo'
      };
    }
  },

  // --- ELIMINAR PLATILLO CORREGIDO ---
  async deletePlatillo(id: string): Promise<ServiceResponse<null>> {
    try {
      await api.delete(`/menu/${id}`);
      return { success: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        return {
          success: false,
          error: apiError?.message || 'Error al eliminar platillo'
        };
      }
      return {
        success: false,
        error: (error as Error).message || 'Error inesperado al eliminar platillo'
      };
    }
  }
};
