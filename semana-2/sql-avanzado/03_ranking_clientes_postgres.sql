-- Reto día 06 · 3. Ranking de clientes por mes con funciones de ventana (PostgreSQL).
-- Ejecutar después de 02_ventas_mensuales_postgres.sql.
--
-- Funciones de ventana que uso:
--   RANK() OVER (PARTITION BY mes ORDER BY total DESC): puesto del cliente en su mes.
--   SUM(total) OVER (PARTITION BY mes): total del mes, para sacar el porcentaje.
--   LAG(total) OVER (PARTITION BY mes ORDER BY total DESC): total del cliente del
--   puesto anterior, para ver cuánto le faltó para alcanzarlo.

-- 1. Ranking completo de cada mes.
WITH ventas_cliente_mes AS (
    SELECT CAST(DATE_TRUNC('month', p.fecha) AS DATE) AS mes,
           c.id_cliente,
           c.nombre AS cliente,
           COUNT(DISTINCT p.id_pedido) AS pedidos,
           SUM(d.cantidad * d.precio_unitario) AS total
    FROM pedidos p
    INNER JOIN clientes c ON c.id_cliente = p.id_cliente
    INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
    WHERE p.estado <> 'cancelado'
    GROUP BY CAST(DATE_TRUNC('month', p.fecha) AS DATE), c.id_cliente, c.nombre
)
SELECT mes,
       RANK() OVER (PARTITION BY mes ORDER BY total DESC) AS puesto,
       cliente,
       pedidos,
       total,
       CAST(100.0 * total / SUM(total) OVER (PARTITION BY mes) AS DECIMAL(5, 2)) AS porcentaje_del_mes,
       LAG(total) OVER (PARTITION BY mes ORDER BY total DESC) - total AS diferencia_con_el_anterior
FROM ventas_cliente_mes
ORDER BY mes, puesto, cliente;

-- 2. El mejor cliente de cada mes. Las funciones de ventana no se pueden usar en el
--    WHERE, por eso primero calculo el puesto en una CTE y después filtro por él.
WITH ventas_cliente_mes AS (
    SELECT CAST(DATE_TRUNC('month', p.fecha) AS DATE) AS mes,
           c.id_cliente,
           c.nombre AS cliente,
           SUM(d.cantidad * d.precio_unitario) AS total
    FROM pedidos p
    INNER JOIN clientes c ON c.id_cliente = p.id_cliente
    INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
    WHERE p.estado <> 'cancelado'
    GROUP BY CAST(DATE_TRUNC('month', p.fecha) AS DATE), c.id_cliente, c.nombre
),
ranking AS (
    SELECT mes,
           cliente,
           total,
           RANK() OVER (PARTITION BY mes ORDER BY total DESC) AS puesto
    FROM ventas_cliente_mes
)
SELECT mes, cliente, total
FROM ranking
WHERE puesto = 1
ORDER BY mes;
