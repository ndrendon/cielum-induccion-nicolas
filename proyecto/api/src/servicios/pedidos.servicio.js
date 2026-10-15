// Reglas del negocio para los pedidos.

import { enTransaccion } from '../db.js';
import { ErrorHttp } from '../errores.js';
import * as clientesRepositorio from '../repositorios/clientes.repositorio.js';
import * as pedidosRepositorio from '../repositorios/pedidos.repositorio.js';
import * as productosRepositorio from '../repositorios/productos.repositorio.js';

export async function listar({ estado, pagina, limite }) {
  // Para la página 1 no se salta ningún pedido; para la 2 se salta la primera página, y así
  const desde = (pagina - 1) * limite;
  const { pedidos, total } = await pedidosRepositorio.listar({ estado: estado ?? null, limite, desde });

  return {
    datos: pedidos,
    pagina,
    limite,
    total,
    totalPaginas: Math.ceil(total / limite)
  };
}

export async function obtener(id) {
  const pedido = await pedidosRepositorio.buscarPorId(id);
  if (!pedido) {
    throw new ErrorHttp(404, 'Pedido no encontrado');
  }
  return pedido;
}

// Crea el pedido con su detalle dentro de una transacción.
// Si un producto no existe o no tiene stock, se lanza un error y se hace ROLLBACK de todo:
// no queda el pedido a medias ni el stock descontado.
export async function crear({ id_cliente, detalle }) {
  const cliente = await clientesRepositorio.buscarPorId(id_cliente);
  if (!cliente) {
    throw new ErrorHttp(404, `El cliente ${id_cliente} no existe`);
  }

  const idPedido = await enTransaccion(async (conexion) => {
    const id = await pedidosRepositorio.insertar(id_cliente, conexion);

    for (const linea of detalle) {
      const precio = await productosRepositorio.descontarStock(linea.id_producto, linea.cantidad, conexion);

      if (precio === undefined) {
        const producto = await productosRepositorio.buscarPorId(linea.id_producto, conexion);
        if (!producto) {
          throw new ErrorHttp(404, `El producto ${linea.id_producto} no existe`);
        }
        throw new ErrorHttp(409, `No hay stock suficiente de ${producto.nombre}: hay ${producto.stock} y se pidieron ${linea.cantidad}`);
      }

      await pedidosRepositorio.insertarLinea(id, linea, precio, conexion);
    }

    return id;
  });

  return obtener(idPedido);
}

// Cambia el estado de un pedido. Si se cancela, le devuelve al stock las unidades del pedido.
export async function cambiarEstado(id, estado) {
  const pedido = await obtener(id);

  if (pedido.estado === 'cancelado') {
    throw new ErrorHttp(409, 'El pedido está cancelado y ya no se puede cambiar');
  }

  if (estado === 'cancelado') {
    await enTransaccion(async (conexion) => {
      await pedidosRepositorio.actualizarEstado(id, 'cancelado', conexion);
      await pedidosRepositorio.devolverStock(id, conexion);
    });
  } else {
    await pedidosRepositorio.actualizarEstado(id, estado);
  }

  return obtener(id);
}

// Solo se pueden borrar los pedidos pendientes o cancelados.
// Si el pedido estaba pendiente, sus unidades vuelven al stock.
export async function eliminar(id) {
  const pedido = await obtener(id);

  if (pedido.estado !== 'pendiente' && pedido.estado !== 'cancelado') {
    throw new ErrorHttp(409, 'Solo se pueden borrar pedidos pendientes o cancelados');
  }

  await enTransaccion(async (conexion) => {
    if (pedido.estado === 'pendiente') {
      await pedidosRepositorio.devolverStock(id, conexion);
    }
    await pedidosRepositorio.eliminar(id, conexion);
  });
}
