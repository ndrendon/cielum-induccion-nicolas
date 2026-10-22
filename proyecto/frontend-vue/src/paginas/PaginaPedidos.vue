<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CajaMensaje from '@/componentes/CajaMensaje.vue'
import ControlPaginacion from '@/componentes/ControlPaginacion.vue'
import EstadoPedido from '@/componentes/EstadoPedido.vue'
import { useConsulta } from '@/composables/useConsulta'
import { ESTADOS, dinero } from '@/formato'

// Lista de pedidos con filtro por estado y paginación.
// Los filtros se guardan en la URL (?estado=pendiente&pagina=2&limite=10),
// así se pueden compartir y no se pierden al ir al detalle y volver.
const route = useRoute()
const router = useRouter()

// computed: se recalculan solos cada vez que cambia la URL
const estado = computed(() => route.query.estado ?? '')
const pagina = computed(() => Number(route.query.pagina ?? 1))
const limite = computed(() => Number(route.query.limite ?? 10))

// La ruta es una función: cuando cambia un filtro, cambia la ruta y useConsulta vuelve a pedir los pedidos
const { datos, cargando, error, recargar } = useConsulta(
  () => `/pedidos?estado=${estado.value}&pagina=${pagina.value}&limite=${limite.value}`,
)

// Cambia un filtro en la URL; al cambiar el estado o el límite se vuelve a la página 1
function cambiar(cambios) {
  const nuevos = { estado: estado.value, pagina: pagina.value, limite: limite.value, ...cambios }
  const query = { pagina: String(nuevos.pagina), limite: String(nuevos.limite) }
  if (nuevos.estado) {
    query.estado = nuevos.estado
  }
  router.push({ query })
}
</script>

<template>
  <section class="tarjeta">
    <div class="titulo-con-acciones">
      <h1>Pedidos</h1>
      <RouterLink :to="{ name: 'nuevo-pedido' }" class="boton">Nuevo pedido</RouterLink>
    </div>

    <div class="filtros">
      <label>
        Estado
        <select :value="estado" @change="cambiar({ estado: $event.target.value, pagina: 1 })">
          <option value="">Todos</option>
          <option v-for="opcion in ESTADOS" :key="opcion" :value="opcion">{{ opcion }}</option>
        </select>
      </label>
      <label>
        Por página
        <select
          :value="limite"
          @change="cambiar({ limite: Number($event.target.value), pagina: 1 })"
        >
          <option v-for="opcion in [5, 10, 20]" :key="opcion" :value="opcion">{{ opcion }}</option>
        </select>
      </label>
    </div>

    <template v-if="error">
      <CajaMensaje :texto="error.message" :errores="error.errores" />
      <button type="button" class="boton boton-secundario" @click="recargar">Reintentar</button>
    </template>

    <p v-if="cargando && !datos" class="cargando">Cargando pedidos...</p>

    <p v-if="datos && datos.datos.length === 0" class="vacio">No hay pedidos con ese filtro.</p>

    <template v-if="datos && datos.datos.length > 0">
      <div class="tabla-contenedor">
        <table class="tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th class="numero">Total</th>
              <th aria-label="Acciones"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pedido in datos.datos" :key="pedido.id_pedido">
              <td>{{ pedido.id_pedido }}</td>
              <td>{{ pedido.fecha }}</td>
              <td>{{ pedido.cliente }}</td>
              <td><EstadoPedido :estado="pedido.estado" /></td>
              <td class="numero">{{ dinero(pedido.total) }}</td>
              <td>
                <RouterLink :to="{ name: 'detalle-pedido', params: { id: pedido.id_pedido } }">
                  Ver
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ControlPaginacion
        :pagina="datos.pagina"
        :total-paginas="datos.totalPaginas"
        :total="datos.total"
        @cambiar="(nuevaPagina) => cambiar({ pagina: nuevaPagina })"
      />
    </template>
  </section>
</template>

<style scoped>
.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}
</style>
