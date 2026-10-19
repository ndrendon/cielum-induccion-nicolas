import { ref, toValue, watch } from 'vue'
import { useSesionStore } from './sesion'

// Composable: pide una ruta de la API con el token del store, en el header Authorization.
// Devuelve refs con { datos, cargando, error } y la función recargar.
// Vuelve a pedir solo cuando cambia la ruta o el token.
// Si la API responde 401 (el token venció o no sirve), cierra la sesión.
export function useApi(ruta) {
  const sesion = useSesionStore()
  const datos = ref(null)
  const cargando = ref(true)
  const error = ref('')

  async function cargar() {
    // Sin token no hay nada que pedir (por ejemplo, justo después de cerrar la sesión)
    if (!sesion.token) {
      return
    }
    cargando.value = true
    error.value = ''

    let respuesta
    try {
      respuesta = await fetch(`/api${toValue(ruta)}`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      })
    } catch {
      error.value = 'No se pudo conectar con el servidor.'
      cargando.value = false
      return
    }

    if (respuesta.status === 401) {
      sesion.cerrarSesion('Tu sesión venció o el token no sirve. Inicia sesión otra vez.')
    } else if (respuesta.ok) {
      datos.value = await respuesta.json()
    } else {
      error.value = `La API respondió con el código ${respuesta.status}.`
    }
    cargando.value = false
  }

  // immediate: pide apenas se crea el componente, y otra vez si cambia la ruta o el token
  watch([() => toValue(ruta), () => sesion.token], cargar, { immediate: true })

  return { datos, cargando, error, recargar: cargar }
}
