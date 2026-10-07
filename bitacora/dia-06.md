# Bitácora Día 06 · SQL avanzado en PostgreSQL y SQL Server

**Fecha:** 07-10-2026

**Horas invertidas:** 7 h (autoinvestigación 2 h · práctica 2 h · reto 3 h)

## Autoinvestigación básica

1. **Pregunta:** Subconsultas y `EXISTS`.

   **Respuesta (con mis palabras):** Una subconsulta es un `SELECT` escrito dentro de otra consulta, entre paréntesis. Se puede usar en el `WHERE` para comparar contra un valor calculado, como el precio promedio; en el `FROM`, como si fuera una tabla temporal; o en el `SELECT`, para traer un dato por cada fila. `EXISTS` revisa si una subconsulta devuelve al menos una fila: si encuentra una, es verdadero, y no le importa qué columnas trae, por eso se escribe `SELECT 1`. Casi siempre se usa con una subconsulta correlacionada, que es la que usa una columna de la consulta de afuera, como `p.id_cliente = c.id_cliente`, y se evalúa para cada fila. `NOT EXISTS` hace lo contrario y sirve para encontrar lo que no tiene relación. Leí que hay que tener cuidado con `NOT IN`: si la subconsulta devuelve algún `NULL`, `NOT IN` no devuelve ninguna fila, mientras que `NOT EXISTS` sí funciona bien.

   **Ejemplo propio:**

   ```sql
   SELECT nombre, precio
   FROM productos
   WHERE precio > (SELECT AVG(precio) FROM productos)
   ORDER BY precio DESC;

   SELECT c.nombre
   FROM clientes c
   WHERE EXISTS (
       SELECT 1
       FROM pedidos p
       WHERE p.id_cliente = c.id_cliente
         AND p.estado = 'entregado'
   )
   ORDER BY c.nombre;

   SELECT pr.nombre
   FROM productos pr
   WHERE NOT EXISTS (
       SELECT 1
       FROM detalle_pedido d
       WHERE d.id_producto = pr.id_producto
   )
   ORDER BY pr.nombre;
   ```

   La primera consulta calcula con una subconsulta el precio promedio de los productos, que da 265000, y muestra los que cuestan más: Silla ergonómica, Monitor 24 pulgadas y Disco SSD 1 TB. La segunda trae los clientes que tienen al menos un pedido entregado: Ana Gómez, Luis Pérez, Mateo Díaz, Sofía Ruiz y Valentina Restrepo. La tercera usa `NOT EXISTS` para encontrar los productos que nunca se han vendido, Hub USB-C y Silla ergonómica, que es lo mismo que saqué ayer con el `RIGHT JOIN`, pero más fácil de leer. Las tres funcionan igual en PostgreSQL y en SQL Server.

   **Fuente:** <https://www.postgresql.org/docs/16/functions-subquery.html> · <https://learn.microsoft.com/es-es/sql/t-sql/language-elements/exists-transact-sql>

2. **Pregunta:** Vistas: ¿para qué sirven?

   **Respuesta (con mis palabras):** Una vista es una consulta `SELECT` guardada con un nombre dentro de la base de datos, que después se puede consultar como si fuera una tabla. La vista no guarda los datos: cada vez que la consulto, el motor vuelve a ejecutar su `SELECT`, así que siempre muestra la información actual. Sirven para no repetir consultas largas, como los `JOIN` y el `GROUP BY` que calculan el total de cada pedido; para que otras personas trabajen con una consulta sencilla sin conocer todas las tablas; y para seguridad, porque se le puede dar permiso a un usuario sobre la vista sin dárselo sobre las tablas, y así solo ve las columnas que necesita. Para modificar una vista, PostgreSQL usa `CREATE OR REPLACE VIEW` y SQL Server `CREATE OR ALTER VIEW`.

   **Ejemplo propio:**

   ```sql
   CREATE VIEW vista_total_pedidos AS
   SELECT p.id_pedido, c.nombre AS cliente, p.fecha, p.estado,
          SUM(d.cantidad * d.precio_unitario) AS total
   FROM pedidos p
   INNER JOIN clientes c ON c.id_cliente = p.id_cliente
   INNER JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
   GROUP BY p.id_pedido, c.nombre, p.fecha, p.estado;

   SELECT cliente, fecha, total
   FROM vista_total_pedidos
   WHERE estado = 'entregado'
   ORDER BY total DESC;
   ```

   La vista junta pedidos, clientes y detalle, y calcula el total de cada pedido. Después la consulto como una tabla normal y filtro los pedidos entregados: salen 6, y el más alto es el de Luis Pérez, por 720000. El `ORDER BY` va en la consulta y no dentro de la vista, porque SQL Server no deja poner `ORDER BY` dentro de una vista. Además, en SQL Server el `CREATE VIEW` tiene que ejecutarse solo en su lote: en DBeaver funciona porque ejecuta cada sentencia por separado, pero en SQL Server Management Studio hay que separarlo con `GO`.

   **Fuente:** <https://www.postgresql.org/docs/16/tutorial-views.html> · <https://learn.microsoft.com/es-es/sql/relational-databases/views/views>

