// RUTA: src/hooks/useApi.ts
import { useState, useCallback } from 'react';
// Importa esta interfaz desde donde la hayas definido (ej. services/pedidosService.ts o un archivo de tipos global)
import { ServiceResponse } from '@/services/pedidosService'; 

export function useApi<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  // --- MÉTODO EXECUTE CORREGIDO CON USECALLBACK ---
  // La clave es cambiar el tipo de `apiCall` para que espere nuestra respuesta estandarizada.
  const execute = useCallback(async (apiCall: () => Promise<ServiceResponse<T>>) => {
    setLoading(true);
    setError(null);
    
    try {
      // `result` ahora tiene un tipo seguro: ServiceResponse<T>
      const result = await apiCall();
      
      if (result.success) {
        // `result.data` es de tipo `T | undefined`, lo cual es seguro.
        // Se elimina la lógica de `result.user` para mantener el hook genérico.
        setData(result.data || null);
        return result;
      } else {
        setError(result.error || 'Ocurrió un error');
        return result;
      }
    } catch (err) {
      // Este catch es para errores inesperados (ej. de programación), no de la API.
      const errorMessage = (err as Error).message || 'Error inesperado en el hook';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []); // El array de dependencias vacío es correcto aquí.

  // --- RESET CON USECALLBACK (Sin cambios) ---
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset
  };
}
