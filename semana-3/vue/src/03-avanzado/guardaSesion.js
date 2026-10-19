import { useSesionStore } from './sesion'

// Ejercicio avanzado: guarda de ruta.
// router/index.js la registra con router.beforeEach, así que corre antes de cada cambio de página.
// Recibe la página a la que se va (to) y decide:
// - Si la página pide sesión (meta.requiereSesion) y no hay token, manda al login
//   y le pasa en ?desde= la página que el usuario quería ver.
// - Si no devuelve nada, deja pasar.
// No se manda al login a quien ya va para el login, para no hacer un ciclo infinito.
// Esto solo esconde pantallas: la seguridad de verdad la pone la API, que revisa el token.
export function revisarSesion(to) {
  const sesion = useSesionStore()

  if (to.meta.requiereSesion && !sesion.haySesion) {
    return { name: 'login', query: { desde: to.fullPath } }
  }
}
