// Lógica del inicio de sesión.

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { ErrorHttp } from '../errores.js';
import * as usuariosRepositorio from '../repositorios/usuarios.repositorio.js';

export async function iniciarSesion({ email, password }) {
  const usuario = await usuariosRepositorio.buscarPorEmail(email.toLowerCase());

  // bcrypt compara la contraseña escrita con el hash guardado en la base
  const passwordCorrecta = usuario !== undefined && (await bcrypt.compare(password, usuario.password_hash));

  // Si el correo no existe o la contraseña está mal, se responde lo mismo,
  // para no darle pistas a alguien que esté probando correos
  if (!passwordCorrecta) {
    throw new ErrorHttp(401, 'Correo o contraseña incorrectos');
  }

  // El token lleva el id (sub), el nombre y el rol, y se firma con el secreto del .env
  const token = jwt.sign(
    { sub: String(usuario.id_usuario), nombre: usuario.nombre, rol: usuario.rol },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  return {
    token,
    usuario: { id_usuario: usuario.id_usuario, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
  };
}
