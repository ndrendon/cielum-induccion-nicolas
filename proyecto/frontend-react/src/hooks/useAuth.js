import { useContext } from 'react';
import { AuthContexto } from '../contexto/auth-contexto.js';

// Devuelve la sesión: token, usuario, aviso, iniciarSesion y cerrarSesion
export function useAuth() {
  return useContext(AuthContexto);
}
