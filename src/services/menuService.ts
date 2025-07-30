// src/services/menuService.ts
import api from '@/lib/axios';

export interface Platillo {
  id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  disponible: boolean;
  categoria: string;
}

export const menuService = {
  // Crear platillo
  async createPlatillo(data: Omit<Platillo, 'id'>) {
    try {
      console.log('🚀 Creating platillo:', data);
      const response = await api.post('/menu', data);
      console.log('✅ Platillo created:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('❌ Create platillo error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || error.message || 'Error al crear platillo'
      };
    }
  },

  // Obtener mis platillos
  async getMisPlatillos() {
    try {
      const response = await api.get('/menu/mis-platillos');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener platillos'
      };
    }
  },

  // Actualizar platillo
  async updatePlatillo(id: string, data: Partial<Omit<Platillo, 'id'>>) {
    try {
      const response = await api.patch(`/menu/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar platillo'
      };
    }
  },

  // Eliminar platillo
  async deletePlatillo(id: string) {
    try {
      await api.delete(`/menu/${id}`);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar platillo'
      };
    }
  }
};
