import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';

// Si no hay sesión, manda al login y recuerda a qué página quería entrar el usuario.
// Si hay sesión, muestra la página pedida (Outlet).
// Esto solo esconde pantallas: la seguridad de verdad la pone la API con el token.
export default function RutaProtegida() {
  const { token } = useAuth();
  const ubicacion = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname + ubicacion.search }} />;
  }

  return <Outlet />;
}
