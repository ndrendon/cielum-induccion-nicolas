<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import CajaMensaje from '@/componentes/CajaMensaje.vue'
import EstadoPedido from '@/componentes/EstadoPedido.vue'
import { useApi } from '@/composables/useApi'
import { useConsulta } from '@/composables/useConsulta'
import { ESTADOS, dinero } from '@/formato'

// Detalle de un pedido y formulario para cambiar su estado
const route = useRoute() // route.params.id es el id que viene en la URL: /pedidos/13
const pedir = useApi()
const { datos, cargando, error } = useConsulta(() =>
  route.params.id ? `/pedidos/${route.params.id}` : '',
)

// Al cambiar el estado, la API devuelve el pedido actualizado; se muestra ese en vez del que se cargó
const actualizado = ref(null)
const pedido = computed(() =>
  actualizado.value && String(actualizado.value.id_pedido) === route.params.id
    ? actualizado.value
    : datos.value,
)

const nuevoEstado = ref('')
const guardando = ref(false)
// El mensaje de éxito puede venir de la página anterior (pedido creado), en el state de la navegación
const exito = ref(window.history.state?.mensaje ?? '')
const errorEstado = ref(null)

const cancelado = computed(() => pedido.value?.estado === 'cancelado')
const opcionesEstado = computed(() => ESTADOS.filter((opcion) => opcion !== pedido.value?.estado))

async function guardarEstado() {
  guardando.value = true
  exito.value = ''
  errorEstado.value = null
  try {
    const respuesta = await pedir(`/pedidos/${route.params.id}/estado`, {
      metodo: 'PATCH',
      cuerpo: { estado: nuevoEstado.value },
    })
    actualizado.value = respuesta
    exito.value =
      respuesta.estado === 'cancelado'
        ? 'Pedido cancelado. Las unidades volvieron al stock.'
        : `Estado cambiado a ${respuesta.estado}.`
    nuevoEstado.value = ''
  } catch (errorApi) {
    errorEstado.value = errorApi
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <p v-if="cargando && !pedido" class="cargando">Cargando el pedido...</p>

  <section v-else-if="error" class="tarjeta">
    <CajaMensaje :texto="error.message" />
    <RouterLink :to="{ name: 'pedidos' }">Volver a pedidos</RouterLink>
  </section>

  <section v-else-if="pedido" class="tarjeta">
    <div class="titulo-con-acciones">
      <h1>Pedido #{{ pedido.id_pedido }}</h1>
      <RouterLink :to="{ name: 'pedidos' }" class="boton boton-secundario">
        Volver a pedidos
      </RouterLink>
    </div>

    <CajaMensaje tipo="exito" :texto="exito" />
    <CajaMensaje :texto="errorEstado?.message" :errores="errorEstado?.errores" />

    <dl class="resumen">
      <div>
        <dt>Cliente</dt>
        <dd>{{ pedido.cliente }}</dd>
      </div>
      <div>
        <dt>Fecha</dt>
        <dd>{{ pedido.fecha }}</dd>
      </div>
      <div>
        <dt>Estado</dt>
        <dd><EstadoPedido :estado="pedido.estado" /></dd>
      </div>
      <div>
        <dt>Total</dt>
        <dd>{{ dinero(pedido.total) }}</dd>
      </div>
    </dl>

    <div class="tabla-contenedor">
      <table class="tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th class="numero">Cantidad</th>
            <th class="numero">Precio unitario</th>
            <th class="numero">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <!-- Un mismo producto podría estar dos veces en un pedido, por eso la key lleva también la posición -->
          <tr
            v-for="(linea, posicion) in pedido.detalle"
            :key="`${linea.id_producto}-${posicion}`"
          >
            <td>{{ linea.producto }}</td>
            <td class="numero">{{ linea.cantidad }}</td>
            <td class="numero">{{ dinero(linea.precio_unitario) }}</td>
            <td class="numero">{{ dinero(linea.subtotal) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <form class="cambio-estado" @submit.prevent="guardarEstado">
      <label>
        Cambiar estado
        <select v-model="nuevoEstado" :disabled="cancelado">
          <option value="">Escoge el nuevo estado</option>
          <option v-for="opcion in opcionesEstado" :key="opcion" :value="opcion">
            {{ opcion }}
          </option>
        </select>
      </label>
      <button type="submit" class="boton" :disabled="cancelado || !nuevoEstado || guardando">
        {{ guardando ? 'Guardando...' : 'Guardar estado' }}
      </button>
    </form>
    <p class="ayuda">
      {{
        cancelado
          ? 'Este pedido está cancelado y ya no se puede cambiar.'
          : 'Si lo cancelas, las unidades de sus productos vuelven al stock.'
      }}
    </p>
  </section>
</template>

<style scoped>
.resumen {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin: 0 0 24px;
}

.resumen dt {
  font-size: 0.85rem;
  color: var(--texto-suave);
}

.resumen dd {
  margin: 4px 0 0;
  font-weight: 600;
}

.cambio-estado {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
