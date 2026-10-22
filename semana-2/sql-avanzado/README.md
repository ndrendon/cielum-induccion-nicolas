# Reto día 06 · SQL avanzado

Reto hecho sobre el modelo del proyecto integrador de `semana-1/sql` (`clientes`, `productos`, `pedidos` y `detalle_pedido`), en PostgreSQL y en SQL Server.

## Archivos

| Archivo | Qué hace |
| --- | --- |
| `01_registrar_pedido_postgres.sql` · `01_registrar_pedido_sqlserver.sql` | Procedimiento `registrar_pedido` y sus pruebas |
| `02_ventas_mensuales_postgres.sql` | Vista `v_ventas_mensuales` y vista materializada `mv_ventas_mensuales` |
| `02_ventas_mensuales_sqlserver.sql` | Vista `v_ventas_mensuales` |
| `03_ranking_clientes_postgres.sql` · `03_ranking_clientes_sqlserver.sql` | Ranking de clientes por mes con funciones de ventana |
| `04_explain_indice_postgres.sql` | Medición con `EXPLAIN ANALYZE` antes y después de crear un índice |
| `consultas_avanzadas_postgres.sql` · `consultas_avanzadas_sqlserver.sql` | Ejercicios: 12 consultas avanzadas |

## Cómo ejecutarlo

Se necesitan los contenedores de Docker `pg-induccion` (PostgreSQL 16, puerto 5432) y `mssql-induccion` (SQL Server 2022, puerto 1433) encendidos, y en DBeaver una conexión a la base `induccion` de cada uno, en modo auto-commit (la barra de DBeaver muestra "Auto").

1. Encender los contenedores: abrir Docker Desktop y ejecutar `docker start pg-induccion mssql-induccion`. SQL Server está listo cuando `docker logs mssql-induccion` muestra "SQL Server is now ready for client connections".
2. Partir de los datos de la semana 1: en la base `induccion`, ejecutar `semana-1/sql/modelo_postgres.sql` (o `modelo_sqlserver.sql`) y después `semana-1/sql/datos.sql`. El modelo borra y vuelve a crear las tablas.
   - En PostgreSQL, si ya se ejecutó el `02`, antes hay que borrar las vistas con `DROP MATERIALIZED VIEW IF EXISTS mv_ventas_mensuales;` y `DROP VIEW IF EXISTS v_ventas_mensuales;`, porque PostgreSQL no deja borrar una tabla que usa una vista.
3. Abrir cada archivo en DBeaver (Archivo > Abrir archivo), escoger la conexión del motor con Ctrl+9 y revisar que la barra muestre la base `induccion`. Ejecutar los archivos en orden, del 01 al 04:
   - **Procedimientos y vistas:** seleccionar el bloque que indica el comentario de arriba de cada archivo y ejecutarlo como dice ahí. En SQL Server, la selección no incluye el `GO`.
   - **Pruebas y consultas:** ejecutarlas una por una con Ctrl+Enter, porque algunas fallan a propósito.
   - **`04_explain_indice_postgres.sql`:** ejecutar el archivo completo con Alt+X.
   - **Consultas avanzadas:** después del reto, ejecutar cada consulta por separado con Ctrl+Enter.
4. Los mensajes de `RAISE NOTICE` (PostgreSQL) y `PRINT` (SQL Server) salen en la consola de salida del servidor de DBeaver (Ctrl+Shift+O).

Los resultados de este documento son los que se obtienen si se parte de los datos de la semana 1 y se ejecutan los archivos en orden. Los pedidos nuevos quedan con la fecha del día en que se ejecutan las pruebas (07-10-2026).

## 1. Procedimiento `registrar_pedido`

Recibe el id del cliente y el detalle del pedido como un JSON con la lista de productos y cantidades, que es como un backend, por ejemplo en NestJS, enviaría el pedido:

```sql
CALL registrar_pedido(9, '[{"id_producto": 9, "cantidad": 1}, {"id_producto": 10, "cantidad": 2}]');
```

```sql
EXEC dbo.registrar_pedido @id_cliente = 9, @detalle = N'[{"id_producto": 9, "cantidad": 1}, {"id_producto": 10, "cantidad": 2}]';
```

Lo que hace:

