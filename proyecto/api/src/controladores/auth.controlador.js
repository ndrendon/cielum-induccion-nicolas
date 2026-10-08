// Controlador del login: valida lo que llega, llama al servicio y responde.

import { loginEsquema } from '../esquemas/auth.esquema.js';
import * as authServicio from '../servicios/auth.servicio.js';

export async function iniciarSesion(req, res) {
  const datos = loginEsquema.parse(req.body);
  res.json(await authServicio.iniciarSesion(datos));
}

// Devuelve los datos del usuario que viene en el token
export function perfil(req, res) {
  res.json(req.usuario);
}
