-- Reto día 06 · 2. Vista v_ventas_mensuales y vista materializada en PostgreSQL.
-- Ejecutar después de 01_registrar_pedido_postgres.sql.
--
-- En DBeaver: seleccionar desde el primer DROP hasta el CREATE MATERIALIZED VIEW
-- y ejecutarlo con Alt+X.

DROP MATERIALIZED VIEW IF EXISTS mv_ventas_mensuales;
DROP VIEW IF EXISTS v_ventas_mensuales;

-- Vista: ventas de cada mes, sin contar los pedidos cancelados.
-- No guarda datos: cada vez que se consulta, vuelve a calcular todo.
CREATE VIEW v_ventas_mensuales AS
SELECT CAST(DATE_TRUNC('month', p.fecha) AS DATE) AS mes,
       COUNT(DISTINCT p.id_pedido) AS pedidos,
       SUM(d.cantidad) AS unidades,
       SUM(d.cantidad * d.precio_unitario) AS total_vendido
FROM pedidos p
INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
WHERE p.estado <> 'cancelado'
GROUP BY CAST(DATE_TRUNC('month', p.fecha) AS DATE);

-- Vista materializada: guarda en disco el resultado de la vista.
-- Es más rápida de leer, pero sus datos solo se actualizan con REFRESH.
CREATE MATERIALIZED VIEW mv_ventas_mensuales AS
SELECT * FROM v_ventas_mensuales;

-- ============================================================
-- Pruebas: ejecutar una por una con Ctrl+Enter
-- ============================================================

-- 1. Recién creadas, las dos muestran lo mismo.
SELECT * FROM v_ventas_mensuales ORDER BY mes;

SELECT * FROM mv_ventas_mensuales ORDER BY mes;

-- 2. Llega un pedido nuevo: Laura García (cliente 10) compra 1 Mouse inalámbrico.
CALL registrar_pedido(10, '[{"id_producto": 2, "cantidad": 1}]');

-- 3. La vista ya incluye el pedido nuevo en octubre,
--    pero la vista materializada sigue mostrando los datos de antes.
SELECT * FROM v_ventas_mensuales ORDER BY mes;

SELECT * FROM mv_ventas_mensuales ORDER BY mes;

-- 4. Después del REFRESH, la vista materializada queda igual a la vista.
REFRESH MATERIALIZED VIEW mv_ventas_mensuales;

SELECT * FROM mv_ventas_mensuales ORDER BY mes;
