<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import CajaMensaje from '@/componentes/CajaMensaje.vue'
import { useApi } from '@/composables/useApi'
import { useConsulta } from '@/composables/useConsulta'
import { dinero } from '@/formato'

// Formulario para crear un pedido: se escoge el cliente y uno o varios productos con su cantidad.
// La API crea el pedido en una transacción: si un producto no tiene stock, no se guarda nada.
const pedir = useApi()
const router = useRouter()

// Se sacan los refs de cada consulta con otro nombre, para no mezclar los de clientes con los de productos
const { datos: clientes, cargando: cargandoClientes, error: errorClientes } = useConsulta('/clientes')
const {
  datos: productos,
  cargando: cargandoProductos,
  error: errorProductos,
} = useConsulta('/productos')

let siguienteClave = 2 // la key de cada línea, para que Vue sepa cuál es cuál
const idCliente = ref('')
const lineas = ref([{ clave: 1, idProducto: '', cantidad: 1 }])
const enviando = ref(false)
const error = ref(null)

const listaProductos = computed(() => productos.value ?? [])

function buscarProducto(id) {
  return listaProductos.value.find((producto) => producto.id_producto === id)
}

// Un producto que ya está en otra línea no se puede volver a escoger
function opcionesPara(linea) {
  const usados = lineas.value
    .filter((otra) => otra.clave !== linea.clave)
    .map((otra) => otra.idProducto)
  return listaProductos.value.filter((opcion) => !usados.includes(opcion.id_producto))
}

function subtotal(linea) {
  const producto = buscarProducto(linea.idProducto)
  return producto ? dinero(producto.precio * linea.cantidad) : '—'
}

// Total aproximado con los precios actuales; el total de verdad lo calcula la API
const totalEstimado = computed(() =>
  lineas.value.reduce((suma, linea) => {
    const producto = buscarProducto(linea.idProducto)
    return producto ? suma + producto.precio * linea.cantidad : suma
  }, 0),
)

// En Vue el arreglo se puede cambiar directamente (push) y la pantalla se actualiza sola
function agregarLinea() {
  lineas.value.push({ clave: siguienteClave++, idProducto: '', cantidad: 1 })
}

function quitarLinea(clave) {
  lineas.value = lineas.value.filter((linea) => linea.clave !== clave)
}

async function enviar() {
  error.value = null

  // Revisión antes de llamar a la API, para dar un mensaje claro
  if (!idCliente.value) {
    error.value = { message: 'Escoge el cliente del pedido.' }
    return
  }
  if (lineas.value.some((linea) => !linea.idProducto)) {
    error.value = { message: 'Escoge el producto de cada línea, o quita las líneas vacías.' }
    return
  }
  if (lineas.value.some((linea) => !Number.isInteger(linea.cantidad) || linea.cantidad < 1)) {
    error.value = { message: 'La cantidad de cada producto debe ser un número entero mayor que 0.' }
    return
  }

  enviando.value = true
  try {
    const pedido = await pedir('/pedidos', {
      metodo: 'POST',
      cuerpo: {
        id_cliente: idCliente.value,
        detalle: lineas.value.map((linea) => ({
          id_producto: linea.idProducto,
          cantidad: linea.cantidad,
        })),
      },
    })
    // Va al detalle del pedido nuevo y le pasa el mensaje de éxito en el state de la navegación
    router.push({
      name: 'detalle-pedido',
      params: { id: pedido.id_pedido },
      state: { mensaje: `Pedido ${pedido.id_pedido} creado por ${dinero(pedido.total)}.` },
    })
  } catch (errorApi) {
    error.value = errorApi
    enviando.value = false
  }
}
</script>

<template>
  <p v-if="cargandoClientes || cargandoProductos" class="cargando">
    Cargando clientes y productos...
  </p>

  <CajaMensaje
    v-else-if="errorClientes || errorProductos"
    :texto="`No se pudieron cargar los datos: ${(errorClientes ?? errorProductos).message}`"
  />

  <section v-else class="tarjeta">
    <div class="titulo-con-acciones">
      <h1>Nuevo pedido</h1>
      <RouterLink :to="{ name: 'pedidos' }" class="boton boton-secundario">
        Volver a pedidos
      </RouterLink>
    </div>

    <CajaMensaje :texto="error?.message" :errores="error?.errores" />

    <form class="formulario" @submit.prevent="enviar">
      <label>
        Cliente
        <!-- v-model guarda en idCliente el id (número) del cliente escogido -->
        <select v-model="idCliente">
          <option value="">Escoge un cliente</option>
          <option v-for="cliente in clientes" :key="cliente.id_cliente" :value="cliente.id_cliente">
            {{ cliente.nombre }} · {{ cliente.ciudad }}
          </option>
        </select>
      </label>

      <fieldset class="lineas">
        <legend>Productos</legend>
        <div v-for="(linea, posicion) in lineas" :key="linea.clave" class="linea">
          <select v-model="linea.idProducto" :aria-label="`Producto ${posicion + 1}`">
            <option value="">Escoge un producto</option>
            <option
              v-for="opcion in opcionesPara(linea)"
              :key="opcion.id_producto"
              :value="opcion.id_producto"
            >
              {{ opcion.nombre }} · {{ dinero(opcion.precio) }} · stock {{ opcion.stock }}
            </option>
          </select>
          <!-- .number convierte lo que se escribe en número -->
          <input
            v-model.number="linea.cantidad"
            type="number"
            min="1"
            :aria-label="`Cantidad ${posicion + 1}`"
          />
          <span class="subtotal">{{ subtotal(linea) }}</span>
          <button
            type="button"
            class="boton boton-secundario"
            :disabled="lineas.length === 1"
            @click="quitarLinea(linea.clave)"
          >
            Quitar
          </button>
        </div>
        <button type="button" class="boton boton-secundario" @click="agregarLinea">
          Agregar producto
        </button>
      </fieldset>

      <p class="total">
        Total aproximado: <strong>{{ dinero(totalEstimado) }}</strong>
      </p>

      <button type="submit" class="boton" :disabled="enviando">
        {{ enviando ? 'Creando...' : 'Crear pedido' }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.lineas {
  min-width: 0; /* sin esto, el fieldset crece con el texto largo de las opciones */
  border: 1px solid var(--borde);
  border-radius: var(--radio);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.lineas legend {
  font-weight: 600;
  padding: 0 4px;
}

.linea {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 90px 110px auto;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.linea select {
  min-width: 0; /* deja que el selector se haga angosto en el celular */
}

.subtotal {
  text-align: right;
  color: var(--texto-suave);
}

.total {
  margin: 0;
  font-size: 1.1rem;
}

@media (max-width: 640px) {
  .linea {
    grid-template-columns: 1fr 80px;
  }
}
</style>
