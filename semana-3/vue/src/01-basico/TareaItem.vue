<script setup>
// Una fila de la lista de tareas.
// Props: recibe la tarea que va a mostrar. Solo la lee: no la cambia.
// Emits: cuando el usuario la marca o la borra, avisa a ListaTareas.vue con el id,
// y ListaTareas.vue, que es el dueño de la lista, hace el cambio.
defineProps({
  tarea: { type: Object, required: true }, // { id, texto, hecha }
})

const emit = defineEmits(['cambiar', 'borrar'])
</script>

<template>
  <!-- :class agrega la clase "hecha" solo cuando tarea.hecha es verdadero -->
  <li :class="{ hecha: tarea.hecha }">
    <label class="casilla">
      <input type="checkbox" :checked="tarea.hecha" @change="emit('cambiar', tarea.id)" />
      <span>{{ tarea.texto }}</span>
    </label>
    <button type="button" class="boton boton-peligro" @click="emit('borrar', tarea.id)">
      Borrar
    </button>
  </li>
</template>

<!-- scoped: estos estilos solo se aplican a este componente -->
<style scoped>
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--borde);
}

.casilla {
  margin: 0;
}

.hecha span {
  text-decoration: line-through;
  color: var(--texto-suave);
}
</style>