3. **Pregunta:** `CASE WHEN`, `COALESCE`, manejo de `NULL`.

   **Respuesta (con mis palabras):** `NULL` significa que no hay valor o que no se conoce; no es lo mismo que 0 ni que un texto vacío. Por eso no se compara con `=`: `columna = NULL` nunca es verdadero, y hay que usar `IS NULL` o `IS NOT NULL`. Cualquier operación con `NULL` da `NULL`, por ejemplo `5 + NULL`, y las funciones de agregación lo ignoran: `COUNT(*)` cuenta todas las filas, pero `COUNT(columna)` solo las que tienen valor. `COALESCE` recibe varios valores y devuelve el primero que no sea `NULL`, así que sirve para poner un valor por defecto, como 0 en vez de vacío; funciona en los dos motores, y SQL Server también tiene `ISNULL`, que hace algo parecido con dos valores. `CASE WHEN` permite poner condiciones dentro de una consulta y devolver un valor según la que se cumpla, como un `if/else` o un `switch` de C#. Las condiciones se revisan en orden y, si ninguna se cumple, devuelve lo del `ELSE`, o `NULL` si no hay `ELSE`.

   **Ejemplo propio:**

   ```sql
   SELECT c.nombre,
          COALESCE(SUM(d.cantidad * d.precio_unitario), 0) AS total_comprado,
          CASE
              WHEN SUM(d.cantidad * d.precio_unitario) IS NULL THEN 'Sin compras'
              WHEN SUM(d.cantidad * d.precio_unitario) >= 1000000 THEN 'Alto'
              WHEN SUM(d.cantidad * d.precio_unitario) >= 500000 THEN 'Medio'
              ELSE 'Bajo'
          END AS nivel
   FROM clientes c
   LEFT JOIN pedidos p ON p.id_cliente = c.id_cliente AND p.estado <> 'cancelado'
   LEFT JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
   GROUP BY c.id_cliente, c.nombre
   ORDER BY total_comprado DESC, c.nombre;
   ```

   La consulta calcula cuánto ha comprado cada cliente sin contar los pedidos cancelados y lo clasifica con `CASE WHEN`. Ana Gómez (1490000) y Carlos Mora (1440000) quedan en "Alto", Sofía Ruiz y Luis Pérez en "Medio", y los demás en "Bajo". Andrés López y Laura García no tienen pedidos, así que su suma da `NULL`: `COALESCE` la cambia por 0 y el `CASE` los marca como "Sin compras". Algo que aprendí con `NULL` es que el filtro de los cancelados tiene que ir en el `ON` del `LEFT JOIN`: si lo pongo en el `WHERE`, Andrés y Laura desaparecen del resultado, porque para ellos `p.estado` es `NULL` y `NULL <> 'cancelado'` no es verdadero.

   **Fuente:** <https://www.postgresql.org/docs/16/functions-conditional.html> · <https://learn.microsoft.com/es-es/sql/t-sql/language-elements/case-transact-sql> · <https://learn.microsoft.com/es-es/sql/t-sql/language-elements/coalesce-transact-sql>

