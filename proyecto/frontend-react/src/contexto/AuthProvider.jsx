import { useCallback, useMemo, useState } from 'react';
import { pedirApi } from '../api/cliente.js';
import { AuthContexto } from './auth-contexto.js';

// Guarda quién inició sesión y su token, y lo comparte con toda la aplicación.
//
// El token se guarda solo en memoria (en el estado de React), no en localStorage:
// así ningún script de la página lo puede leer guardado en el navegador.
// Por eso, si se recarga la página, hay que iniciar sesión otra vez.
export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(null); // { token, usuario }
  const [aviso, setAviso] = useState(''); // mensaje para mostrar en el login, por ejemplo "Tu sesión venció"

  const iniciarSesion = useCallback(async (email, password) => {
    const datos = await pedirApi('/auth/login', { metodo: 'POST', cuerpo: { email, password } });
    setSesion({ token: datos.token, usuario: datos.usuario });
    setAviso('');
  }, []);

  const cerrarSesion = useCallback((mensaje = '') => {
    setSesion(null);
    setAviso(mensaje);
  }, []);

  // useMemo evita crear un objeto nuevo en cada dibujo, para que los componentes
  // que leen el contexto solo se vuelvan a dibujar cuando la sesión cambia de verdad
  const valor = useMemo(
    () => ({
      token: sesion?.token ?? null,
      usuario: sesion?.usuario ?? null,
      aviso,
      iniciarSesion,
      cerrarSesion,
    }),
    [sesion, aviso, iniciarSesion, cerrarSesion],
  );

  return <AuthContexto.Provider value={valor}>{children}</AuthContexto.Provider>;
}
