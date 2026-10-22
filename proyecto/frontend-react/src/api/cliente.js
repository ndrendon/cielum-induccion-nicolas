// Funciones para hablar con la API del proyecto.
// Todas las peticiones van a /api/...: en desarrollo las pasa Vite (vite.config.js)
// y en Docker las pasa nginx (nginx.conf). Así el frontend no necesita saber el puerto de la API.

const BASE = '/api';

// Error con el código HTTP y lo que respondió la API
export class ErrorApi extends Error {
  constructor(status, mensaje, errores) {
    super(mensaje);
    this.status = status;
    // Cuando la API responde 400, trae el problema de cada campo: { campo: ['mensaje'] }
    this.errores = errores;
  }
}

export async function pedirApi(ruta, { metodo = 'GET', cuerpo, token } = {}) {
  const encabezados = {};
  if (cuerpo !== undefined) {
    encabezados['Content-Type'] = 'application/json';
  }
  if (token) {
    encabezados.Authorization = `Bearer ${token}`;
  }

  let respuesta;
  try {
    respuesta = await fetch(`${BASE}${ruta}`, {
      method: metodo,
      headers: encabezados,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ErrorApi(0, 'No se pudo conectar con la API. Revisa que esté prendida.');
  }

  // 204 significa que salió bien y no hay nada que mostrar
  if (respuesta.status === 204) {
    return null;
  }

  // Si la API no está prendida, el proxy responde un error que no es JSON
  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const mensaje = datos?.mensaje ?? 'La API no respondió. Revisa que esté prendida.';
    throw new ErrorApi(respuesta.status, mensaje, datos?.errores);
  }

  return datos;
}
