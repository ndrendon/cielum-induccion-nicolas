import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { pedirApi } from '@/api/cliente'

// Store de Pinia con la sesión: quién inició sesión y su token. Lo comparte con toda la aplicación.
// Es un store de tipo setup: los ref son el estado, los computed son los getters y las funciones son las acciones.
//
// El token se guarda solo en memoria (en el store), no en localStorage:
// así ningún script de la página lo puede leer guardado en el navegador.
// Por eso, si se recarga la página, hay que iniciar sesión otra vez.
export const useSesionStore = defineStore('sesion', () => {
  const token = ref(null)
  const usuario = ref(null) // { id_usuario, nombre, email, rol }
  const aviso = ref('') // mensaje para mostrar en el login, por ejemplo "Tu sesión venció"

  const haySesion = computed(() => token.value !== null)

  async function iniciarSesion(email, password) {
    const datos = await pedirApi('/auth/login', { metodo: 'POST', cuerpo: { email, password } })
    token.value = datos.token
    usuario.value = datos.usuario
    aviso.value = ''
  }

  function cerrarSesion(mensaje = '') {
    token.value = null
    usuario.value = null
    aviso.value = mensaje
  }

  return { token, usuario, aviso, haySesion, iniciarSesion, cerrarSesion }
})