4. **Pregunta:** Diferencias de sintaxis: `LIMIT` vs `TOP` / `OFFSET FETCH`, `SERIAL` / `IDENTITY`, `ILIKE` vs `LIKE` con collation, concatenación, fechas (`NOW()` vs `GETDATE()`).

   **Respuesta (con mis palabras):** Los dos motores usan SQL, pero cada uno tiene sus propias palabras para algunas cosas. Estas son las diferencias que más voy a usar:

   | Para | PostgreSQL | SQL Server |
   | --- | --- | --- |
   | Traer solo las primeras filas | `LIMIT 5` | `TOP 5` |
   | Paginar con la forma estándar, que sirve en los dos | `OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY` | `OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY` (exige `ORDER BY`) |
   | Id autoincremental | `SERIAL` | `IDENTITY(1, 1)` |
   | Buscar texto sin importar mayúsculas | `ILIKE` | `LIKE`, si la collation no distingue mayúsculas |
   | Concatenar texto | `\|\|` o `CONCAT()` | `+` o `CONCAT()` |
   | Fecha y hora actual | `NOW()` o `CURRENT_TIMESTAMP` | `GETDATE()`, `SYSDATETIME()` o `CURRENT_TIMESTAMP` |
   | Fecha de hoy sin la hora | `CURRENT_DATE` | `CAST(GETDATE() AS DATE)` |
   | Sumar días a una fecha | `fecha + 7` | `DATEADD(DAY, 7, fecha)` |
   | Días entre dos fechas | `fecha_fin - fecha_inicio` | `DATEDIFF(DAY, fecha_inicio, fecha_fin)` |

   La que más me costó entender fue la de `LIKE`. En PostgreSQL, `LIKE` distingue mayúsculas y minúsculas, y por eso existe `ILIKE`, que no las distingue. En SQL Server no existe `ILIKE`: que `LIKE` distinga o no depende de la collation, que es la configuración que define cómo se comparan y se ordenan los textos. La que trae por defecto, `SQL_Latin1_General_CP1_CI_AS`, tiene `CI` (no distingue mayúsculas) y `AS` (sí distingue tildes), entonces ahí `LIKE` funciona como `ILIKE`; la collation del servidor se puede ver con `SELECT SERVERPROPERTY('Collation');`. Ninguno de los dos ignora las tildes por defecto: buscar `'medellin'` sin tilde no encuentra `'Medellín'`. Con la concatenación también hay que tener cuidado, porque `||` y `+` devuelven `NULL` si alguna parte es `NULL`, mientras que `CONCAT()` toma el `NULL` como texto vacío.

   **Ejemplo propio:**

   ```sql
   SELECT nombre || ' - ' || ciudad AS cliente, email
   FROM clientes
   WHERE ciudad ILIKE 'medell%'
   ORDER BY nombre
   LIMIT 3;

   SELECT id_pedido, fecha, CURRENT_DATE - fecha AS dias_desde_pedido
   FROM pedidos
   WHERE estado = 'pendiente'
   ORDER BY fecha;
   ```

   ```sql
   SELECT TOP 3 nombre + ' - ' + ciudad AS cliente, email
   FROM clientes
   WHERE ciudad LIKE 'medell%'
   ORDER BY nombre;

   SELECT id_pedido, fecha, DATEDIFF(DAY, fecha, GETDATE()) AS dias_desde_pedido
   FROM pedidos
   WHERE estado = 'pendiente'
   ORDER BY fecha;
   ```

   El primer bloque es para PostgreSQL y el segundo para SQL Server, y hacen lo mismo. La primera consulta busca los clientes de Medellín escribiendo la ciudad en minúscula, junta el nombre y la ciudad en una sola columna y trae solo los 3 primeros: Ana Gómez, Laura García y Mateo Díaz. En PostgreSQL hay que usar `ILIKE`, porque con `LIKE 'medell%'` no sale nadie. La segunda consulta calcula cuántos días lleva cada pedido pendiente: hoy, 7 de octubre, el pedido 10 lleva 13 días, el 11 lleva 9 y el 12 lleva 6. En PostgreSQL basta con restar las fechas, y en SQL Server se usa `DATEDIFF`.

   **Fuente:** <https://www.postgresql.org/docs/16/functions-matching.html> · <https://www.postgresql.org/docs/16/functions-datetime.html> · <https://learn.microsoft.com/es-es/sql/t-sql/queries/top-transact-sql> · <https://learn.microsoft.com/es-es/sql/relational-databases/collations/collation-and-unicode-support>

