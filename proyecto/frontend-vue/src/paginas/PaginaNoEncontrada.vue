<!-- Lo que se muestra cuando la URL no coincide con ninguna ruta -->
<template>
  <section class="tarjeta tarjeta-angosta">
    <h1>Esta página no existe</h1>
    <RouterLink :to="{ name: 'pedidos' }">Ir a los pedidos</RouterLink>
  </section>
</template>
