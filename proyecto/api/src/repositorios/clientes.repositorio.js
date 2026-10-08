// Consultas SQL de la tabla clientes. Es la única capa que habla con la base de datos.

import { pool } from '../db.js';

const columnas = 'id_cliente, nombre, email, ciudad';

export async function listar() {
  const { rows } = await pool.query(`SELECT ${columnas} FROM clientes ORDER BY id_cliente`);
  return rows;
}

export async function buscarPorId(id) {
  const { rows } = await pool.query(`SELECT ${columnas} FROM clientes WHERE id_cliente = $1`, [id]);
  return rows[0];
}

export async function crear({ nombre, email, ciudad }) {
  const { rows } = await pool.query(
    `INSERT INTO clientes (nombre, email, ciudad) VALUES ($1, $2, $3) RETURNING ${columnas}`,
    [nombre, email, ciudad]
  );
  return rows[0];
}

export async function actualizar(id, { nombre, email, ciudad }) {
  const { rows } = await pool.query(
    `UPDATE clientes SET nombre = $1, email = $2, ciudad = $3 WHERE id_cliente = $4 RETURNING ${columnas}`,
    [nombre, email, ciudad, id]
  );
  return rows[0];
}

export async function eliminar(id) {
  const { rowCount } = await pool.query('DELETE FROM clientes WHERE id_cliente = $1', [id]);
  return rowCount > 0;
}
