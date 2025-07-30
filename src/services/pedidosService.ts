// src/services/pedidosService.ts
import api from '@/lib/axios';

export interface DetallePedido {
  platilloId: string;
  cantidad: number;
  notasEspeciales?: string;
}

export interface PedidoData {
  notas?: string;
  detalles: DetallePedido[];
}

export interface PedidoUpdate {
  notas?: string;
  estado?: 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
}

export const pedidosService = {
  // Crear pedido
  async createPedido(data: PedidoData) {
    try {
      console.log('🚀 Creating pedido:', data);
      const response = await api.post('/pedidos', data);
      console.log('✅ Pedido created:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('❌ Create pedido error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || error.message || 'Error al crear pedido'
      };
    }
  },

  // Obtener mis pedidos
  async getMisPedidos() {
    try {
      const response = await api.get('/pedidos/mis-pedidos');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener pedidos'
      };
    }
  },

  // Actualizar pedido
  async updatePedido(id: string, data: PedidoUpdate) {
    try {
      const response = await api.patch(`/pedidos/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar pedido'
      };
    }
  }
};

// src/hooks/useApi.ts
import { useState } from 'react';

export function useApi<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (apiCall: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      
      if (result.success) {
        setData(result.data || result.user);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error inesperado';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return {
    loading,
    error,
    data,
    execute,
    reset
  };
}