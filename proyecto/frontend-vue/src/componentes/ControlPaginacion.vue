<script setup>
// Botones para moverse entre las páginas de una lista.
// Recibe la página actual y los totales por props, y avisa con el evento "cambiar" a qué página ir.
// La página que lo usa es la que cambia la URL.
defineProps({
  pagina: { type: Number, required: true },
  totalPaginas: { type: Number, required: true },
  total: { type: Number, required: true },
})

const emit = defineEmits(['cambiar'])
</script>

<template>
  <div class="paginacion">
    <button
      type="button"
      class="boton boton-secundario"
      :disabled="pagina <= 1"
      @click="emit('cambiar', pagina - 1)"
    >
      Anterior
    </button>
    <span>
      Página {{ pagina }} de {{ Math.max(totalPaginas, 1) }} · {{ total }}
      {{ total === 1 ? 'pedido' : 'pedidos' }}
    </span>
    <button
      type="button"
      class="boton boton-secundario"
      :disabled="pagina >= totalPaginas"
      @click="emit('cambiar', pagina + 1)"
    >
      Siguiente
    </button>
  </div>
</template>

<style scoped>
.paginacion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--texto-suave);
}
</style>
