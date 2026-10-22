<script setup>
import { storeToRefs } from 'pinia'
import { useApi } from './useApi'
import { useSesionStore } from './sesion'

// Página protegida: la guarda de ruta solo deja entrar con sesión (meta.requiereSesion en router/index.js).
// Usa useApi dos veces: para el perfil (GET /auth/perfil) y para los clientes (GET /clientes).
// Las dos rutas de la API piden token, y useApi lo pone en cada petición.
const sesion = useSesionStore()
// storeToRefs saca el usuario del store sin perder la reactividad; las acciones se sacan directamente
const { usuario } = storeToRefs(sesion)
const { cerrarSesion, usarTokenFalso } = sesion

// Se sacan los refs de cada llamada con otro nombre, para no mezclar los del perfil con los de los clientes
const { datos: datosPerfil, cargando: cargandoPerfil, error: errorPerfil } = useApi('/auth/perfil')
const {
  datos: datosClientes,
  cargando: cargandoClientes,
  error: errorClientes,
  recargar: recargarClientes,
} = useApi('/clientes')
</script>

<template>
  <section v-if="usuario" class="tarjeta">
    <div class="titulo-con-acciones">
      <h1>Hola, {{ usuario.nombre }}</h1>
      <button type="button" class="boton boton-secundario" @click="cerrarSesion()">
        Cerrar sesión
      </button>
    </div>

    <h2>Mi perfil según la API</h2>
    <p v-if="cargandoPerfil" class="cargando">Cargando el perfil...</p>
    <p v-else-if="errorPerfil" class="mensaje mensaje-error">{{ errorPerfil }}</p>
    <dl v-else-if="datosPerfil" class="resumen">
      <div>
        <dt>Id</dt>
        <dd>{{ datosPerfil.id_usuario }}</dd>
      </div>
      <div>
        <dt>Nombre</dt>
        <dd>{{ datosPerfil.nombre }}</dd>
      </div>
      <div>
        <dt>Rol</dt>
        <dd>{{ datosPerfil.rol }}</dd>
      </div>
    </dl>

    <div class="titulo-con-acciones">
      <h2>Clientes</h2>
      <button type="button" class="boton boton-secundario" @click="recargarClientes">
        Volver a pedir
      </button>
    </div>
    <p v-if="cargandoClientes" class="cargando">Cargando los clientes...</p>
    <p v-else-if="errorClientes" class="mensaje mensaje-error">{{ errorClientes }}</p>
    <div v-else-if="datosClientes" class="tabla-contenedor">
      <table class="tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ciudad</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in datosClientes" :key="cliente.id_cliente">
            <td>{{ cliente.nombre }}</td>
            <td>{{ cliente.ciudad }}</td>
            <td>{{ cliente.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Probar un token que no sirve</h2>
    <p class="ayuda">
      Este botón cambia el token del store por uno falso. La API responde 401, useApi cierra la sesión
      y la página manda al login.
    </p>
    <button type="button" class="boton boton-peligro" @click="usarTokenFalso">
      Usar un token falso
    </button>
  </section>
</template>
