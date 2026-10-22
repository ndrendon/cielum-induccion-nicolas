import { pedirApi } from '@/api/cliente'
import { useSesionStore } from '@/stores/sesion'

// Composable que devuelve una función para llamar a la API con el token de la sesión.
// Sirve para cualquier petición: GET, POST o PATCH.
// Si la API responde 401 (el token venció o no sirve), cierra la sesión,
// y App.vue manda al usuario al login.
export function useApi() {
  const sesion = useSesionStore()

  return async function pedir(ruta, opciones = {}) {
    try {
      // El token se lee en el momento de cada petición, así siempre es el actual
      return await pedirApi(ruta, { ...opciones, token: sesion.token })
    } catch (error) {
      if (error.status === 401) {
        sesion.cerrarSesion('Tu sesión venció. Inicia sesión otra vez.')
      }
      throw error
    }
  }
}
