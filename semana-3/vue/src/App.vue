<script setup>
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSesionStore } from '@/03-avanzado/sesion'

const sesion = useSesionStore()
const route = useRoute()
const router = useRouter()

// La guarda solo corre cuando se cambia de página. Si la sesión se cierra estando en el perfil
// (con el botón o porque la API respondió 401), este watch manda al login.
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
  <header class="encabezado">
    <RouterLink :to="{ name: 'inicio' }" class="marca">Ejercicios · Vue</RouterLink>
    <nav class="menu">
      <RouterLink :to="{ name: 'tareas' }">Tareas</RouterLink>
      <RouterLink :to="{ name: 'productos' }">Productos</RouterLink>
      <RouterLink :to="{ name: 'perfil' }">Perfil</RouterLink>
    </nav>
    <span class="sesion">
      {{ sesion.usuario ? `Sesión: ${sesion.usuario.nombre}` : 'Sin sesión' }}
    </span>
  </header>

  <main class="contenido">
    <RouterView />
  </main>
</template>
