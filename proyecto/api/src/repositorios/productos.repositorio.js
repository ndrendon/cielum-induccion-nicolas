// Consultas SQL de la tabla productos.

import { pool } from '../db.js';

const columnas = 'id_producto, nombre, categoria, precio, stock';

export async function listar() {
  const { rows } = await pool.query(`SELECT ${columnas} FROM productos ORDER BY id_producto`);
  return rows;
}

// conexion permite usar esta consulta dentro de una transacción; si no se pasa, usa el pool
export async function buscarPorId(id, conexion = pool) {
  const { rows } = await conexion.query(`SELECT ${columnas} FROM productos WHERE id_producto = $1`, [id]);
  return rows[0];
}

export async function crear({ nombre, categoria, precio, stock }) {
  const { rows } = await pool.query(
    `INSERT INTO productos (nombre, categoria, precio, stock) VALUES ($1, $2, $3, $4) RETURNING ${columnas}`,
    [nombre, categoria, precio, stock]
  );
  return rows[0];
}

export async function actualizar(id, { nombre, categoria, precio, stock }) {
  const { rows } = await pool.query(
    `UPDATE productos SET nombre = $1, categoria = $2, precio = $3, stock = $4 WHERE id_producto = $5 RETURNING ${columnas}`,
    [nombre, categoria, precio, stock, id]
  );
  return rows[0];
}

export async function eliminar(id) {
  const { rowCount } = await pool.query('DELETE FROM productos WHERE id_producto = $1', [id]);
  return rowCount > 0;
}

// Descuenta el stock solo si alcanza. Revisar y descontar en la misma sentencia evita
// que dos pedidos al mismo tiempo dejen el stock negativo.
// Devuelve el precio del producto, o undefined si el producto no existe o no hay stock suficiente.
export async function descontarStock(idProducto, cantidad, conexion) {
  const { rows } = await conexion.query(
    'UPDATE productos SET stock = stock - $1 WHERE id_producto = $2 AND stock >= $1 RETURNING precio',
    [cantidad, idProducto]
  );
  return rows[0]?.precio;
}
