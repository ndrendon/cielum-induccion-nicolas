// Manejo centralizado de errores: todas las rutas mandan sus errores aquí.

import * as z from 'zod';
import { ErrorHttp } from '../errores.js';

// Se usa cuando ninguna ruta coincidió con la petición
export function rutaNoEncontrada(req, res) {
  res.status(404).json({ mensaje: `No existe la ruta ${req.method} ${req.originalUrl}` });
}

// Middleware de errores: Express lo reconoce porque recibe cuatro parámetros.
// En Express 5, los errores de las funciones async también llegan aquí solos.
export function manejarErrores(err, req, res, next) {
  // Datos que no pasaron la validación de zod
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      mensaje: 'Los datos enviados no son válidos',
      errores: z.flattenError(err).fieldErrors
    });
  }

  // Errores lanzados a propósito desde los servicios (404, 409...)
  if (err instanceof ErrorHttp) {
    return res.status(err.status).json({ mensaje: err.message });
  }

  // El cuerpo de la petición no es un JSON bien escrito
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
  }

  // Códigos de error de PostgreSQL: 23505 es un valor repetido en una columna UNIQUE
  // y 23503 es una llave foránea que no deja hacer el cambio
  if (err.code === '23505') {
    return res.status(409).json({ mensaje: 'Ya existe un registro con ese valor' });
  }
  if (err.code === '23503') {
    return res.status(409).json({ mensaje: 'No se puede hacer el cambio porque el registro está relacionado con otros datos' });
  }

  // Cualquier otro error es inesperado: se registra en la consola y al cliente no se le muestran detalles
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
}
