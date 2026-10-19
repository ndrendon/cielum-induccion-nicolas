import { ref, toValue, watch } from 'vue'
import { useApi } from './useApi'

// Composable que pide datos a la API (GET) cuando el componente aparece y cada vez que cambia la ruta.
// La ruta puede ser un texto fijo, como '/clientes', o una función que la arma,
// por ejemplo con los filtros de la URL. Si la ruta queda vacía, no pide nada.
// Devuelve refs con los datos, si está cargando y el error, y una función para volver a pedir.
export function useConsulta(ruta) {
  const pedir = useApi()
  const datos = ref(null)
  const cargando = ref(true)
  const error = ref(null)
  let vuelta = 0 // cuenta las peticiones, para ignorar una respuesta vieja que llegue tarde

  async function cargar() {
    const rutaActual = toValue(ruta)
    if (!rutaActual) {
      return
    }

    const estaVuelta = ++vuelta
    cargando.value = true
    error.value = null
    try {
      const respuesta = await pedir(rutaActual)
      if (estaVuelta === vuelta) {
        datos.value = respuesta
      }
    } catch (errorApi) {
      if (estaVuelta === vuelta) {
        datos.value = null
        error.value = errorApi
      }
    } finally {
      if (estaVuelta === vuelta) {
        cargando.value = false
      }
    }
  }

  // immediate: true hace que pida apenas se crea el componente, y después cada vez que la ruta cambia.
  // Mientras carga se siguen mostrando los datos anteriores, para que la pantalla no parpadee.
  watch(() => toValue(ruta), cargar, { immediate: true })

  return { datos, cargando, error, recargar: cargar }
}
