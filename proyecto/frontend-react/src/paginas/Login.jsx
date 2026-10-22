import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import Mensaje from '../componentes/Mensaje.jsx';
import { useAuth } from '../hooks/useAuth.js';

// Formulario de inicio de sesión (formulario controlado: cada campo vive en el estado)
export default function Login() {
  const { token, aviso, iniciarSesion } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  // A dónde ir después de iniciar sesión: la página que el usuario quería ver, o los pedidos
  const destino = ubicacion.state?.desde ?? '/pedidos';

  // Si ya hay sesión, no tiene sentido mostrar el login
  if (token) {
    return <Navigate to={destino} replace />;
  }

  async function enviar(evento) {
    evento.preventDefault(); // que el navegador no recargue la página
    setEnviando(true);
    setError(null);
    try {
      await iniciarSesion(email, password);
      navegar(destino, { replace: true });
    } catch (errorLogin) {
      setError(errorLogin);
      setEnviando(false);
    }
  }

  return (
    <section className="tarjeta tarjeta-angosta">
      <h1>Iniciar sesión</h1>
      <Mensaje tipo="aviso" texto={aviso} />
      <Mensaje texto={error?.message} errores={error?.errores} />

      <form onSubmit={enviar} className="formulario">
        <label>
          Correo
          <input type="email" value={email} onChange={(evento) => setEmail(evento.target.value)} autoComplete="username" required />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit" className="boton" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="ayuda">
        Usuarios de prueba: <code>vendedor@cielum.test</code> / <code>Vendedor2026*</code> y <code>admin@cielum.test</code> /{' '}
        <code>Admin2026*</code>
      </p>
    </section>
  );
}
