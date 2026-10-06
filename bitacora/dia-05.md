# Bitácora Día 05 · SQL básico en PostgreSQL y SQL Server

**Fecha:** 06-10-2026

**Horas invertidas:** 4 h (autoinvestigación 1 h · práctica 2 h · reto 1 h)

## Autoinvestigación básica

1. **Pregunta:** ¿Qué es una base de datos relacional, tabla, llave primaria y llave foránea?

   **Respuesta (con mis palabras):** Una base de datos relacional organiza la información en tablas que se relacionan entre sí por medio de llaves. Una tabla es como una hoja de Excel: las columnas dicen qué dato se guarda (nombre, ciudad, precio) y cada fila es un registro. La llave primaria (`PRIMARY KEY`) es la columna que identifica cada fila de forma única; no se puede repetir ni quedar vacía, como la cédula de una persona. La llave foránea (`FOREIGN KEY`) es una columna que guarda la llave primaria de otra tabla para relacionarlas; por ejemplo, cada pedido guarda el `id_cliente` del cliente que lo hizo. Gracias a la llave foránea, la base de datos no deja guardar un pedido de un cliente que no existe, y así los datos se mantienen consistentes. Es lo mismo que configuraba con las relaciones de EF Core en C#, pero escrito directamente en SQL.

   **Ejemplo propio:**

   ```sql
   CREATE TABLE clientes (
       id_cliente INT PRIMARY KEY,
       nombre VARCHAR(100) NOT NULL,
       ciudad VARCHAR(60) NOT NULL
   );

   CREATE TABLE pedidos (
       id_pedido INT PRIMARY KEY,
       id_cliente INT NOT NULL,
       fecha DATE NOT NULL,
       FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
   );

   INSERT INTO clientes (id_cliente, nombre, ciudad) VALUES (1, 'Ana Gómez', 'Medellín');
   INSERT INTO pedidos (id_pedido, id_cliente, fecha) VALUES (1, 1, '2026-10-06');
   INSERT INTO pedidos (id_pedido, id_cliente, fecha) VALUES (2, 99, '2026-10-06');
   ```

   `id_cliente` es la llave primaria de `clientes` y `id_pedido` la de `pedidos`. En `pedidos`, la columna `id_cliente` es una llave foránea que apunta a `clientes`. El primer pedido se guarda bien porque el cliente 1 existe, pero el último `INSERT` da error, porque no hay ningún cliente con el id 99 y la llave foránea no deja crear un pedido sin cliente.

   **Fuente:** <https://learn.microsoft.com/es-es/sql/relational-databases/tables/primary-and-foreign-key-constraints> · <https://www.postgresql.org/docs/16/ddl-constraints.html>

2. **Pregunta:** DDL vs DML: `CREATE`, `ALTER`, `DROP` vs `INSERT`, `UPDATE`, `DELETE`, `SELECT`.

   **Respuesta (con mis palabras):** DDL (Data Definition Language) son los comandos que crean o cambian la estructura de la base de datos: `CREATE` crea una tabla o una base de datos, `ALTER` modifica una tabla que ya existe, por ejemplo para agregarle una columna, y `DROP` la elimina por completo, con todos sus datos. DML (Data Manipulation Language) son los comandos que trabajan con los datos que hay dentro de las tablas: `INSERT` agrega filas, `UPDATE` cambia valores, `DELETE` borra filas y `SELECT` consulta la información. Algunos autores ponen `SELECT` en otro grupo llamado DQL, porque solo lee datos y no los modifica. Algo importante que aprendí es la diferencia entre `DELETE` y `DROP`: `DELETE` borra filas pero la tabla sigue existiendo, mientras que `DROP` elimina la tabla. También, un `UPDATE` o un `DELETE` sin `WHERE` afecta todas las filas de la tabla.

   **Ejemplo propio:**

   ```sql
   CREATE TABLE productos (
       id_producto INT PRIMARY KEY,
       nombre VARCHAR(100) NOT NULL,
       precio DECIMAL(12, 2) NOT NULL
   );

   ALTER TABLE productos ADD stock INT;

   INSERT INTO productos (id_producto, nombre, precio, stock) VALUES (1, 'Teclado mecánico', 180000, 25);
   UPDATE productos SET precio = 170000 WHERE id_producto = 1;
   SELECT nombre, precio, stock FROM productos;
   DELETE FROM productos WHERE id_producto = 1;

   DROP TABLE productos;
   ```

   Las dos primeras sentencias son DDL: `CREATE TABLE` crea la tabla `productos` y `ALTER TABLE` le agrega la columna `stock`. Luego vienen las de DML: inserto un teclado, le bajo el precio con `UPDATE` (con `WHERE` para cambiar solo ese producto), lo consulto con `SELECT`, que muestra el teclado con precio 170000, y lo borro con `DELETE`. Al final, `DROP TABLE` elimina la tabla completa. Escribí `ADD stock INT` sin la palabra `COLUMN` porque así funciona igual en PostgreSQL y en SQL Server.

   **Fuente:** <https://www.postgresql.org/docs/16/sql-commands.html> · <https://learn.microsoft.com/es-es/sql/t-sql/statements/statements>