## Autoinvestigación avanzada

1. **CTE y CTE recursivas.**

   Una CTE (Common Table Expression) es una consulta temporal con nombre que se escribe al principio con `WITH nombre AS (...)` y que solo existe mientras se ejecuta esa consulta. Sirve para dividir una consulta larga en pasos con nombre, en vez de meter subconsultas dentro de subconsultas, y se puede usar varias veces en la consulta principal. Por ejemplo, con una CTE `totales` calculo primero el total de cada pedido y después, en la consulta principal, el promedio por cliente: Ana Gómez tiene 3 pedidos, con un promedio de 496666.67.

   Una CTE recursiva es una CTE que se llama a sí misma. Tiene dos partes unidas con `UNION ALL`: la parte inicial, que da las primeras filas, y la parte recursiva, que usa el resultado anterior para generar las siguientes hasta que ya no devuelve filas. Se usa para recorrer jerarquías, como empleados y sus jefes o categorías dentro de categorías, o para generar series. Por ejemplo, si empiezo en `'2026-09-01'` y le sumo un día hasta llegar al 30, obtengo todos los días de septiembre y, con un `LEFT JOIN` a `pedidos`, veo que 23 de esos 30 días no tuvieron pedidos. La diferencia de sintaxis es que PostgreSQL exige escribir `WITH RECURSIVE`, mientras que SQL Server usa solo `WITH` y por defecto corta la recursión a los 100 niveles, algo que se puede cambiar con `OPTION (MAXRECURSION ...)`.

   **Fuente:** <https://www.postgresql.org/docs/16/queries-with.html> · <https://learn.microsoft.com/es-es/sql/t-sql/queries/with-common-table-expression-transact-sql>

2. **Funciones de ventana: `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`, `LEAD`, `SUM() OVER (PARTITION BY … ORDER BY …)`.**

   Las funciones de ventana hacen cálculos sobre un grupo de filas relacionadas con la fila actual, pero, a diferencia del `GROUP BY`, no juntan las filas: cada fila sigue apareciendo y se le agrega una columna con el resultado. Se escriben con `OVER`: adentro, `PARTITION BY` dice cómo se dividen las filas en grupos, como un `GROUP BY` que no junta, y `ORDER BY` el orden dentro de cada grupo. La sintaxis de `OVER` es la misma en los dos motores.

   `ROW_NUMBER` numera las filas 1, 2, 3 sin repetir; `RANK` les da el mismo puesto a los empates y se salta los siguientes; y `DENSE_RANK` también repite el puesto en los empates, pero sin saltarse números. Al ordenar los productos por unidades vendidas, Base para portátil y Cámara web HD empatan con 2 unidades: `RANK` les da el puesto 6 a las dos y el siguiente producto queda en el 8, `DENSE_RANK` deja al siguiente en el 7, y `ROW_NUMBER` les da 6 y 7. `LAG` trae el valor de la fila anterior y `LEAD` el de la siguiente: con `LAG(fecha) OVER (PARTITION BY id_cliente ORDER BY fecha)` obtengo la fecha del pedido anterior del mismo cliente, y al restarlas se ve que entre los pedidos de Ana Gómez pasaron 22 y 37 días. `SUM() OVER (ORDER BY fecha)` da un acumulado, como el total vendido hasta cada fecha. Algo importante es que no se pueden usar en el `WHERE`: para filtrar por ellas, por ejemplo para dejar solo el primer pedido de cada cliente, primero hay que calcularlas en una CTE o en una subconsulta.

   **Fuente:** <https://www.postgresql.org/docs/16/tutorial-window.html> · <https://learn.microsoft.com/es-es/sql/t-sql/queries/select-over-clause-transact-sql>