1. Valida antes de tocar los datos: que el detalle tenga productos, que el cliente exista, que las cantidades sean mayores que 0 y que los productos existan.
2. Inserta el pedido con la fecha de hoy y el estado `pendiente`.
3. Descuenta el stock de cada producto con `UPDATE ... WHERE stock >= cantidad`. Validar y descontar en la misma sentencia evita que dos pedidos al mismo tiempo dejen el stock negativo.
4. Guarda el detalle con el precio actual de cada producto.
5. Si algún producto no tiene stock suficiente, deshace todo con un ROLLBACK y devuelve un error que dice qué producto falló.

| | PostgreSQL (PL/pgSQL) | SQL Server (T-SQL) |
| --- | --- | --- |
| Cómo se llama | `CALL registrar_pedido(...)` | `EXEC dbo.registrar_pedido @id_cliente = ..., @detalle = N'...'` |
| Leer el JSON | `jsonb_to_recordset` | `OPENJSON ... WITH` |
| Id del pedido nuevo | `RETURNING id_pedido INTO v_id_pedido` | `SCOPE_IDENTITY()` |
| Descontar el stock | Un `UPDATE` por producto, dentro de un `FOR` | Un solo `UPDATE` con `JOIN` para todos los productos, y `@@ROWCOUNT` para saber a cuántos les alcanzó |
| Rollback | `RAISE EXCEPTION` cancela la transacción y PostgreSQL deshace todo lo que hizo el procedimiento | `BEGIN TRANSACTION` con `ROLLBACK TRANSACTION`, y `TRY...CATCH` para cualquier otro error |

En PostgreSQL el procedimiento corre dentro de la transacción de quien lo llama. Al lanzar `RAISE EXCEPTION`, esa transacción queda cancelada y PostgreSQL hace ROLLBACK de todo lo que alcanzó a hacer el procedimiento. No usé `COMMIT` ni `ROLLBACK` dentro del procedimiento porque así también funciona si se llama dentro de otra transacción, por ejemplo desde el backend.

### Pruebas y resultados

Los resultados son iguales en los dos motores.

| Prueba | Resultado |
| --- | --- |
| 1. Andrés López compra 1 Silla ergonómica y 2 Hub USB-C | Se crea el pedido 13 por 1080000. El stock de la silla baja de 5 a 4 y el del hub de 20 a 18 |
| 2. Laura García pide 1 Mouse inalámbrico y 10 Sillas ergonómicas | Error "Stock insuficiente para Silla ergonómica: hay 4, se pidieron 10". Laura sigue sin pedidos y el mouse sigue en 40, aunque el procedimiento ya lo había descontado |
| 3. Ana Gómez pide el producto 99 | Error "El producto 99 no existe". No se modifica nada |

El id 14 se pierde: el pedido de la prueba 2 alcanzó a tomarlo antes del ROLLBACK, y ni `SERIAL` ni `IDENTITY` devuelven los números que ya se usaron. Por eso el siguiente pedido que se registra es el 15. Es normal que queden huecos en los id.

## 2. Vista `v_ventas_mensuales` y vista materializada

`v_ventas_mensuales` muestra, por cada mes, los pedidos, las unidades y el total vendido, sin contar los pedidos cancelados. Para agrupar por mes, PostgreSQL usa `DATE_TRUNC('month', fecha)` y SQL Server `DATEFROMPARTS(YEAR(fecha), MONTH(fecha), 1)`; los dos dejan la fecha en el primer día del mes.

En PostgreSQL, `mv_ventas_mensuales` es una vista materializada que guarda en disco el resultado de la vista. Es más rápida de leer, pero solo se actualiza con `REFRESH MATERIALIZED VIEW`. SQL Server no tiene vistas materializadas; lo más parecido son las vistas indexadas, pero no permiten `COUNT(DISTINCT)`, así que allá quedó solo la vista normal.

Resultado después de las pruebas del procedimiento:

| Mes | Pedidos | Unidades | Total vendido |
| --- | --- | --- | --- |
| 2026-08-01 | 4 | 11 | 1830000.00 |
| 2026-09-01 | 6 | 20 | 3075000.00 |
| 2026-10-01 | 2 | 5 | 1865000.00 |

Después, Laura García compra 1 Mouse inalámbrico (pedido 15) y la fila de octubre cambia así:

