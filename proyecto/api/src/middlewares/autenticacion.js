// Middlewares para las rutas protegidas.

import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { ErrorHttp } from '../errores.js';

// Revisa que la petición traiga un token válido en el encabezado Authorization: Bearer <token>.
// Si es válido, deja los datos del usuario en req.usuario.
export function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization ?? '').split(' ');

  if (tipo !== 'Bearer' || !token) {
    throw new ErrorHttp(401, 'Debes iniciar sesión para usar esta ruta');
  }

  try {
    const datos = jwt.verify(token, config.JWT_SECRET, { algorithms: ['HS256'] });
    req.usuario = { id_usuario: Number(datos.sub), nombre: datos.nombre, rol: datos.rol };
  } catch {
    throw new ErrorHttp(401, 'El token no es válido o ya venció');
  }

  next();
}

// Deja pasar solo a los usuarios que tengan alguno de los roles indicados.
// Se usa después de autenticar.
export function permitirRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      throw new ErrorHttp(403, 'No tienes permiso para hacer esta acción');
    }
    next();
  };
}