3. **Índices: qué son, cuándo ayudan y cuándo perjudican. `EXPLAIN ANALYZE` (PG) y plan de ejecución (SQL Server).**

   Un índice es una estructura aparte que guarda ordenados los valores de una o varias columnas, junto con la ubicación de cada fila, como el índice de un libro: en vez de leer todas las páginas, voy directo a la que necesito. Ayudan en las columnas que se usan mucho en `WHERE`, `JOIN` y `ORDER BY`, sobre todo cuando el filtro deja pocas filas de una tabla grande. Perjudican porque cada `INSERT`, `UPDATE` o `DELETE` también tiene que actualizar los índices, lo que hace más lentas las escrituras y ocupa más espacio; además, no sirven en tablas pequeñas ni en columnas con pocos valores distintos, como `estado`. Los dos motores crean solos un índice para la `PRIMARY KEY` y para los `UNIQUE`, pero no para las llaves foráneas, así que conviene crearlo, por ejemplo con `CREATE INDEX idx_pedidos_id_cliente ON pedidos (id_cliente);`, que se escribe igual en los dos. En SQL Server, la llave primaria crea por defecto un índice agrupado (clustered), que ordena la tabla físicamente por esa columna.

   Para ver si un índice se usa, en PostgreSQL está `EXPLAIN`, que muestra el plan que va a seguir el motor, y `EXPLAIN ANALYZE`, que además ejecuta la consulta y muestra los tiempos reales; por eso hay que tener cuidado al usarlo con un `UPDATE` o un `DELETE`. En SQL Server se revisa el plan de ejecución: en SQL Server Management Studio, con el botón "Incluir plan de ejecución real" (Ctrl+M), y en DBeaver, para los dos motores, con el plan de ejecución del editor (Ctrl+Shift+E). Con los 12 pedidos del proyecto, PostgreSQL hace un `Seq Scan`, es decir, lee toda la tabla, aunque exista el índice, porque es más rápido leer 12 filas que buscarlas en el índice. En cambio, con 200000 pedidos de prueba, sin índice hace un `Seq Scan` que revisa las 200000 filas y tarda unos 13 ms, y con el índice usa un `Bitmap Index Scan` y tarda menos de 1 ms.

   **Fuente:** <https://www.postgresql.org/docs/16/indexes.html> · <https://www.postgresql.org/docs/16/using-explain.html> · <https://learn.microsoft.com/es-es/sql/relational-databases/performance/display-an-actual-execution-plan> · <https://use-the-index-luke.com/es>

4. **Transacciones, ACID, niveles de aislamiento, `BEGIN`/`COMMIT`/`ROLLBACK`.**

   Una transacción es un grupo de sentencias que se ejecutan como una sola unidad: o se guardan todas o no se guarda ninguna. Por ejemplo, al registrar un pedido hay que insertar el pedido, insertar su detalle y descontar el stock; si algo falla a la mitad, no puede quedar el stock descontado sin pedido. Se empieza con `BEGIN` en PostgreSQL o `BEGIN TRANSACTION` en SQL Server, se confirma con `COMMIT` y se deshace con `ROLLBACK`. Por ejemplo, si dentro de una transacción descuento 2 teclados e inserto un pedido, antes del `ROLLBACK` el stock queda en 23, y después vuelve a 25 y el pedido desaparece. Es la misma idea que `BeginTransaction()` y `Commit()` en EF Core. En DBeaver, la barra muestra "Auto" cuando está en auto-commit, que confirma cada sentencia sola; si cambio el modo de transacción a manual, se activan los botones Confirmar y Revertir.

   ACID son las cuatro propiedades que garantiza una transacción: Atomicidad (todo o nada), Consistencia (los datos siempre cumplen las reglas, como las llaves y los `NOT NULL`), Aislamiento (las transacciones que corren al mismo tiempo no ven los cambios a medias de las otras) y Durabilidad (lo que se confirmó con `COMMIT` no se pierde aunque se caiga el servidor). Los niveles de aislamiento definen qué tanto se aíslan: `READ UNCOMMITTED` deja leer cambios que todavía no se han confirmado, llamados lecturas sucias (PostgreSQL lo trata igual que `READ COMMITTED`); `READ COMMITTED`, que es el nivel por defecto en los dos motores, solo deja ver lo confirmado; `REPEATABLE READ` asegura que si leo la misma fila dos veces, obtengo lo mismo; y `SERIALIZABLE` es el más estricto, como si las transacciones corrieran una detrás de otra, pero también el más lento. Una diferencia entre los motores es que en PostgreSQL, si una sentencia falla dentro de la transacción, las siguientes se ignoran hasta hacer `ROLLBACK`, mientras que en SQL Server la transacción sigue abierta, y conviene usar `SET XACT_ABORT ON` o `TRY...CATCH` para que un error la deshaga toda.

   **Fuente:** <https://www.postgresql.org/docs/16/tutorial-transactions.html> · <https://www.postgresql.org/docs/16/transaction-iso.html> · <https://learn.microsoft.com/es-es/sql/t-sql/statements/set-transaction-isolation-level-transact-sql>

