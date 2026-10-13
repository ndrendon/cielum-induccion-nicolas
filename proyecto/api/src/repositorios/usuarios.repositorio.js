// Consultas SQL de la tabla usuarios.

import { pool } from '../db.js';

export async function buscarPorEmail(email) {
  const { rows } = await pool.query(
    'SELECT id_usuario, nombre, email, password_hash, rol FROM usuarios WHERE email = $1',
    [email]
  );
  return rows[0];
}
