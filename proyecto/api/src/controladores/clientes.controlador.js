// Controlador de clientes: valida lo que llega, llama al servicio y arma la respuesta.

import { clienteEsquema } from '../esquemas/clientes.esquema.js';
import { parametrosEsquema } from '../esquemas/comun.esquema.js';
import * as clientesServicio from '../servicios/clientes.servicio.js';

export async function listar(req, res) {
  res.json(await clientesServicio.listar());
}

export async function obtener(req, res) {
  const { id } = parametrosEsquema.parse(req.params);
  res.json(await clientesServicio.obtener(id));
}

export async function crear(req, res) {
  const datos = clienteEsquema.parse(req.body);
  res.status(201).json(await clientesServicio.crear(datos));
}

export async function actualizar(req, res) {
  const { id } = parametrosEsquema.parse(req.params);
  const datos = clienteEsquema.parse(req.body);
  res.json(await clientesServicio.actualizar(id, datos));
}

export async function eliminar(req, res) {
  const { id } = parametrosEsquema.parse(req.params);
  await clientesServicio.eliminar(id);
  res.status(204).end();
}
