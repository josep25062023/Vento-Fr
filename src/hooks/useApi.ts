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