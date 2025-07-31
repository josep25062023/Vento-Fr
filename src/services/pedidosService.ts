// RUTA: src/services/pedidosService.ts
import api from '@/lib/axios';
import axios from 'axios';

// --- INTERFACES EXPORTADAS Y CENTRALIZADAS ---

// Interfaz para los detalles de un platillo dentro de un pedido
export interface PedidoDetalle {
  id: string;
  platilloId: string;
  cantidad: number;
  precio: number;
  notasEspeciales?: string;
}

// La interfaz `Pedido` ahora es más completa
export interface Pedido {
  id: string;
  numero?: string;
  cliente?: string;
  notas?: string;
  estado: 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
  total: number;
  createdAt: string;
  detalles: PedidoDetalle[];
}

export interface PedidoData {
  notas?: string;
  detalles: Array<{
    platilloId: string;
    cantidad: number;
    notasEspeciales?: string;
  }>;
}

export interface PedidoUpdate {
  notas?: string;
  estado?: 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ApiError {
  message?: string;
  error?: string;
}

export const pedidosService = {
  // Los métodos del servicio ahora usan la interfaz `Pedido` actualizada
  async createPedido(data: PedidoData): Promise<ServiceResponse<Pedido>> {
    try {
      const response = await api.post<Pedido>('/pedidos', data);
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        return { success: false, error: apiError?.message || 'Error al crear pedido' };
      }
      return { success: false, error: (error as Error).message || 'Error inesperado' };
    }
  },

  async getMisPedidos(): Promise<ServiceResponse<Pedido[]>> {
    try {
      const response = await api.get<Pedido[]>('/pedidos/mis-pedidos');
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        return { success: false, error: apiError?.message || 'Error al obtener pedidos' };
      }
      return { success: false, error: (error as Error).message || 'Error inesperado' };
    }
  },

  async updatePedido(id: string, data: PedidoUpdate): Promise<ServiceResponse<Pedido>> {
    try {
      const response = await api.patch<Pedido>(`/pedidos/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        return { success: false, error: apiError?.message || 'Error al actualizar pedido' };
      }
      return { success: false, error: (error as Error).message || 'Error inesperado' };
    }
  }
};
