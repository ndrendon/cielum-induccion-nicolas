-- Ejercicios día 06 · 12 consultas avanzadas sobre el modelo del proyecto integrador (PostgreSQL).
-- Ejecutar en la base de datos induccion, después del reto (archivos 01 a 04).
-- Cada consulta se ejecuta por separado: cursor dentro de la consulta y Ctrl+Enter.

-- 1. Subconsulta escalar: productos que cuestan más que el precio promedio.
SELECT nombre,
       precio,
       (SELECT CAST(AVG(precio) AS DECIMAL(12, 2)) FROM productos) AS precio_promedio
FROM productos
WHERE precio > (SELECT AVG(precio) FROM productos)
ORDER BY precio DESC;

-- 2. Subconsulta en el FROM: ticket promedio por ciudad, sin contar los pedidos cancelados.
--    La subconsulta calcula el total de cada pedido y la consulta de afuera lo promedia por ciudad.
SELECT t.ciudad,
       COUNT(*) AS pedidos,
       CAST(AVG(t.total) AS DECIMAL(12, 2)) AS ticket_promedio
FROM (
    SELECT p.id_pedido, c.ciudad, SUM(d.cantidad * d.precio_unitario) AS total
    FROM pedidos p
    INNER JOIN clientes c ON c.id_cliente = p.id_cliente
    INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
    WHERE p.estado <> 'cancelado'
    GROUP BY p.id_pedido, c.ciudad
) t
GROUP BY t.ciudad
ORDER BY ticket_promedio DESC, t.ciudad;

-- 3. EXISTS: clientes que tienen al menos un pedido entregado.
SELECT c.nombre, c.ciudad
FROM clientes c
WHERE EXISTS (
    SELECT 1
    FROM pedidos p
    WHERE p.id_cliente = c.id_cliente
      AND p.estado = 'entregado'
)
ORDER BY c.nombre;

-- 4. NOT EXISTS: clientes que todavía no han recibido ningún pedido.
SELECT c.nombre, c.ciudad
FROM clientes c
WHERE NOT EXISTS (
    SELECT 1
    FROM pedidos p
    WHERE p.id_cliente = c.id_cliente
      AND p.estado = 'entregado'
)
ORDER BY c.nombre;

-- 5. IN con subconsulta: clientes que han comprado productos de la categoría Periféricos.
SELECT nombre, ciudad
FROM clientes
WHERE id_cliente IN (
    SELECT p.id_cliente
    FROM pedidos p
    INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
    INNER JOIN productos pr ON pr.id_producto = d.id_producto
    WHERE pr.categoria = 'Periféricos'
      AND p.estado <> 'cancelado'
)
ORDER BY nombre;

-- 6. CASE WHEN: productos agrupados por rango de precio, con cuántos hay y su stock total.
SELECT rango,
       COUNT(*) AS productos,
       SUM(stock) AS unidades_en_stock
FROM (
    SELECT precio,
           stock,
           CASE
               WHEN precio < 100000 THEN 'Económico'
               WHEN precio < 500000 THEN 'Medio'
               ELSE 'Premium'
           END AS rango
    FROM productos
) x
GROUP BY rango
ORDER BY MIN(precio);

-- 7. COALESCE con LEFT JOIN: lo que compró cada cliente en octubre de 2026.
--    Los que no compraron en octubre quedan con NULL en la suma y COALESCE lo cambia por 0.
SELECT c.nombre,
       COALESCE(SUM(d.cantidad * d.precio_unitario), 0) AS total_octubre
FROM clientes c
LEFT JOIN pedidos p
       ON p.id_cliente = c.id_cliente
      AND p.estado <> 'cancelado'
      AND p.fecha >= '2026-10-01'
      AND p.fecha < '2026-11-01'
LEFT JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
GROUP BY c.id_cliente, c.nombre
ORDER BY total_octubre DESC, c.nombre;

