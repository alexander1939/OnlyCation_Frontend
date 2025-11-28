import axios from 'axios';

// Evento personalizado para notificar errores de API
export const API_ERROR_EVENT = 'api-connection-error';
export const API_SUCCESS_EVENT = 'api-connection-success';

export interface ApiErrorDetails {
  url: string;
  status?: number;
  message: string;
  timestamp: number;
}

// Función para notificar error de API
export const notifyApiError = (details: ApiErrorDetails) => {
  const event = new CustomEvent(API_ERROR_EVENT, { detail: details });
  window.dispatchEvent(event);
};

// Función para notificar éxito de API
export const notifyApiSuccess = (url: string) => {
  const event = new CustomEvent(API_SUCCESS_EVENT, { detail: { url, timestamp: Date.now() } });
  window.dispatchEvent(event);
};

// Interceptor para fetch que detecta errores de API
export const createApiInterceptor = () => {
  const originalFetch = window.fetch;
  
  // Axios: notificar éxito/error también para peticiones hechas con axios
  axios.interceptors.response.use(
    (response) => {
      try {
        const url = response?.config?.url || 'axios';
        notifyApiSuccess(url);
      } catch {}
      return response;
    },
    (error) => {
      try {
        const url = error?.config?.url || error?.request?.responseURL || 'axios';
        notifyApiError({
          url,
          status: error?.response?.status,
          message: error?.message || 'Error de conexión',
          timestamp: Date.now(),
        });
      } catch {}
      return Promise.reject(error);
    }
  );

  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      
      // Si la respuesta es exitosa, notificar éxito
      if (response.ok) {
        notifyApiSuccess(args[0] as string);
      } else if (response.status >= 500) {
        // Error del servidor
        notifyApiError({
          url: args[0] as string,
          status: response.status,
          message: `Error del servidor: ${response.status}`,
          timestamp: Date.now()
        });
      }
      
      return response;
    } catch (error) {
      // Error de red o conexión
      notifyApiError({
        url: args[0] as string,
        message: error instanceof Error ? error.message : 'Error de conexión',
        timestamp: Date.now()
      });
      
      throw error;
    }
  };
};

// Restaurar fetch original
export const restoreOriginalFetch = () => {
  // Esta función se puede usar para restaurar fetch si es necesario
  // En una implementación real, guardarías una referencia al fetch original
};
