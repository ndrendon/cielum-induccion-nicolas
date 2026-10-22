// Controlador de productos.

import { parametrosEsquema } from '../esquemas/comun.esquema.js';
import { productoEsquema } from '../esquemas/productos.esquema.js';
import * as productosServicio from '../servicios/productos.servicio.js';

export async function listar(req, res) {
  res.json(await productosServicio.listar());
}

export async function obtener(req, res) {
  const { id } = parametrosEsquema.parse(req.params);
  res.json(await productosServicio.obtener(id));
}

export async function crear(req, res) {
  const datos = productoEsquema.parse(req.body);
  res.status(201).json(await productosServicio.crear(datos));
}

export async function actualizar(req, res) {
  const { id } = parametrosEsquema.parse(req.params);
  const datos = productoEsquema.parse(req.body);
  res.json(await productosServicio.actualizar(id, datos));
}

export async function eliminar(req, res) {
  const { id } = parametrosEsquema.parse(req.params);
  await productosServicio.eliminar(id);
  res.status(204).end();
}