5. **Funciones y procedimientos almacenados: PL/pgSQL y T-SQL.**

   Son bloques de código que se guardan dentro de la base de datos para reutilizarlos. Una función recibe parámetros, devuelve un valor o una tabla y se puede usar dentro de un `SELECT`, como cualquier función de SQL. Un procedimiento almacenado ejecuta acciones, como insertar o actualizar datos, y se llama con `CALL` en PostgreSQL o con `EXEC` en SQL Server. PL/pgSQL es el lenguaje de PostgreSQL para escribirlos: el código va entre `$$`, las variables se declaran en `DECLARE` y al final se indica `LANGUAGE plpgsql`. T-SQL es el lenguaje de SQL Server: los parámetros y las variables empiezan con `@`, como `@id_pedido`, y las funciones se llaman con el esquema, por ejemplo `dbo.total_pedido(12)`.

   Por ejemplo, una función `total_pedido` que suma el detalle de un pedido: `SELECT total_pedido(12);` devuelve 785000.00, y para un pedido que no existe devuelve 0 gracias al `COALESCE`. Y un procedimiento `cambiar_estado`, que actualiza el estado de un pedido y se llama con `CALL cambiar_estado(12, 'enviado');` en PostgreSQL o con `EXEC dbo.cambiar_estado @id_pedido = 12, @estado = 'enviado';` en SQL Server. Una diferencia es que en SQL Server una función no puede modificar datos, eso solo lo hace un procedimiento, mientras que en PostgreSQL una función sí puede hacer un `UPDATE`, pero solo un procedimiento puede hacer `COMMIT` por dentro. Sirven para reutilizar lógica y para dar permiso de ejecutar algo sin dar acceso directo a las tablas, aunque la lógica dentro de la base de datos es más difícil de probar y de versionar que la del backend.

   **Fuente:** <https://www.postgresql.org/docs/16/plpgsql.html> · <https://learn.microsoft.com/es-es/sql/t-sql/statements/create-function-transact-sql> · <https://learn.microsoft.com/es-es/sql/t-sql/statements/create-procedure-transact-sql>