| Consulta | Octubre |
| --- | --- |
| `v_ventas_mensuales` | 3 pedidos, 6 unidades, 1930000.00 |
| `mv_ventas_mensuales`, antes del `REFRESH` | 2 pedidos, 5 unidades, 1865000.00 |
| `mv_ventas_mensuales`, después del `REFRESH` | 3 pedidos, 6 unidades, 1930000.00 |

La vista se actualiza sola porque cada vez vuelve a calcular todo; la vista materializada muestra los datos viejos hasta que se refresca.

## 3. Ranking de clientes por mes

Primero calculo en una CTE lo que compró cada cliente en cada mes y después uso tres funciones de ventana:

- `RANK() OVER (PARTITION BY mes ORDER BY total DESC)`: el puesto de cada cliente dentro de su mes.
- `SUM(total) OVER (PARTITION BY mes)`: el total del mes, para sacar qué porcentaje compró cada cliente.
- `LAG(total) OVER (PARTITION BY mes ORDER BY total DESC)`: lo que compró el cliente del puesto anterior, para ver cuánto le faltó para alcanzarlo.

| Mes | Puesto | Cliente | Pedidos | Total | % del mes | Diferencia con el anterior |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-08-01 | 1 | Luis Pérez | 1 | 720000.00 | 39.34 | |
| 2026-08-01 | 2 | Ana Gómez | 2 | 705000.00 | 38.52 | 15000.00 |
| 2026-08-01 | 3 | Sofía Ruiz | 1 | 405000.00 | 22.13 | 300000.00 |
| 2026-09-01 | 1 | Carlos Mora | 1 | 1440000.00 | 46.83 | |
| 2026-09-01 | 2 | Sofía Ruiz | 1 | 540000.00 | 17.56 | 900000.00 |
| 2026-09-01 | 3 | Valentina Restrepo | 1 | 400000.00 | 13.01 | 140000.00 |
| 2026-09-01 | 4 | Camila Zapata | 1 | 295000.00 | 9.59 | 105000.00 |
| 2026-09-01 | 5 | Juan Torres | 1 | 215000.00 | 6.99 | 80000.00 |
| 2026-09-01 | 6 | Mateo Díaz | 1 | 185000.00 | 6.02 | 30000.00 |
| 2026-10-01 | 1 | Andrés López | 1 | 1080000.00 | 55.96 | |
| 2026-10-01 | 2 | Ana Gómez | 1 | 785000.00 | 40.67 | 295000.00 |
| 2026-10-01 | 3 | Laura García | 1 | 65000.00 | 3.37 | 720000.00 |

El primer puesto de cada mes no tiene diferencia porque no hay nadie antes. En estos datos no hay empates; si los hubiera, `RANK` les daría el mismo puesto y se saltaría el siguiente.

La segunda consulta del archivo deja solo al mejor cliente de cada mes: Luis Pérez en agosto, Carlos Mora en septiembre y Andrés López en octubre. Como las funciones de ventana no se pueden usar en el `WHERE`, primero calculo el puesto en una CTE y después filtro con `WHERE puesto = 1`.

## 4. `EXPLAIN ANALYZE` antes y después de crear un índice

Con los 12 pedidos del proyecto no se nota ninguna diferencia: PostgreSQL lee la tabla completa aunque exista el índice, porque es más rápido que pasar por él. Por eso el script crea una tabla `pedidos_prueba` con 200000 pedidos repartidos entre 10000 clientes, 20 por cliente, y mide esta consulta:

```sql
SELECT * FROM pedidos_prueba WHERE id_cliente = 42;
```

Es la búsqueda de los pedidos de un cliente por la llave foránea `id_cliente`, una columna que PostgreSQL no indexa solo. La medí con `EXPLAIN (ANALYZE, BUFFERS)` antes y después de crear `idx_pedidos_prueba_id_cliente`; la opción `BUFFERS` agrega cuántas páginas leyó.

| | Antes del índice | Después del índice |
| --- | --- | --- |
| Plan | `Seq Scan`: lee toda la tabla | `Bitmap Index Scan` sobre el índice y `Bitmap Heap Scan` sobre la tabla |
| Filas revisadas | 200000 (descarta 199980) | 20 |
| Páginas leídas | 1274 | 22 (2 del índice y 20 de la tabla) |
| Costo estimado | 3774.00 | 77.18 |
| Tiempo de ejecución | Entre 13 y 22 ms | Entre 0.1 y 0.3 ms |

