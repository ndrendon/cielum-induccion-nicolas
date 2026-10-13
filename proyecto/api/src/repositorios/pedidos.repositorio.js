// Consultas SQL de las tablas pedidos y detalle_pedido.

import { pool } from '../db.js';

// Lista los pedidos con el nombre del cliente y el total, con filtro por estado y paginación.
// Si estado es null, la condición ($1::text IS NULL) deja pasar todos los pedidos.
export async function listar({ estado, limite, desde }) {
  const { rows } = await pool.query(
    `SELECT p.id_pedido, p.fecha, p.estado, c.id_cliente, c.nombre AS cliente,
            COALESCE(SUM(d.cantidad * d.precio_unitario), 0) AS total
     FROM pedidos p
     INNER JOIN clientes c ON c.id_cliente = p.id_cliente
     LEFT JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
     WHERE ($1::text IS NULL OR p.estado = $1)
     GROUP BY p.id_pedido, c.id_cliente, c.nombre
     ORDER BY p.fecha DESC, p.id_pedido DESC
     LIMIT $2 OFFSET $3`,
    [estado, limite, desde]
  );

  // Cuántos pedidos hay en total con ese filtro, para calcular el número de páginas
  const conteo = await pool.query(
    'SELECT COUNT(*)::int AS total FROM pedidos WHERE ($1::text IS NULL OR estado = $1)',
    [estado]
  );

  return { pedidos: rows, total: conteo.rows[0].total };
}

// Trae un pedido con su cliente, su total y las líneas del detalle
export async function buscarPorId(id, conexion = pool) {
  const { rows } = await conexion.query(
    `SELECT p.id_pedido, p.fecha, p.estado, c.id_cliente, c.nombre AS cliente,
            (SELECT COALESCE(SUM(d.cantidad * d.precio_unitario), 0)
             FROM detalle_pedido d
             WHERE d.id_pedido = p.id_pedido) AS total
     FROM pedidos p
     INNER JOIN clientes c ON c.id_cliente = p.id_cliente
     WHERE p.id_pedido = $1`,
    [id]
  );
  if (rows.length === 0) {
    return undefined;
  }

  const detalle = await conexion.query(
    `SELECT d.id_producto, pr.nombre AS producto, d.cantidad, d.precio_unitario,
            d.cantidad * d.precio_unitario AS subtotal
     FROM detalle_pedido d
     INNER JOIN productos pr ON pr.id_producto = d.id_producto
     WHERE d.id_pedido = $1
     ORDER BY d.id_detalle`,
    [id]
  );

  return { ...rows[0], detalle: detalle.rows };
}

export async function insertar(idCliente, conexion) {
  const { rows } = await conexion.query(
    "INSERT INTO pedidos (id_cliente, fecha, estado) VALUES ($1, CURRENT_DATE, 'pendiente') RETURNING id_pedido",
    [idCliente]
  );
  return rows[0].id_pedido;
}

export async function insertarLinea(idPedido, { id_producto, cantidad }, precio, conexion) {
  await conexion.query(
    'INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
    [idPedido, id_producto, cantidad, precio]
  );
}

export async function actualizarEstado(id, estado, conexion = pool) {
  await conexion.query('UPDATE pedidos SET estado = $1 WHERE id_pedido = $2', [estado, id]);
}

// Le devuelve al stock de cada producto las unidades que tenía el pedido
export async function devolverStock(idPedido, conexion) {
  await conexion.query(
    `UPDATE productos pr
     SET stock = pr.stock + d.cantidad
     FROM (
         SELECT id_producto, SUM(cantidad) AS cantidad
         FROM detalle_pedido
         WHERE id_pedido = $1
         GROUP BY id_producto
     ) d
     WHERE pr.id_producto = d.id_producto`,
    [idPedido]
  );
}

// Borra primero el detalle y después el pedido, porque el detalle depende del pedido
export async function eliminar(id, conexion) {
  await conexion.query('DELETE FROM detalle_pedido WHERE id_pedido = $1', [id]);
  await conexion.query('DELETE FROM pedidos WHERE id_pedido = $1', [id]);
}
