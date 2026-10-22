<script setup>
// La etiqueta de color con el estado de un pedido
defineProps({
  estado: { type: String, required: true },
})
</script>

<template>
  <span class="estado" :class="`estado-${estado}`">{{ estado }}</span>
</template>

<style scoped>
.estado {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.estado-pendiente {
  background: #fff4d6;
  color: #7a5200;
}

.estado-enviado {
  background: #e3edff;
  color: #1a4fb0;
}

.estado-entregado {
  background: #dcf5e3;
  color: #17602d;
}

.estado-cancelado {
  background: #f3e1e1;
  color: #8f1d1d;
}
</style>
