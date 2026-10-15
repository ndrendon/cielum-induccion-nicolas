import { useContext } from 'react';
import { AuthContexto } from './auth-contexto.js';

// Custom hook: devuelve la sesión que guarda AuthProvider
// (token, usuario, aviso, iniciarSesion, cerrarSesion y usarTokenFalso)
export function useAuth() {
  return useContext(AuthContexto);
}
