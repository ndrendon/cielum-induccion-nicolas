import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from './useAuth.js';

// Login del ejercicio avanzado. Después de entrar, vuelve a la página que el usuario quería ver.
export default function Login() {
  const { token, aviso, iniciarSesion } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // La página que el usuario quería ver la manda RutaProtegida; si no hay ninguna, va al perfil
  const destino = ubicacion.state?.desde ?? '/perfil';

  // Si ya hay sesión, no tiene sentido mostrar el login
  if (token) {
    return <Navigate to={destino} replace />;
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await iniciarSesion(email, password);
      navegar(destino, { replace: true });
    } catch (errorLogin) {
      setError(errorLogin.message);
      setEnviando(false);
    }
  }

  return (
    <section className="tarjeta tarjeta-angosta">
      <h1>Iniciar sesión</h1>
      {aviso && <p className="mensaje mensaje-aviso">{aviso}</p>}
      {error && (
        <p className="mensaje mensaje-error" role="alert">
          {error}
        </p>
      )}

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
        Usuario de prueba: <code>vendedor@cielum.test</code> / <code>Vendedor2026*</code>
      </p>
    </section>
  );
}