3. **Pregunta:** `WHERE`, `ORDER BY`, `GROUP BY`, `HAVING`, funciones de agregación.

   **Respuesta (con mis palabras):** `WHERE` filtra las filas que cumplen una condición, antes de agrupar. `ORDER BY` ordena el resultado, de menor a mayor con `ASC` (la opción por defecto) o de mayor a menor con `DESC`. `GROUP BY` junta las filas que tienen el mismo valor en una columna para calcular algo por cada grupo, y para eso se usan las funciones de agregación: `COUNT` cuenta, `SUM` suma, `AVG` saca el promedio, y `MIN` y `MAX` dan el valor menor y el mayor. `HAVING` filtra los grupos después de agrupar; la diferencia con `WHERE` es que `HAVING` sí puede usar funciones de agregación, como `COUNT(*) > 1`. Aprendí que SQL procesa estas partes en este orden: `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `SELECT` y por último `ORDER BY`, aunque se escriban en otro orden. Es muy parecido a usar `Where`, `GroupBy` y `OrderBy` en LINQ.

   **Ejemplo propio:**

   ```sql
   SELECT categoria, COUNT(*) AS cantidad, MIN(precio) AS mas_barato, MAX(precio) AS mas_caro
   FROM productos
   WHERE stock > 0
   GROUP BY categoria
   HAVING COUNT(*) >= 2
   ORDER BY cantidad DESC, categoria;
   ```

   Con los productos del proyecto, `WHERE` deja solo los que tienen unidades en inventario, `GROUP BY` los agrupa por categoría y en cada grupo calculo cuántos productos hay, el precio más bajo y el más alto. Después `HAVING` deja solo las categorías con al menos dos productos, y `ORDER BY` las ordena de la que tiene más productos a la que tiene menos. El resultado es Periféricos con 3, y Accesorios y Almacenamiento con 2 cada una.

   **Fuente:** <https://www.postgresql.org/docs/16/tutorial-agg.html> · <https://learn.microsoft.com/es-es/sql/t-sql/queries/select-group-by-transact-sql>

4. **Pregunta:** `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL JOIN`.

   **Respuesta (con mis palabras):** Los `JOIN` sirven para combinar filas de dos tablas usando una columna en común, casi siempre la llave foránea. `INNER JOIN` devuelve solo las filas que tienen pareja en las dos tablas, por ejemplo los pedidos con su cliente. `LEFT JOIN` devuelve todas las filas de la tabla de la izquierda, tengan o no pareja, y donde no hay pareja las columnas de la otra tabla quedan en `NULL`. `RIGHT JOIN` es lo mismo, pero conserva todas las filas de la tabla de la derecha. `FULL JOIN` devuelve todas las filas de las dos tablas, tengan o no pareja. Un truco muy útil es usar `LEFT JOIN` con `WHERE ... IS NULL` para encontrar lo que no tiene relación, como los clientes que nunca han comprado.

   **Ejemplo propio:**

   ```sql
   SELECT c.nombre, p.id_pedido, p.fecha
   FROM clientes c
   INNER JOIN pedidos p ON p.id_cliente = c.id_cliente;

   SELECT c.nombre
   FROM clientes c
   LEFT JOIN pedidos p ON p.id_cliente = c.id_cliente
   WHERE p.id_pedido IS NULL;
   ```

   La primera consulta une cada pedido con su cliente, así que solo salen los clientes que tienen pedidos, una vez por cada pedido. La segunda usa `LEFT JOIN`, entonces salen todos los clientes, y los que no tienen pedidos quedan con `id_pedido` en `NULL`; con el `WHERE` me quedo solo con esos, que en los datos del proyecto son Andrés López y Laura García. En este modelo, un `FULL JOIN` entre clientes y pedidos da lo mismo que el `LEFT JOIN`, porque la llave foránea no deja que exista un pedido sin cliente.

   **Fuente:** <https://www.postgresql.org/docs/16/tutorial-join.html> · <https://learn.microsoft.com/es-es/sql/relational-databases/performance/joins>

5. **Pregunta:** Tipos de datos más usados en PostgreSQL y en SQL Server y sus equivalencias.

   **Respuesta (con mis palabras):** Los dos motores tienen tipos de datos parecidos, pero varios cambian de nombre. Estos son los que más se usan y sus equivalencias:

   | Para guardar | PostgreSQL | SQL Server |
   | --- | --- | --- |
   | Números enteros | `INTEGER`, `BIGINT`, `SMALLINT` | `INT`, `BIGINT`, `SMALLINT` |
   | Números con decimales exactos, como dinero | `NUMERIC(p, s)` o `DECIMAL(p, s)` | `DECIMAL(p, s)` o `NUMERIC(p, s)` |
   | Números con decimales aproximados | `REAL`, `DOUBLE PRECISION` | `REAL`, `FLOAT` |
   | Texto con límite | `VARCHAR(n)` | `VARCHAR(n)` o `NVARCHAR(n)` |
   | Texto largo | `TEXT` | `VARCHAR(MAX)` o `NVARCHAR(MAX)` |
   | Verdadero o falso | `BOOLEAN` | `BIT` |
   | Fecha | `DATE` | `DATE` |
   | Fecha y hora | `TIMESTAMP` | `DATETIME2` |
   | Fecha y hora con zona horaria | `TIMESTAMPTZ` | `DATETIMEOFFSET` |
   | Identificador único | `UUID` | `UNIQUEIDENTIFIER` |
   | Id autoincremental | `SERIAL` | `IDENTITY(1, 1)` |

   Una diferencia importante está en el texto: en PostgreSQL `VARCHAR` guarda cualquier carácter, mientras que en SQL Server, para guardar cualquier carácter sin problemas, se usa `NVARCHAR`, que es Unicode.

   **Ejemplo propio:**

   ```sql
   CREATE TABLE productos (
       id_producto SERIAL PRIMARY KEY,
       nombre VARCHAR(100) NOT NULL,
       precio NUMERIC(12, 2) NOT NULL,
       activo BOOLEAN NOT NULL DEFAULT TRUE,
       creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
   );
   ```

   ```sql
   CREATE TABLE productos (
       id_producto INT IDENTITY(1, 1) PRIMARY KEY,
       nombre NVARCHAR(100) NOT NULL,
       precio DECIMAL(12, 2) NOT NULL,
       activo BIT NOT NULL DEFAULT 1,
       creado_en DATETIME2 NOT NULL DEFAULT SYSDATETIME()
   );
   ```

   El primer bloque es para PostgreSQL y el segundo para SQL Server. Las dos versiones crean la misma tabla, pero con los tipos de cada motor: el id autoincremental, `VARCHAR` contra `NVARCHAR`, `NUMERIC` contra `DECIMAL`, `BOOLEAN` contra `BIT` (que guarda 1 o 0) y `TIMESTAMP` contra `DATETIME2`. Para la fecha y hora actual, PostgreSQL usa `CURRENT_TIMESTAMP` y SQL Server `SYSDATETIME()`. En el modelo del proyecto no usé `BOOLEAN` ni `BIT`, porque se insertan diferente en cada motor, y así pude usar el mismo `datos.sql` en los dos.

   **Fuente:** <https://www.postgresql.org/docs/16/datatype.html> · <https://learn.microsoft.com/es-es/sql/t-sql/data-types/data-types-transact-sql>

## Lo que aprendí hoy (3 cosas)

- Qué es Docker y cómo usarlo. Una imagen es como una clase en C# y un contenedor es como un objeto creado a partir de ella: la imagen es la plantilla del programa y el contenedor es esa imagen corriendo, aislada del resto de mi equipo. Con `docker run` levanté contenedores desde imágenes oficiales, usando `-d` para que corran en segundo plano, `--name` para ponerles nombre, `-e` para pasarles variables como la contraseña y `-p` para conectar el puerto del contenedor con el de mi equipo. Con `docker ps` veo los contenedores que están corriendo y con `docker logs` reviso lo que pasa adentro.
- A montar dos servidores de bases de datos en mi equipo con Docker, PostgreSQL 16 en el puerto 5432 y SQL Server 2022 en el 1433, sin instalarlos directamente en Windows, y a conectarme a los dos desde DBeaver con `localhost`, el puerto, el usuario y la base de datos `induccion`. En SQL Server, además, hay que marcar la opción *Trust Server Certificate*.
- A crear el modelo del proyecto integrador (`clientes`, `productos`, `pedidos` y `detalle_pedido`) con llaves primarias y foráneas, cargarle datos y hacer 12 consultas con `WHERE`, `GROUP BY`, `HAVING` y `JOIN`. Hay un modelo para cada motor, pero `datos.sql` y `consultas_basicas.sql` son los mismos para PostgreSQL y SQL Server.

## Lo que no entendí o me costó

- Entender por qué Docker Desktop no arrancaba y qué tenía que ver WSL: en Windows, Docker corre los contenedores dentro de un Linux liviano que da WSL 2, así que sin WSL no funciona.
- La sintaxis más avanzada para crear tablas, como `CONSTRAINT` con nombre y `GENERATED ALWAYS AS IDENTITY`. Dejé el modelo con `SERIAL` en PostgreSQL, `IDENTITY(1, 1)` en SQL Server y `REFERENCES` en la misma columna, que hace lo mismo y es más fácil de leer.
- Escribir consultas que funcionen igual en los dos motores. Para el top 5, PostgreSQL usa `LIMIT` y SQL Server usa `TOP`, así que usé `OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY`, que funciona en los dos. Para el promedio usé `CAST(AVG(precio) AS DECIMAL(12, 2))`, para que los dos motores muestren el mismo resultado con dos decimales.

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
| --- | --- | --- |
| Docker Desktop no arrancaba: "Virtualization support not detected" | Docker Desktop en Windows necesita WSL 2 y mi equipo no lo tenía instalado | Ejecuté `wsl --install`, que instaló WSL y la Plataforma de máquina virtual, reinicié el equipo y Docker arrancó bien |
| Al correr `modelo_postgres.sql` salieron los avisos "table ... does not exist, skipping" | El `DROP TABLE IF EXISTS` intenta borrar las tablas antes de crearlas, y la primera vez todavía no existían | No era un error: son avisos normales y las tablas se crearon igual |
| Las tablas no aparecían en la base `induccion` en DBeaver | La primera vez corrí el script cuando la conexión todavía estaba en la base `postgres`, así que las tablas se crearon allá | Cambié la base de la conexión a `induccion` con F4, volví a correr el script con Alt+X y refresqué el árbol con F5 |

## Uso de IA hoy

- ¿La usé? Sí.
- ¿Para qué? Para entender los temas de la autoinvestigación, guiarme paso a paso para levantar PostgreSQL y SQL Server con Docker y conectarme a ellos con DBeaver, resolver el error de virtualización de Docker y dejar el modelo con una sintaxis más sencilla.
- ¿Qué aprendí de eso? Que hay que leer bien los mensajes antes de asumir que algo falló: los avisos del `DROP TABLE IF EXISTS` no eran errores, y el log de SQL Server dice cuándo ya está listo para recibir conexiones. También, que antes de correr un script hay que revisar a qué base de datos estoy conectado.

## Autoevaluación del tema (1-5): 4

Logré montar los dos servidores con Docker, conectarme a ellos con DBeaver y correr el modelo, los datos y las 12 consultas en los dos motores, pero todavía necesito practicar los `JOIN` y el `GROUP BY` con `HAVING` para escribirlos sin ayuda, y aprender más comandos de Docker para manejar los contenedores, como detenerlos, volver a iniciarlos y borrarlos.
