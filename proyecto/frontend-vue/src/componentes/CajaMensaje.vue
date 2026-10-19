<script setup>
// Muestra un mensaje de éxito, de aviso o de error.
// Si el error trae los campos que fallaron (respuesta 400 de la API), también los lista.
// Si no hay texto, no muestra nada.
defineProps({
  tipo: { type: String, default: 'error' }, // 'error', 'exito' o 'aviso'
  texto: { type: String, default: '' },
  errores: { type: Object, default: null }, // { campo: ['mensaje'] }
})
</script>

<template>
  <div
    v-if="texto"
    class="mensaje"
    :class="`mensaje-${tipo}`"
    :role="tipo === 'error' ? 'alert' : 'status'"
  >
    <p>{{ texto }}</p>
    <ul v-if="errores">
      <li v-for="(lista, campo) in errores" :key="campo">
        <strong>{{ campo }}:</strong> {{ lista.join(', ') }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.mensaje {
  border-radius: var(--radio);
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 1px solid;
}

.mensaje p {
  margin: 0;
}

.mensaje ul {
  margin: 8px 0 0;
  padding-left: 20px;
}

.mensaje-error {
  color: var(--error);
  background: #fdecec;
  border-color: #f3c2c2;
}

.mensaje-exito {
  color: var(--exito);
  background: #e7f6ec;
  border-color: #b7e2c4;
}

.mensaje-aviso {
  color: var(--aviso);
  background: #fff8e1;
  border-color: #f0dc9c;
}
</style>
