// Reglas del negocio para los clientes.

import { ErrorHttp } from '../errores.js';
import * as clientesRepositorio from '../repositorios/clientes.repositorio.js';

export function listar() {
  return clientesRepositorio.listar();
}

export async function obtener(id) {
  const cliente = await clientesRepositorio.buscarPorId(id);
  if (!cliente) {
    throw new ErrorHttp(404, 'Cliente no encontrado');
  }
  return cliente;
}

export async function crear(datos) {
  try {
    return await clientesRepositorio.crear({ ...datos, email: datos.email.toLowerCase() });
  } catch (error) {
    throw traducirErrorBaseDatos(error);
  }
}

export async function actualizar(id, datos) {
  let cliente;
  try {
    cliente = await clientesRepositorio.actualizar(id, { ...datos, email: datos.email.toLowerCase() });
  } catch (error) {
    throw traducirErrorBaseDatos(error);
  }
  if (!cliente) {
    throw new ErrorHttp(404, 'Cliente no encontrado');
  }
  return cliente;
}

export async function eliminar(id) {
  let eliminado;
  try {
    eliminado = await clientesRepositorio.eliminar(id);
  } catch (error) {
    throw traducirErrorBaseDatos(error);
  }
  if (!eliminado) {
    throw new ErrorHttp(404, 'Cliente no encontrado');
  }
}

// Cambia los errores de PostgreSQL que se pueden esperar por un mensaje claro
function traducirErrorBaseDatos(error) {
  if (error.code === '23505') {
    return new ErrorHttp(409, 'Ya existe un cliente con ese correo');
  }
  if (error.code === '23503') {
    return new ErrorHttp(409, 'No se puede borrar el cliente porque tiene pedidos');
  }
  return error;
}
