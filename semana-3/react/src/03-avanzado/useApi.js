import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth.js';

// Custom hook useApi: pide datos a una ruta de la API (GET) con el token de la sesión.
// Devuelve los datos, si está cargando, el error y una función para volver a pedirlos.
// Si la API responde 401 (el token no sirve o venció), cierra la sesión.
//
// Se usa así:  const { datos, cargando, error, recargar } = useApi('/auth/perfil');
export function useApi(ruta) {
  const { token, cerrarSesion } = useAuth();
  const [intento, setIntento] = useState(0); // al sumarle 1, se vuelve a pedir
  const [resultado, setResultado] = useState({ clave: null, datos: null, error: '' });

  // Cada petición tiene una clave: la ruta, el token y el intento.
  // Mientras el resultado guardado no sea el de la clave actual, la petición está cargando.
  const clave = `${ruta}|${token}|${intento}`;
  const cargando = resultado.clave !== clave;

  useEffect(() => {
    // Si llega la respuesta de una petición vieja (por ejemplo, el usuario se fue de la página), se ignora
    let vigente = true;

    async function pedir() {
      let respuesta;
      try {
        respuesta = await fetch(`/api${ruta}`, {
          // El token va en el header Authorization, después de la palabra Bearer
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        throw new Error('No se pudo conectar con el servidor.');
      }

      const datos = await respuesta.json().catch(() => null);

      if (respuesta.status === 401) {
        cerrarSesion('Tu sesión venció o el token no sirve. Inicia sesión otra vez.');
        throw new Error(datos?.mensaje ?? 'Debes iniciar sesión.');
      }
      if (!respuesta.ok) {
        throw new Error(datos?.mensaje ?? `La API respondió con el código ${respuesta.status}.`);
      }
      return datos;
    }

    pedir()
      .then((datos) => {
        if (vigente) setResultado({ clave, datos, error: '' });
      })
      .catch((error) => {
        if (vigente) setResultado({ clave, datos: null, error: error.message });
      });

    // Limpieza: se ejecuta antes de volver a pedir y cuando el componente desaparece
    return () => {
      vigente = false;
    };
  }, [clave, ruta, token, cerrarSesion]); // si cambia la ruta, el token o el intento, se vuelve a pedir

  const recargar = useCallback(() => setIntento((numero) => numero + 1), []);

  return {
    datos: cargando ? null : resultado.datos,
    cargando,
    error: cargando ? '' : resultado.error,
    recargar,
  };
}
