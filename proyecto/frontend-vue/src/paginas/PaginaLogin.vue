<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CajaMensaje from '@/componentes/CajaMensaje.vue'
import { useSesionStore } from '@/stores/sesion'

// Formulario de inicio de sesión. Cada campo está conectado a su variable con v-model.
const sesion = useSesionStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const enviando = ref(false)
const error = ref(null)

// A dónde ir después de iniciar sesión: la página que el usuario quería ver (?desde=...), o los pedidos.
// Solo se aceptan direcciones de esta misma aplicación, que empiezan con una sola /.
function destino() {
  const desde = route.query.desde
  if (typeof desde === 'string' && desde.startsWith('/') && !desde.startsWith('//')) {
    return desde
  }
  return '/pedidos'
}

async function enviar() {
  enviando.value = true
  error.value = null
  try {
    await sesion.iniciarSesion(email.value, password.value)
    router.replace(destino())
  } catch (errorLogin) {
    error.value = errorLogin
    enviando.value = false
  }
}
</script>

<template>
  <section class="tarjeta tarjeta-angosta">
    <h1>Iniciar sesión</h1>
    <CajaMensaje tipo="aviso" :texto="sesion.aviso" />
    <CajaMensaje :texto="error?.message" :errores="error?.errores" />

    <!-- .prevent hace que el navegador no recargue la página al enviar -->
    <form class="formulario" @submit.prevent="enviar">
      <label>
        Correo
        <input v-model.trim="email" type="email" autocomplete="username" required />
      </label>
      <label>
        Contraseña
        <input v-model="password" type="password" autocomplete="current-password" required />
      </label>
      <button type="submit" class="boton" :disabled="enviando">
        {{ enviando ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <p class="ayuda">
      Usuarios de prueba: <code>vendedor@cielum.test</code> / <code>Vendedor2026*</code> y
      <code>admin@cielum.test</code> / <code>Admin2026*</code>
    </p>
  </section>
</template>
