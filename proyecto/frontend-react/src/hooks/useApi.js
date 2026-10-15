import { useCallback } from 'react';
import { pedirApi } from '../api/cliente.js';
import { useAuth } from './useAuth.js';

// Devuelve una función para llamar a la API con el token de la sesión.
// Si la API responde 401 (el token venció o no sirve), cierra la sesión
// y la ruta protegida manda al usuario al login.
export function useApi() {
  const { token, cerrarSesion } = useAuth();

  return useCallback(
    async (ruta, opciones = {}) => {
      try {
        return await pedirApi(ruta, { ...opciones, token });
      } catch (error) {
        if (error.status === 401) {
          cerrarSesion('Tu sesión venció. Inicia sesión otra vez.');
        }
        throw error;
      }
    },
    [token, cerrarSesion],
  );
}
