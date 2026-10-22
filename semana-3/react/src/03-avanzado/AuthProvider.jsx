import { useCallback, useMemo, useState } from 'react';
import { AuthContexto } from './auth-contexto.js';

// Guarda la sesión (el token y el usuario) y la comparte con toda la aplicación por medio del contexto.
// El token se guarda solo en memoria, en el estado de React: al recargar la página hay que volver a entrar.
export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(null); // { token, usuario }
  const [aviso, setAviso] = useState(''); // mensaje para el login, por ejemplo "Tu sesión venció"

  // Manda el correo y la contraseña a POST /auth/login. Si salen bien, guarda el token y el usuario.
  const iniciarSesion = useCallback(async (email, password) => {
    let respuesta;
    try {
      respuesta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      throw new Error('No se pudo conectar con el servidor.');
    }
    const datos = await respuesta.json().catch(() => null);
    if (!respuesta.ok) {
      throw new Error(datos?.mensaje ?? 'La API no respondió. Revisa que esté prendida.');
    }
    setSesion({ token: datos.token, usuario: datos.usuario });
    setAviso('');
  }, []);

  const cerrarSesion = useCallback((mensaje = '') => {
    setSesion(null);
    setAviso(mensaje);
  }, []);

  // Solo para practicar: cambia el token por uno falso, para ver qué pasa cuando la API responde 401
  const usarTokenFalso = useCallback(() => {
    setSesion((actual) => ({ ...actual, token: 'token-falso' }));
  }, []);

  // useMemo: el objeto del contexto solo cambia cuando cambia la sesión o el aviso
  const valor = useMemo(
    () => ({
      token: sesion?.token ?? null,
      usuario: sesion?.usuario ?? null,
      aviso,
      iniciarSesion,
      cerrarSesion,
      usarTokenFalso,
    }),
    [sesion, aviso, iniciarSesion, cerrarSesion, usarTokenFalso],
  );

  return <AuthContexto.Provider value={valor}>{children}</AuthContexto.Provider>;
}
