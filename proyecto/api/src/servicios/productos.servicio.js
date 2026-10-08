// Reglas del negocio para los productos.

import { ErrorHttp } from '../errores.js';
import * as productosRepositorio from '../repositorios/productos.repositorio.js';

export function listar() {
  return productosRepositorio.listar();
}

export async function obtener(id) {
  const producto = await productosRepositorio.buscarPorId(id);
  if (!producto) {
    throw new ErrorHttp(404, 'Producto no encontrado');
  }
  return producto;
}

export function crear(datos) {
  return productosRepositorio.crear(datos);
}

export async function actualizar(id, datos) {
  const producto = await productosRepositorio.actualizar(id, datos);
  if (!producto) {
    throw new ErrorHttp(404, 'Producto no encontrado');
  }
  return producto;
}

export async function eliminar(id) {
  let eliminado;
  try {
    eliminado = await productosRepositorio.eliminar(id);
  } catch (error) {
    // 23503: el producto está en el detalle de algún pedido y la llave foránea no deja borrarlo
    if (error.code === '23503') {
      throw new ErrorHttp(409, 'No se puede borrar el producto porque ya está en pedidos');
    }
    throw error;
  }
  if (!eliminado) {
    throw new ErrorHttp(404, 'Producto no encontrado');
  }
}
