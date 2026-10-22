-- Reto día 06 · 4. Medir una consulta con EXPLAIN ANALYZE antes y después de crear un índice.
-- Se puede ejecutar en cualquier momento: usa su propia tabla de prueba y no toca
-- las tablas del proyecto.
--
-- Con los 12 pedidos del proyecto no se nota ninguna diferencia, porque PostgreSQL
-- prefiere leer la tabla completa aunque exista el índice. Por eso creo una tabla
-- de prueba con 200000 pedidos repartidos entre 10000 clientes (20 por cliente).
--
-- La consulta que mido es "los pedidos de un cliente", que es la búsqueda por la
-- llave foránea id_cliente, una columna que PostgreSQL no indexa solo.
--
-- Ejecutar el archivo completo con Alt+X: cada EXPLAIN sale en su propia pestaña de resultados.

DROP TABLE IF EXISTS pedidos_prueba;

CREATE TABLE pedidos_prueba (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    fecha DATE NOT NULL,
    estado VARCHAR(20) NOT NULL
);

INSERT INTO pedidos_prueba (id_cliente, fecha, estado)
SELECT n % 10000 + 1,
       DATE '2026-01-01' + n % 270,
       'entregado'
FROM generate_series(1, 200000) AS n;

-- Actualiza las estadísticas que usa PostgreSQL para escoger el plan.
ANALYZE pedidos_prueba;

-- 1. Antes del índice
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM pedidos_prueba WHERE id_cliente = 42;

-- 2. Crear el índice sobre la columna del filtro
CREATE INDEX idx_pedidos_prueba_id_cliente ON pedidos_prueba (id_cliente);

ANALYZE pedidos_prueba;

-- 3. Después del índice: la misma consulta
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM pedidos_prueba WHERE id_cliente = 42;

-- 4. Al terminar, se puede borrar la tabla de prueba:
-- DROP TABLE pedidos_prueba;
