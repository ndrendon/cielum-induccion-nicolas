import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

// Ejercicio avanzado: store de Pinia con el usuario y el token.
// Es un store de tipo setup: los ref son el estado, los computed son los getters
// y las funciones son las acciones. Cualquier componente lo usa con useSesionStore().
//
// El token se guarda solo en memoria (en el store), no en localStorage.
// Por eso, al recargar la página (F5), hay que iniciar sesión otra vez.
export const useSesionStore = defineStore('sesion', () => {
  // Estado
  const token = ref(null)
  const usuario = ref(null) // { id_usuario, nombre, email, rol }
  const aviso = ref('') // mensaje para el login, por ejemplo "Tu sesión venció"

  // Getter
  const haySesion = computed(() => token.value !== null)

  // Acciones
  async function iniciarSesion(email, password) {
    let respuesta
    try {
      respuesta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
    } catch {
      throw new Error('No se pudo conectar con el servidor.')
    }
    if (respuesta.status === 502) {
      throw new Error('La API no respondió (código 502). Revisa que esté prendida.')
    }
    const datos = await respuesta.json()
    if (!respuesta.ok) {
      // Por ejemplo 401: "Correo o contraseña incorrectos"
      throw new Error(datos.mensaje)
    }
    token.value = datos.token
    usuario.value = datos.usuario
    aviso.value = ''
  }

  function cerrarSesion(mensaje = '') {
    token.value = null
    usuario.value = null
    aviso.value = mensaje
  }

  // Para probar qué pasa cuando el token no sirve: la API va a responder 401
  function usarTokenFalso() {
    token.value = 'este-token-no-sirve'
  }

  return { token, usuario, aviso, haySesion, iniciarSesion, cerrarSesion, usarTokenFalso }
})
