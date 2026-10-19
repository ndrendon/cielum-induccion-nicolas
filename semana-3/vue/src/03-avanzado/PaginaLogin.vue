<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSesionStore } from './sesion'

// Formulario de login. Al entrar, guarda el token en el store y vuelve a la página que el usuario quería ver.
const sesion = useSesionStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const enviando = ref(false)
const error = ref('')

async function enviar() {
  enviando.value = true
  error.value = ''
  try {
    await sesion.iniciarSesion(email.value, password.value)
    // La guarda dejó en ?desde= la página que pidió sesión. Solo se usan direcciones de esta aplicación.
    const desde = route.query.desde
    const vaDentro = typeof desde === 'string' && desde.startsWith('/') && !desde.startsWith('//')
    router.replace(vaDentro ? desde : { name: 'perfil' })
  } catch (errorLogin) {
    error.value = errorLogin.message
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <section class="tarjeta tarjeta-angosta">
    <h1>Iniciar sesión</h1>
    <p v-if="sesion.aviso" class="mensaje mensaje-aviso">{{ sesion.aviso }}</p>
    <p v-if="error" class="mensaje mensaje-error" role="alert">{{ error }}</p>

    <template v-if="sesion.haySesion">
      <p>Ya iniciaste sesión como {{ sesion.usuario.nombre }}.</p>
      <RouterLink :to="{ name: 'perfil' }">Ir al perfil</RouterLink>
    </template>

    <form v-else class="formulario" @submit.prevent="enviar">
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
      <p class="ayuda">
        Usuario de prueba: <code>vendedor@cielum.test</code> / <code>Vendedor2026*</code>
      </p>
    </form>
  </section>
</template>
