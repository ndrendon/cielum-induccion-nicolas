<script setup>
import { computed, ref, watch } from 'vue'
import TareaItem from './TareaItem.vue'

// Ejercicio básico: lista de tareas.
// - v-model conecta el campo de texto con la variable "nueva" y el casillero con "soloPendientes".
// - v-for dibuja un TareaItem por cada tarea, con su id como key.
// - computed calcula las pendientes y las tareas que se ven; watch avisa cuando se terminan todas.
// - Este componente es el dueño de la lista: TareaItem solo la muestra y avisa con emits.

const tareas = ref([
  { id: 1, texto: 'Leer la guía de Vue', hecha: true },
  { id: 2, texto: 'Hacer la lista de tareas', hecha: false },
  { id: 3, texto: 'Subir el código a GitHub', hecha: false },
])
let siguienteId = 4
const nueva = ref('')
const soloPendientes = ref(false)
const felicitacion = ref('')

// Se vuelven a calcular solos cada vez que cambian las tareas o el casillero
const pendientes = computed(() => tareas.value.filter((tarea) => !tarea.hecha).length)
const hechas = computed(() => tareas.value.length - pendientes.value)
const visibles = computed(() =>
  soloPendientes.value ? tareas.value.filter((tarea) => !tarea.hecha) : tareas.value,
)

// Vigila el número de pendientes: cuando llega a 0, felicita; si vuelve a haber pendientes, quita el mensaje
watch(pendientes, (ahora, antes) => {
  if (ahora === 0 && antes > 0) {
    felicitacion.value = '¡Terminaste todas las tareas!'
  } else if (ahora > 0) {
    felicitacion.value = ''
  }
})

function agregar() {
  const texto = nueva.value.trim()
  if (!texto) {
    return
  }
  // En Vue el arreglo se puede cambiar directamente y la pantalla se actualiza sola
  tareas.value.push({ id: siguienteId++, texto, hecha: false })
  nueva.value = ''
}

function cambiar(id) {
  const tarea = tareas.value.find((cadaTarea) => cadaTarea.id === id)
  tarea.hecha = !tarea.hecha
}

function borrar(id) {
  tareas.value = tareas.value.filter((tarea) => tarea.id !== id)
}

function borrarHechas() {
  tareas.value = tareas.value.filter((tarea) => !tarea.hecha)
  felicitacion.value = ''
}
</script>

<template>
  <section class="tarjeta">
    <h1>Lista de tareas</h1>

    <!-- @submit.prevent: al dar Enter o Agregar se llama a agregar() sin recargar la página -->
    <form class="fila" @submit.prevent="agregar">
      <input v-model="nueva" placeholder="Escribe una tarea" aria-label="Nueva tarea" />
      <button type="submit" class="boton" :disabled="!nueva.trim()">Agregar</button>
    </form>
    <p class="ayuda">
      Lo que dice la variable <code>nueva</code>: "{{ nueva }}" ({{ nueva.length }} letras)
    </p>

    <label class="casilla">
      <input v-model="soloPendientes" type="checkbox" />
      Mostrar solo las pendientes
    </label>

    <ul v-if="visibles.length > 0" class="tareas">
      <TareaItem
        v-for="tarea in visibles"
        :key="tarea.id"
        :tarea="tarea"
        @cambiar="cambiar"
        @borrar="borrar"
      />
    </ul>
    <p v-else-if="soloPendientes && tareas.length > 0" class="vacio">No hay tareas pendientes.</p>
    <p v-else class="vacio">No hay tareas. Escribe una y dale Agregar.</p>

    <p class="ayuda">Pendientes: {{ pendientes }} de {{ tareas.length }}</p>
    <p v-if="felicitacion" class="mensaje mensaje-exito">{{ felicitacion }}</p>

    <!-- v-show: el botón siempre existe, solo se esconde con CSS cuando no hay tareas hechas -->
    <button v-show="hechas > 0" type="button" class="boton boton-secundario" @click="borrarHechas">
      Borrar las hechas ({{ hechas }})
    </button>
  </section>
</template>
