// Controlador de pedidos.

import { parametrosEsquema } from '../esquemas/comun.esquema.js';
import { crearPedidoEsquema, estadoEsquema, filtrosPedidosEsquema } from '../esquemas/pedidos.esquema.js';
import * as pedidosServicio from '../servicios/pedidos.servicio.js';

// GET /pedidos?estado=&pagina=&limite=
export async function listar(req, res) {
  // En Express 5 req.query no se puede reemplazar, así que lo validado se guarda en una variable
  const filtros = filtrosPedidosEsquema.parse(req.query);
  res.json(await pedidosServicio.listar(filtros));
}

export async function obtener(req, res) {
  const { id } = parametrosEsquema.parse(req.params);
  res.json(await pedidosServicio.obtener(id));
}

export async function crear(req, res) {
  const datos = crearPedidoEsquema.parse(req.body);
  res.status(201).json(await pedidosServicio.crear(datos));
}

export async function cambiarEstado(req, res) {
  const { id } = parametrosEsquema.parse(req.params);
  const { estado } = estadoEsquema.parse(req.body);
  res.json(await pedidosServicio.cambiarEstado(id, estado));
}

export async function eliminar(req, res) {
  const { id } = parametrosEsquema.parse(req.params);
  await pedidosServicio.eliminar(id);
  res.status(204).end();
}
