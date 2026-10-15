import { Navigate, useLocation } from 'react-router';
import { useAuth } from './useAuth.js';

// Ruta protegida: si no hay sesión, manda al login y recuerda a qué página quería entrar el usuario.
// Si hay sesión, muestra la página que tiene adentro (children).
// Esto solo esconde la pantalla: la seguridad de verdad la pone la API, que revisa el token.
export default function RutaProtegida({ children }) {
  const { token } = useAuth();
  const ubicacion = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }

  return children;
}
