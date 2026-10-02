const BASE_URL = "https://jsonplaceholder.typicode.com";
const TIEMPO_LIMITE_MS = 8000;

async function obtenerJSON(ruta) {
  let respuesta;

  try {
    respuesta = await fetch(`${BASE_URL}${ruta}`, {
      signal: AbortSignal.timeout(TIEMPO_LIMITE_MS),
    });
  } catch (error) {
    throw new Error(`No se pudo conectar con la API (${ruta}): ${error.message}`);
  }

  if (!respuesta.ok) {
    throw new Error(`La API respondió ${respuesta.status} en ${ruta}`);
  }

  return respuesta.json();
}

export function obtenerUsuarios() {
  return obtenerJSON("/users");
}

export function obtenerPosts() {
  return obtenerJSON("/posts");
}
