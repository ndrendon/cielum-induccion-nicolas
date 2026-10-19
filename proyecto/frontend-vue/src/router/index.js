import { createRouter, createWebHistory } from 'vue-router'
import PaginaDetallePedido from '@/paginas/PaginaDetallePedido.vue'
import PaginaLogin from '@/paginas/PaginaLogin.vue'
import PaginaNoEncontrada from '@/paginas/PaginaNoEncontrada.vue'
import PaginaNuevoPedido from '@/paginas/PaginaNuevoPedido.vue'
import PaginaPedidos from '@/paginas/PaginaPedidos.vue'
import { useSesionStore } from '@/stores/sesion'

// Las rutas de la aplicación. Las que tienen meta.requiereSesion necesitan sesión.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: PaginaLogin },
    { path: '/', redirect: '/pedidos' },
    { path: '/pedidos', name: 'pedidos', component: PaginaPedidos, meta: { requiereSesion: true } },
    {
      path: '/pedidos/nuevo',
      name: 'nuevo-pedido',
      component: PaginaNuevoPedido,
      meta: { requiereSesion: true },
    },
    {
      path: '/pedidos/:id',
      name: 'detalle-pedido',
      component: PaginaDetallePedido,
      meta: { requiereSesion: true },
    },
    // Cualquier otra dirección
    { path: '/:pathMatch(.*)*', name: 'no-encontrada', component: PaginaNoEncontrada },
  ],
})

// Guarda de navegación: se ejecuta antes de cada cambio de página.
// - Si la página pide sesión y no hay token, manda al login y recuerda a dónde quería ir el usuario.
// - Si ya hay sesión y se va al login, manda a los pedidos.
// - Si no devuelve nada, deja pasar.
// Esto solo esconde pantallas: la seguridad de verdad la pone la API, que revisa el token.
router.beforeEach((to) => {
  const sesion = useSesionStore()

  if (to.meta.requiereSesion && !sesion.haySesion) {
    return { name: 'login', query: { desde: to.fullPath } }
  }

  if (to.name === 'login' && sesion.haySesion) {
    return { name: 'pedidos' }
  }
})

export default router