6. **Vistas materializadas (PG) y triggers.**

   Una vista materializada es como una vista normal, pero guarda el resultado en disco. Eso la hace rápida de consultar, porque no vuelve a ejecutar el `SELECT` cada vez, pero sus datos no se actualizan solos: hay que refrescarla con `REFRESH MATERIALIZED VIEW nombre;`. Por eso sirve para reportes pesados que no necesitan estar al segundo, como las ventas por mes. Por ejemplo, una vista materializada `ventas_por_mes` muestra agosto con 1830000, septiembre con 3075000 y octubre con 785000; si agrego un producto al pedido 12, octubre sigue mostrando 785000 hasta que ejecuto el `REFRESH`, y ahí pasa a 855000. SQL Server no tiene vistas materializadas con ese nombre: lo más parecido son las vistas indexadas, que se crean con `WITH SCHEMABINDING` y un índice agrupado único, y que SQL Server mantiene actualizadas solo.

   Un trigger es código que se ejecuta automáticamente cuando pasa un `INSERT`, `UPDATE` o `DELETE` en una tabla, como un evento en C#. En PostgreSQL se hace en dos partes: una función que devuelve `TRIGGER` y usa `NEW` (la fila nueva) y `OLD` (la fila anterior), y el `CREATE TRIGGER`, que dice cuándo se dispara, por ejemplo `AFTER INSERT ON detalle_pedido FOR EACH ROW`. Con un trigger así, al insertar 2 memorias USB en el detalle, el stock baja solo de 60 a 58. En SQL Server el trigger se dispara una sola vez por sentencia, no por fila, y en vez de `NEW` y `OLD` usa las tablas `inserted` y `deleted`, que pueden traer varias filas. Hay que usarlos con cuidado, porque hacen cosas que no se ven en el código de la aplicación, y eso hace más difícil encontrar errores.

   **Fuente:** <https://www.postgresql.org/docs/16/rules-materializedviews.html> · <https://www.postgresql.org/docs/16/plpgsql-trigger.html> · <https://learn.microsoft.com/es-es/sql/t-sql/statements/create-trigger-transact-sql> · <https://learn.microsoft.com/es-es/sql/relational-databases/views/create-indexed-views>

7. **Seguridad: roles, mínimo privilegio, inyección SQL y consultas parametrizadas.**

   Un rol es un usuario o un grupo de usuarios con permisos sobre la base de datos. En PostgreSQL todo es un rol: se crea con `CREATE ROLE` y, si puede iniciar sesión, lleva `LOGIN`. En SQL Server hay dos niveles: el inicio de sesión (`CREATE LOGIN`), que es para entrar al servidor, y el usuario (`CREATE USER`), que es para cada base de datos; además, trae roles listos, como `db_datareader` para leer y `db_datawriter` para escribir. Los permisos se dan con `GRANT` y se quitan con `REVOKE`. El principio de mínimo privilegio dice que cada usuario o aplicación debe tener solo los permisos que necesita, ni uno más. Por ejemplo, un rol `reportes` con `GRANT SELECT ON pedidos, detalle_pedido, productos TO reportes;` puede leer los pedidos, pero si intenta leer `clientes` o borrar un pedido le sale "permission denied". También entendí que `postgres` y `sa`, los usuarios con los que practiqué, son superusuarios, y que una aplicación real se debe conectar con un usuario propio con permisos limitados.

   La inyección SQL pasa cuando la consulta se arma concatenando lo que escribe el usuario. Si el código hace `"SELECT * FROM clientes WHERE email = '" + email + "'"` y alguien escribe `' OR '1'='1`, la consulta queda `WHERE email = '' OR '1'='1'`, que siempre es verdadera, y devuelve los 10 clientes. Se evita con consultas parametrizadas, donde la consulta y los valores se envían por separado y el valor nunca se ejecuta como SQL: en C# con ADO.NET se usa `@email` con `cmd.Parameters.AddWithValue("@email", email)`; en Node con la librería `pg`, `$1` y un arreglo con los valores; y en TypeORM, `.where("cliente.email = :email", { email })`. Con una consulta preparada (`PREPARE`) en PostgreSQL, el mismo texto `' OR '1'='1` se busca como un email cualquiera y no devuelve ninguna fila. Un procedimiento almacenado no protege por sí solo si por dentro también arma el SQL concatenando texto.

   **Fuente:** <https://www.postgresql.org/docs/16/user-manag.html> · <https://learn.microsoft.com/es-es/sql/relational-databases/security/sql-injection> · <https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html>

## Lo que aprendí hoy (3 cosas)