Sin el índice, PostgreSQL tiene que leer las 1274 páginas de la tabla y revisar las 200000 filas para quedarse con 20. Con el índice va directo a las 20 filas del cliente 42: busca en el índice en qué páginas están y lee solo esas. Usa un `Bitmap` porque las 20 filas están repartidas en 20 páginas distintas, así que primero marca las páginas que necesita y después las lee en orden.

Los tiempos son de PostgreSQL 16 y cambian en cada ejecución y en cada equipo, pero las filas y las páginas leídas son las mismas, porque los datos de prueba no son aleatorios. El costo del índice es que cada `INSERT`, `UPDATE` o `DELETE` en la tabla también tiene que actualizarlo.

## 5. Ejercicios: 12 consultas avanzadas

El ejercicio del día pedía las 12 consultas avanzadas de `03_Ejercicios_por_Tema.md`, pero ese archivo no está en el repositorio ni en el material, así que escribí 12 consultas sobre el modelo del proyecto integrador que practican los temas del día. Las dos versiones son iguales, excepto la consulta 9, porque en SQL Server la CTE recursiva va sin `RECURSIVE` y las fechas se manejan con `DATEADD` y `DATEFROMPARTS`, y la 12, que calcula los días con `DATEDIFF`.

Los resultados son los que salen después de ejecutar el reto, es decir, con los pedidos 13 y 15 de las pruebas.

| # | Tema | Qué responde | Resultado |
| --- | --- | --- | --- |
| 1 | Subconsulta escalar | Productos que cuestan más que el precio promedio (265000) | Silla ergonómica, Monitor 24 pulgadas y Disco SSD 1 TB |
| 2 | Subconsulta en el `FROM` | Ticket promedio por ciudad | Bogotá y Bucaramanga 1080000.00, Cali 413333.33, Medellín 356666.67 y Barranquilla 215000.00 |
| 3 | `EXISTS` | Clientes con al menos un pedido entregado | Ana Gómez, Luis Pérez, Mateo Díaz, Sofía Ruiz y Valentina Restrepo |
| 4 | `NOT EXISTS` | Clientes que todavía no han recibido ningún pedido | Andrés López, Camila Zapata, Carlos Mora, Juan Torres y Laura García |
| 5 | `IN` con subconsulta | Clientes que han comprado productos de la categoría Periféricos | 7 clientes: todos menos Andrés López, Carlos Mora y Luis Pérez |
| 6 | `CASE WHEN` | Productos agrupados por rango de precio | Económico: 4 productos y 147 unidades en stock. Medio: 4 y 70. Premium: 2 y 12 |
| 7 | `COALESCE` con `LEFT JOIN` | Lo que compró cada cliente en octubre de 2026 | Andrés López 1080000.00, Ana Gómez 785000.00, Laura García 65000.00 y los otros 7 clientes en 0 |
| 8 | CTE con `SUM() OVER` | Total de cada pedido y ventas acumuladas | 13 pedidos; el acumulado termina en 6835000.00 |
| 9 | CTE recursiva | Ventas de agosto a diciembre de 2026, incluidos los meses sin ventas | Agosto 1830000.00, septiembre 3075000.00, octubre 1930000.00, noviembre 0 y diciembre 0 |
| 10 | `ROW_NUMBER` | El último pedido de cada cliente | 10 filas, desde los pedidos 13 y 15 de Andrés López y Laura García hasta el pedido 5 de Mateo Díaz |
| 11 | `ROW_NUMBER`, `RANK` y `DENSE_RANK` | Ranking de productos por unidades vendidas | Base para portátil, Cámara web HD y Hub USB-C empatan con 2 unidades: `RANK` les da el puesto 6 a los tres y salta al 9, `DENSE_RANK` sigue en el 7 y `ROW_NUMBER` les da 6, 7 y 8 |
| 12 | `LAG` y `LEAD` | Historial de los clientes con más de un pedido | 7 filas de Ana Gómez, Luis Pérez y Sofía Ruiz. Entre los pedidos de Ana Gómez pasaron 22 y 37 días |
