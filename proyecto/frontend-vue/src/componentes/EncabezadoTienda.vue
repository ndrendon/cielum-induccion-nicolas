<script setup>
import { useSesionStore } from '@/stores/sesion'

// Barra de arriba: el nombre de la aplicación y, si hay sesión, el menú y el usuario
const sesion = useSesionStore()
</script>

<template>
  <header class="encabezado">
    <span class="marca">Tienda · Pedidos <span class="etiqueta">Vue</span></span>

    <template v-if="sesion.usuario">
      <nav class="menu">
        <RouterLink :to="{ name: 'pedidos' }">Pedidos</RouterLink>
        <RouterLink :to="{ name: 'nuevo-pedido' }">Nuevo pedido</RouterLink>
      </nav>
      <div class="usuario">
        <span>
          {{ sesion.usuario.nombre }} <span class="rol">{{ sesion.usuario.rol }}</span>
        </span>
        <button type="button" class="boton boton-secundario" @click="sesion.cerrarSesion()">
          Cerrar sesión
        </button>
      </div>
    </template>
  </header>
</template>

<!-- scoped: estos estilos solo se aplican a este componente -->
<style scoped>
.encabezado {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 32px;
  padding: 12px 24px;
  background: var(--texto);
  color: #fff;
}

.marca {
  font-weight: 700;
  font-size: 1.1rem;
}

.etiqueta {
  margin-left: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: #42b883;
  color: #10301f;
}

.menu {
  display: flex;
  gap: 16px;
}

.menu a {
  color: #c9d4df;
  text-decoration: none;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
}

/* RouterLink le pone esta clase al enlace de la página en la que está el usuario */
.menu a.router-link-exact-active {
  color: #fff;
  border-bottom-color: #fff;
}

.usuario {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.rol {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
}

.encabezado .boton-secundario {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.5);
}

.encabezado .boton-secundario:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
