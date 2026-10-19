<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

// Ejercicio intermedio: tabla de productos.
// Cuando la página ya está en pantalla (onMounted), le pide los productos a la API (GET /productos).
// Mientras llegan se muestra "Cargando...", y si algo falla se muestra el error con un botón para reintentar.
// GET /productos es público en la API, así que no necesita token.

const pesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

// Pide la lista a la API. Si la API no responde bien, lanza un error con un mensaje para mostrar.
async function pedirProductos(ruta) {
  let respuesta
  try {
    respuesta = await fetch(ruta)
  } catch {
    throw new Error('No se pudo conectar con el servidor.')
  }
  // Cuando la API está apagada, Vite responde 502
  if (respuesta.status === 502) {
    throw new Error('La API no respondió (código 502). Revisa que esté prendida.')
  }
  if (!respuesta.ok) {
    throw new Error(`La API respondió con el código ${respuesta.status}.`)
  }
  return respuesta.json()
}

const productos = ref([])
const cargando = ref(true) // empieza en true porque la página pide los datos apenas aparece
const error = ref('')
const simularError = ref(false)
let vuelta = 0 // cuenta las peticiones: solo se usa la respuesta de la última
let enPantalla = true // pasa a false cuando la página desaparece

const pocoStock = computed(() => productos.value.filter((producto) => producto.stock < 10).length)

async function cargar() {
  const estaVuelta = ++vuelta
  cargando.value = true
  error.value = ''
  // Con el casillero marcado se pide una ruta que no existe, para ver cómo se muestra el error
  const ruta = simularError.value ? '/api/productos-que-no-existen' : '/api/productos'
  try {
    const lista = await pedirProductos(ruta)
    if (enPantalla && estaVuelta === vuelta) {
      productos.value = lista
    }
  } catch (errorCarga) {
    if (enPantalla && estaVuelta === vuelta) {
      error.value = errorCarga.message
    }
  } finally {
    if (enPantalla && estaVuelta === vuelta) {
      cargando.value = false
    }
  }
}

// onMounted: la página ya está en pantalla, entonces pide los productos
onMounted(cargar)

// onUnmounted: si la página desaparece antes de que llegue la respuesta, esa respuesta se ignora
onUnmounted(() => {
  enPantalla = false
})

// watch: al marcar o desmarcar "Simular un error", vuelve a pedir los productos
watch(simularError, cargar)
</script>

<template>
  <section class="tarjeta">
    <h1>Productos</h1>
    <p class="ayuda">Vienen de la API del proyecto: <code>GET /productos</code>.</p>

    <label class="casilla">
      <input v-model="simularError" type="checkbox" />
      Simular un error (pedir una ruta que no existe)
    </label>

    <p v-if="cargando" class="cargando">Cargando productos...</p>

    <div v-else-if="error" class="mensaje mensaje-error" role="alert">
      <p>No se pudieron cargar los productos. {{ error }}</p>
      <button type="button" class="boton boton-secundario" @click="cargar">Reintentar</button>
    </div>

    <p v-else-if="productos.length === 0" class="vacio">No hay productos.</p>

    <template v-else>
      <div class="tabla-contenedor">
        <table class="tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th class="numero">Precio</th>
              <th class="numero">Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in productos" :key="producto.id_producto">
              <td>{{ producto.id_producto }}</td>
              <td>{{ producto.nombre }}</td>
              <td>{{ producto.categoria }}</td>
              <td class="numero">{{ pesos.format(producto.precio) }}</td>
              <td class="numero">
                <span v-if="producto.stock < 10" class="etiqueta-poco">Poco stock</span>
                {{ producto.stock }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="ayuda">{{ productos.length }} productos · {{ pocoStock }} con poco stock.</p>
    </template>
  </section>
</template>

<style scoped>
.etiqueta-poco {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: #fff4d6;
  color: #7a5200;
}
</style>
