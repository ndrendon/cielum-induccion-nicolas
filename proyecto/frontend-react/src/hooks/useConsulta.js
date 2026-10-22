import { useCallback, useEffect, useState } from 'react';
import { useApi } from './useApi.js';

// Pide datos a la API (GET) cuando el componente aparece y cada vez que cambia la ruta.
// Devuelve los datos, si está cargando, el error y una función para volver a pedirlos.
export function useConsulta(ruta) {
  const pedir = useApi();
  const [vuelta, setVuelta] = useState(0); // sube en 1 cada vez que se llama a recargar()
  const [resultado, setResultado] = useState({ clave: null, datos: null, error: null });

  // Cada consulta tiene una clave. Mientras la respuesta guardada no sea de la clave actual, está cargando.
  const clave = `${ruta}#${vuelta}`;
  const cargando = resultado.clave !== clave;

  useEffect(() => {
    // Si la ruta cambia antes de que llegue la respuesta, esa respuesta vieja se ignora
    let vigente = true;

    pedir(ruta)
      .then((datos) => {
        if (vigente) setResultado({ clave, datos, error: null });
      })
      .catch((error) => {
        if (vigente) setResultado({ clave, datos: null, error });
      });

    // Limpieza: se ejecuta antes de volver a pedir y cuando el componente desaparece
    return () => {
      vigente = false;
    };
  }, [clave, ruta, pedir]);

  const recargar = useCallback(() => setVuelta((numero) => numero + 1), []);

  // Mientras carga se siguen mostrando los datos anteriores, para que la pantalla no parpadee
  return { datos: resultado.datos, cargando, error: cargando ? null : resultado.error, recargar };
}
