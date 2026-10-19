<script setup>
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EncabezadoTienda from '@/componentes/EncabezadoTienda.vue'
import { useSesionStore } from '@/stores/sesion'

const sesion = useSesionStore()
const route = useRoute()
const router = useRouter()

// La guarda del router solo revisa la sesión cuando se cambia de página.
// Si la sesión se cierra estando en una página que la pide (con el botón o porque la API respondió 401),
// este watch manda al login y recuerda la página, para volver a ella después de entrar.
watch(
  () => sesion.token,
  (token) => {
    if (!token && route.meta.requiereSesion) {
      router.replace({ name: 'login', query: { desde: route.fullPath } })
    }
  },
)
</script>

<template>
  <EncabezadoTienda />
  <main class="contenido">
    <!-- Aquí se dibuja la página que corresponde a la dirección (ver router/index.js) -->
    <RouterView />
  </main>
</template>