-- 8. CTE con SUM() OVER: total de cada pedido y ventas acumuladas en el tiempo.
WITH totales AS (
    SELECT p.id_pedido, p.fecha, SUM(d.cantidad * d.precio_unitario) AS total
    FROM pedidos p
    INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
    WHERE p.estado <> 'cancelado'
    GROUP BY p.id_pedido, p.fecha
)
SELECT id_pedido,
       fecha,
       total,
       SUM(total) OVER (ORDER BY fecha, id_pedido) AS acumulado
FROM totales
ORDER BY fecha, id_pedido;

-- 9. CTE recursiva: los meses de agosto a diciembre de 2026 con lo vendido en cada uno.
--    La CTE meses genera los cinco meses aunque no tengan ventas; los que no tienen quedan en 0.
WITH RECURSIVE meses AS (
    SELECT DATE '2026-08-01' AS mes
    UNION ALL
    SELECT CAST(mes + INTERVAL '1 month' AS DATE)
    FROM meses
    WHERE mes < DATE '2026-12-01'
),
ventas AS (
    SELECT CAST(DATE_TRUNC('month', p.fecha) AS DATE) AS mes,
           SUM(d.cantidad * d.precio_unitario) AS total
    FROM pedidos p
    INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
    WHERE p.estado <> 'cancelado'
    GROUP BY CAST(DATE_TRUNC('month', p.fecha) AS DATE)
)
SELECT m.mes,
       COALESCE(v.total, 0) AS total_vendido
FROM meses m
LEFT JOIN ventas v ON v.mes = m.mes
ORDER BY m.mes;

-- 10. ROW_NUMBER: el último pedido de cada cliente.
--     Numera los pedidos de cada cliente del más nuevo al más viejo y se queda con el número 1.
WITH numerados AS (
    SELECT c.nombre,
           p.id_pedido,
           p.fecha,
           p.estado,
           ROW_NUMBER() OVER (PARTITION BY p.id_cliente ORDER BY p.fecha DESC, p.id_pedido DESC) AS n
    FROM pedidos p
    INNER JOIN clientes c ON c.id_cliente = p.id_cliente
)
SELECT nombre, id_pedido, fecha, estado
FROM numerados
WHERE n = 1
ORDER BY fecha DESC, nombre;

-- 11. ROW_NUMBER, RANK y DENSE_RANK: ranking de productos por unidades vendidas.
--     Con los empates se ve la diferencia entre las tres funciones.
WITH unidades AS (
    SELECT pr.nombre, SUM(d.cantidad) AS unidades
    FROM detalle_pedido d
    INNER JOIN pedidos p ON p.id_pedido = d.id_pedido
    INNER JOIN productos pr ON pr.id_producto = d.id_producto
    WHERE p.estado <> 'cancelado'
    GROUP BY pr.nombre
)
SELECT nombre,
       unidades,
       ROW_NUMBER() OVER (ORDER BY unidades DESC, nombre) AS fila,
       RANK() OVER (ORDER BY unidades DESC) AS rango,
       DENSE_RANK() OVER (ORDER BY unidades DESC) AS rango_denso
FROM unidades
ORDER BY unidades DESC, nombre;

-- 12. LAG y LEAD: historial de los clientes con más de un pedido, con la fecha del pedido
--     anterior, los días que pasaron desde ese pedido y la fecha del siguiente.
WITH historial AS (
    SELECT c.nombre,
           p.id_pedido,
           p.fecha,
           p.estado,
           LAG(p.fecha) OVER (PARTITION BY p.id_cliente ORDER BY p.fecha) AS fecha_anterior,
           LEAD(p.fecha) OVER (PARTITION BY p.id_cliente ORDER BY p.fecha) AS fecha_siguiente,
           COUNT(*) OVER (PARTITION BY p.id_cliente) AS pedidos_del_cliente
    FROM pedidos p
    INNER JOIN clientes c ON c.id_cliente = p.id_cliente
)
SELECT nombre,
       id_pedido,
       fecha,
       estado,
       fecha_anterior,
       fecha - fecha_anterior AS dias_desde_el_anterior,
       fecha_siguiente
FROM historial
WHERE pedidos_del_cliente > 1
ORDER BY nombre, fecha;