- A crear un procedimiento almacenado que registra un pedido completo dentro de una transacción, en PL/pgSQL y en T-SQL: valida los datos, inserta el pedido y su detalle, y descuenta el stock con `UPDATE ... WHERE stock >= cantidad`, para que dos pedidos al mismo tiempo no lo dejen negativo. Si un producto no tiene stock, se deshace todo: en PostgreSQL con `RAISE EXCEPTION`, que cancela la transacción, y en SQL Server con `ROLLBACK TRANSACTION` dentro de un `TRY...CATCH`.
- La diferencia entre una vista, que vuelve a calcular todo cada vez que se consulta, y una vista materializada, que guarda el resultado y solo se actualiza con `REFRESH MATERIALIZED VIEW`. También a usar funciones de ventana (`RANK`, `SUM() OVER` y `LAG`) para armar un ranking de clientes por mes sin juntar las filas.
- A medir una consulta con `EXPLAIN (ANALYZE, BUFFERS)`. En una tabla de prueba con 200000 pedidos, sin índice PostgreSQL hace un `Seq Scan` que lee las 1274 páginas de la tabla, y con el índice usa un `Bitmap Index Scan` y lee solo 22. En tablas pequeñas, como las del proyecto, el índice no se nota.

## Lo que no entendí o me costó

- Entender el procedimiento `registrar_pedido` línea por línea, sobre todo cómo se lee el JSON del detalle (`jsonb_to_recordset` y `OPENJSON`), cómo se obtiene el id del pedido nuevo (`RETURNING ... INTO` y `SCOPE_IDENTITY()`) y para qué sirven `@@ROWCOUNT` y `TRY...CATCH`.
- Entender por qué en PostgreSQL el procedimiento no tiene `COMMIT` ni `ROLLBACK`: el `CALL` ya corre dentro de una transacción, y el `RAISE EXCEPTION` la cancela.
- Saber cómo ejecutar cada cosa en DBeaver: el procedimiento hay que seleccionarlo completo, porque tiene `;` y líneas en blanco por dentro; las pruebas van una por una con Ctrl+Enter; y en SQL Server la selección no debe incluir el `GO`.

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
| --- | --- | --- |
| Al ejecutar la prueba 2 no salieron los resultados de las consultas de verificación | Seleccioné el `CALL` junto con los `SELECT` de abajo y, como ese `CALL` falla a propósito, DBeaver se detuvo en el error y no ejecutó lo demás | Ejecuté cada sentencia por separado, con el cursor sobre ella y Ctrl+Enter, sin seleccionar nada |
| En la Salida apareció "Pedido 17 registrado" y el stock no cuadraba con lo esperado | Ejecuté la prueba 1 dos veces, y los intentos de la prueba 2 gastaron los id 14, 15 y 16, porque el `SERIAL` no devuelve los números aunque se haga ROLLBACK | Borré la base `induccion` y la volví a crear: en PostgreSQL desde PowerShell con `docker exec pg-induccion psql -U postgres -c "DROP DATABASE IF EXISTS induccion WITH (FORCE);"`, y en SQL Server con `USE master` y `ALTER DATABASE induccion SET SINGLE_USER WITH ROLLBACK IMMEDIATE` antes del `DROP DATABASE`, porque no se puede borrar una base con conexiones abiertas. Después cargué otra vez el modelo y los datos y ejecuté cada prueba una sola vez |
| El ejercicio pedía las 12 consultas avanzadas de `03_Ejercicios_por_Tema.md` | El archivo no está en el repositorio ni en el material | Escribí 12 consultas avanzadas sobre el modelo del proyecto integrador, en PostgreSQL y en SQL Server, en `semana-2/sql-avanzado` |

## Uso de IA hoy

- ¿La usé? Sí.
- ¿Para qué? Para entender los temas de la autoinvestigación, armar el reto en los dos motores, que me explicara los scripts línea por línea, guiarme para ejecutarlos en DBeaver con Docker sentencia por sentencia, y borrar y volver a crear la base cuando los datos quedaron mal.
- ¿Qué aprendí de eso? Que no basta con tener el código: tengo que entender cada línea para poder explicarlo. También, que las pruebas que cambian datos hay que ejecutarlas una sola vez y en orden, porque cada ejecución deja la base distinta.

## Autoevaluación del tema (1-5): 3

Logré ejecutar el reto en DBeaver y entendí la idea de las transacciones, las vistas, las funciones de ventana y los índices, pero todavía me cuesta escribir un procedimiento almacenado sin ayuda, sobre todo la parte del JSON y el manejo de errores en T-SQL.
