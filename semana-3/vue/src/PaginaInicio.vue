<script setup>
// La página de inicio, con un enlace a cada ejercicio
const ejercicios = [
  {
    ruta: '/tareas',
    nivel: 'Básico',
    clase: 'basico',
    nombre: 'Lista de tareas',
    que: 'v-for y v-model, con computed, watch, props y emits',
  },
  {
    ruta: '/productos',
    nivel: 'Intermedio',
    clase: 'intermedio',
    nombre: 'Tabla de productos',
    que: 'onMounted pide GET /productos, con carga y error',
  },
  {
    ruta: '/perfil',
    nivel: 'Avanzado',
    clase: 'avanzado',
    nombre: 'Pinia y guarda de ruta',
    que: 'Store con el usuario y el token, y una página que pide sesión',
  },
]
</script>

<template>
  <section class="tarjeta">
    <h1>Ejercicios del día 12</h1>
    <ul class="lista-ejercicios">
      <li v-for="ejercicio in ejercicios" :key="ejercicio.ruta">
        <span class="nivel" :class="`nivel-${ejercicio.clase}`">{{ ejercicio.nivel }}</span>
        <RouterLink :to="ejercicio.ruta">{{ ejercicio.nombre }}</RouterLink>
        <span class="ayuda">{{ ejercicio.que }}</span>
      </li>
    </ul>
  </section>
</template>
