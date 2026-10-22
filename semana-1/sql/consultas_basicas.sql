-- 12 consultas básicas del proyecto integrador.
-- Funcionan igual en PostgreSQL y en SQL Server.

-- 1. Todos los clientes ordenados por nombre.
SELECT id_cliente, nombre, email, ciudad
FROM clientes
ORDER BY nombre;

-- 2. Clientes que viven en Medellín.
SELECT id_cliente, nombre, email
FROM clientes
WHERE ciudad = 'Medellín'
ORDER BY nombre;

-- 3. Productos con precio mayor a 100.000, del más caro al más barato.
SELECT nombre, categoria, precio
FROM productos
WHERE precio > 100000
ORDER BY precio DESC;

-- 4. Pedidos hechos en septiembre de 2026.
SELECT id_pedido, id_cliente, fecha, estado
FROM pedidos
WHERE fecha >= '2026-09-01' AND fecha < '2026-10-01'
ORDER BY fecha;

-- 5. Cantidad de productos y precio mínimo, máximo y promedio.
SELECT
    COUNT(*) AS cantidad_productos,
    MIN(precio) AS precio_minimo,
    MAX(precio) AS precio_maximo,
    CAST(AVG(precio) AS DECIMAL(12, 2)) AS precio_promedio
FROM productos;

-- 6. Cantidad de clientes por ciudad.
SELECT ciudad, COUNT(*) AS cantidad_clientes
FROM clientes
GROUP BY ciudad
ORDER BY cantidad_clientes DESC, ciudad;

-- 7. Ciudades con más de un cliente.
SELECT ciudad, COUNT(*) AS cantidad_clientes
FROM clientes
GROUP BY ciudad
HAVING COUNT(*) > 1
ORDER BY cantidad_clientes DESC, ciudad;

-- 8. Pedidos con el nombre y la ciudad del cliente.
SELECT pe.id_pedido, pe.fecha, pe.estado, c.nombre AS cliente, c.ciudad
FROM pedidos pe
INNER JOIN clientes c ON c.id_cliente = pe.id_cliente
ORDER BY pe.fecha;

-- 9. Total de cada pedido.
SELECT pe.id_pedido, c.nombre AS cliente, pe.estado, SUM(d.cantidad * d.precio_unitario) AS total
FROM pedidos pe
INNER JOIN clientes c ON c.id_cliente = pe.id_cliente
INNER JOIN detalle_pedido d ON d.id_pedido = pe.id_pedido
GROUP BY pe.id_pedido, c.nombre, pe.estado
ORDER BY pe.id_pedido;

-- 10. Clientes que no han hecho ningún pedido.
SELECT c.id_cliente, c.nombre, c.ciudad
FROM clientes c
LEFT JOIN pedidos pe ON pe.id_cliente = c.id_cliente
WHERE pe.id_pedido IS NULL
ORDER BY c.nombre;

-- 11. Productos que nunca se han vendido.
SELECT p.id_producto, p.nombre, p.stock
FROM detalle_pedido d
RIGHT JOIN productos p ON p.id_producto = d.id_producto
WHERE d.id_detalle IS NULL
ORDER BY p.nombre;

-- 12. Top 5 de productos más vendidos por unidades, sin contar los pedidos cancelados.
SELECT p.nombre, SUM(d.cantidad) AS unidades_vendidas, SUM(d.cantidad * d.precio_unitario) AS total_vendido
FROM detalle_pedido d
INNER JOIN productos p ON p.id_producto = d.id_producto
INNER JOIN pedidos pe ON pe.id_pedido = d.id_pedido
WHERE pe.estado <> 'cancelado'
GROUP BY p.id_producto, p.nombre
ORDER BY unidades_vendidas DESC, p.nombre
OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY;
