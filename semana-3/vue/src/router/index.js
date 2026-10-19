import { createRouter, createWebHistory } from 'vue-router'
import PaginaInicio from '@/PaginaInicio.vue'
import ListaTareas from '@/01-basico/ListaTareas.vue'
import TablaProductos from '@/02-intermedio/TablaProductos.vue'
import { revisarSesion } from '@/03-avanzado/guardaSesion'
import PaginaLogin from '@/03-avanzado/PaginaLogin.vue'
import PerfilUsuario from '@/03-avanzado/PerfilUsuario.vue'

// Las páginas de los ejercicios. Cada ruta tiene su dirección, un nombre y el componente que muestra.
// /perfil lleva meta.requiereSesion: la guarda solo deja entrar con sesión.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'inicio', component: PaginaInicio },
    { path: '/tareas', name: 'tareas', component: ListaTareas },
    { path: '/productos', name: 'productos', component: TablaProductos },
    { path: '/login', name: 'login', component: PaginaLogin },
    { path: '/perfil', name: 'perfil', component: PerfilUsuario, meta: { requiereSesion: true } },
    // Cualquier otra dirección vuelve al inicio
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// Guarda de navegación global: corre antes de cada cambio de página (ver 03-avanzado/guardaSesion.js)
router.beforeEach(revisarSesion)

export default router
