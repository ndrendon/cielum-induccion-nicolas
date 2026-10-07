-- Reto día 06 · 2. Vista v_ventas_mensuales en SQL Server.
-- Ejecutar después de 01_registrar_pedido_sqlserver.sql.
--
-- SQL Server no tiene vistas materializadas como PostgreSQL; lo más parecido son
-- las vistas indexadas, pero no permiten COUNT(DISTINCT), así que esta vista
-- queda como una vista normal.
--
-- En DBeaver: seleccionar desde CREATE OR ALTER VIEW hasta el punto y coma final,
-- sin incluir el GO, y ejecutarlo con Ctrl+Enter.

-- Vista: ventas de cada mes, sin contar los pedidos cancelados.
-- No guarda datos: cada vez que se consulta, vuelve a calcular todo.
CREATE OR ALTER VIEW dbo.v_ventas_mensuales AS
SELECT DATEFROMPARTS(YEAR(p.fecha), MONTH(p.fecha), 1) AS mes,
       COUNT(DISTINCT p.id_pedido) AS pedidos,
       SUM(d.cantidad) AS unidades,
       SUM(d.cantidad * d.precio_unitario) AS total_vendido
FROM pedidos p
INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
WHERE p.estado <> 'cancelado'
GROUP BY DATEFROMPARTS(YEAR(p.fecha), MONTH(p.fecha), 1);
GO

-- ============================================================
-- Pruebas: ejecutar una por una con Ctrl+Enter
-- ============================================================

-- 1. Ventas por mes.
SELECT * FROM dbo.v_ventas_mensuales ORDER BY mes;

-- 2. Llega un pedido nuevo: Laura García (cliente 10) compra 1 Mouse inalámbrico.
EXEC dbo.registrar_pedido @id_cliente = 10, @detalle = N'[{"id_producto": 2, "cantidad": 1}]';

-- 3. La vista ya incluye el pedido nuevo en octubre, sin tener que refrescar nada.
SELECT * FROM dbo.v_ventas_mensuales ORDER BY mes;
