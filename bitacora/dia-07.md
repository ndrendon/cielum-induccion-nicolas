# Bitácora Día 07 · Node.js y Express : API REST

**Fecha:** 08-10-2026

**Horas invertidas:** 6 h (autoinvestigación 2 h · práctica 2 h · reto 3 h)

## Autoinvestigación básica

1. **Pregunta:** ¿Qué es Node.js y en qué se diferencia de JS en el navegador?

   **Respuesta (con mis palabras):** Node.js es un programa que permite ejecutar JavaScript fuera del navegador. Normalmente JavaScript vive en las páginas web y lo ejecuta el navegador, como Chrome o Edge; con Node.js lo puedo ejecutar en mi computador o en un servidor, desde la terminal. Por eso se usa para hacer el backend, que es la parte que recibe las peticiones, habla con la base de datos y devuelve los datos. El lenguaje es el mismo; lo que cambia es lo que puedo hacer con él. En el navegador puedo manejar la página (botones, textos, colores), pero no puedo tocar los archivos del computador. En Node no hay ninguna página que manejar, pero sí puedo leer y crear archivos, conectarme a una base de datos y crear un servidor.

   **Fuente:** <https://nodejs.org/en/learn/getting-started/introduction-to-nodejs> · <https://nodejs.org/en/learn/getting-started/differences-between-nodejs-and-the-browser>

2. **Pregunta:** npm, package.json, dependencias vs devDependencies, package-lock.json, scripts.

   **Respuesta (con mis palabras):** npm es la herramienta que viene con Node para instalar librerías, que son código que otras personas ya hicieron y que puedo usar en mi proyecto, como Express. El `package.json` es el archivo principal del proyecto: dice cómo se llama, qué librerías necesita y qué comandos tiene. Las librerías se dividen en dos grupos: las `dependencies`, que el proyecto necesita para funcionar, y las `devDependencies`, que solo uso mientras programo, como las que sirven para hacer pruebas. El `package-lock.json` es un archivo que npm crea solo y que anota la versión exacta de cada librería instalada, para que cuando otra persona descargue el proyecto le queden las mismas versiones. Ese archivo sí se sube a Git, pero la carpeta `node_modules`, donde quedan guardadas las librerías descargadas, no. Los `scripts` son atajos para comandos largos: por ejemplo, en vez de escribir todo el comando para arrancar el proyecto, escribo `npm start`.

   **Fuente:** <https://docs.npmjs.com/cli/v11/configuring-npm/package-json> · <https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json> · <https://docs.npmjs.com/cli/v11/using-npm/scripts>

3. **Pregunta:** ¿Qué es REST? Métodos HTTP, códigos de estado (200, 201, 204, 400, 401, 403, 404, 409, 500).

   **Respuesta (con mis palabras):** Una API es la forma en que dos programas se comunican, por ejemplo cuando una página web le pide datos a un servidor. REST es una manera ordenada de hacer APIs: cada cosa que maneja la API, como los productos o los clientes, tiene su propia dirección, por ejemplo `/productos`, y lo que quiero hacer con ella lo digo con el método HTTP. `GET` sirve para consultar, `POST` para crear, `PUT` y `PATCH` para modificar (`PUT` cambia todo y `PATCH` solo una parte) y `DELETE` para borrar. El servidor siempre contesta con un código de estado, que es un número que dice cómo salió todo. Los que empiezan por 2 significan que salió bien: `200` (todo bien), `201` (se creó algo nuevo) y `204` (salió bien, pero no hay nada que mostrar). Los que empiezan por 4 significan que el error es de quien hizo la petición: `400` (mandó datos incompletos o mal escritos), `401` (no ha iniciado sesión), `403` (inició sesión, pero no tiene permiso), `404` (lo que busca no existe) y `409` (choca con algo que ya existe, como un correo repetido). El `500` significa que el error fue del servidor.

   **Fuente:** <https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Status> · <https://learn.microsoft.com/es-es/azure/architecture/best-practices/api-design>

4. **Pregunta:** ¿Qué es Express, qué es una ruta y qué es un middleware?

   **Respuesta (con mis palabras):** Express es una librería que facilita hacer un servidor o una API con Node. Sin Express habría que escribir mucho más código para cosas básicas, como leer lo que llega en cada petición. NestJS, el framework que usamos en Cielum, usa Express por debajo. Una ruta es una dirección de la API junto con su método, por ejemplo `GET /productos`, y lo que el servidor debe hacer cuando alguien la pide, como devolver la lista de productos. Un middleware es un paso intermedio por el que pasan las peticiones antes de llegar a la ruta: puede revisar la petición, por ejemplo que el usuario haya iniciado sesión, y dejarla seguir o devolverla con un error. Se pueden poner varios middleware, uno detrás de otro, y se ejecutan en orden.

   **Fuente:** <https://expressjs.com/es/guide/routing.html> · <https://expressjs.com/es/guide/using-middleware.html>

5. **Pregunta:** Variables de entorno con .env

   **Respuesta (con mis palabras):** Las variables de entorno son datos de configuración que el programa recibe desde afuera, en vez de tenerlos escritos dentro del código; por ejemplo, el puerto donde corre la API, el usuario y la contraseña de la base de datos o las claves secretas. Así no hay que cambiar el código para pasar de mi computador al servidor: solo cambian esos valores. El archivo `.env` es donde se guardan esas variables mientras desarrollo, una por línea, con la forma `NOMBRE=valor`. Como tiene contraseñas, el `.env` nunca se sube a Git; en mi proyecto ya está en el `.gitignore`. Lo que sí se suele subir es un archivo `.env.example` con los nombres de las variables, pero sin los valores, para que los demás sepan cuáles tienen que llenar.

   **Fuente:** <https://nodejs.org/learn/command-line/how-to-read-environment-variables-from-nodejs> · <https://12factor.net/es/config>

## Autoinvestigación avanzada

1. **Arquitectura por capas: rutas → controladores → servicios → repositorios.**

   Es organizar el código de la API en partes, donde cada una tiene un solo trabajo. Las **rutas** reciben la petición y la mandan al lugar correcto. El **controlador** revisa lo que llegó y prepara la respuesta. El **servicio** tiene las reglas del negocio, por ejemplo que no se puede vender un producto si no hay stock. El **repositorio** es el único que habla con la base de datos. Una petición pasa por todas las capas en ese orden, y la respuesta vuelve por el mismo camino. La ventaja es que el código queda ordenado y, si algo falla, se sabe dónde buscar. NestJS, que usamos en Cielum, organiza el código de esta forma.

   **Fuente:** <https://expressjs.com/es/guide/routing.html> · <https://docs.nestjs.com/controllers> · <https://docs.nestjs.com/providers>

2. **Validación de entrada (zod o joi).**

   Validar es revisar que los datos que manda el usuario estén bien antes de usarlos: que no falte nada, que donde va un número haya un número y que un precio no sea negativo. No se puede confiar en lo que llega, porque puede venir con errores o con mala intención. zod y joi son librerías para eso: uno describe cómo deben ser los datos, por ejemplo "el nombre es un texto obligatorio y el precio es un número mayor que 0", y la librería los revisa y dice qué está mal. Si algo no cumple, la API responde con un error `400` y explica qué campos están mal.

   **Fuente:** <https://zod.dev/basics> · <https://zod.dev/error-formatting> · <https://github.com/hapijs/joi>

3. **Manejo centralizado de errores.**

   Es tener un solo lugar en la API que se encarga de todos los errores, en vez de repetir el mismo manejo de errores en cada ruta. Cuando algo falla en cualquier parte, el error se manda a ese lugar, que en Express es un middleware especial que va al final, y ahí se decide qué responder: un `404` si el producto no existe, un `400` si los datos están mal o un `500` si fue un error inesperado. Así todas las respuestas de error tienen la misma forma, y al usuario no se le muestran detalles internos del servidor.

   **Fuente:** <https://expressjs.com/en/guide/error-handling.html> · <https://www.postgresql.org/docs/16/errcodes-appendix.html>

4. **Conexión a PostgreSQL con pg (pool, consultas parametrizadas).**

   `pg` es la librería para que Node se conecte a PostgreSQL. Conectarse a la base de datos se demora un poco, así que en vez de abrir una conexión nueva cada vez que llega una petición, se usa un **pool**: un grupo de conexiones que se abren una sola vez y se van prestando y devolviendo. Las consultas parametrizadas son las que no pegan los datos del usuario dentro del texto de la consulta, sino que los mandan aparte, en el lugar de unas marcas como `$1`. Así nadie puede colar código SQL escribiéndolo en un campo de un formulario, que es la inyección SQL que vi en el día 06.

   **Fuente:** <https://node-postgres.com/features/pooling> · <https://node-postgres.com/features/queries> · <https://node-postgres.com/features/connecting>

5. **Autenticación con JWT: qué es, cómo se firma y verifica, dónde NO guardarlo.**

   Un JWT es un texto largo, llamado token, que el servidor le entrega al usuario cuando inicia sesión. El usuario lo envía en cada petición para demostrar quién es, sin tener que volver a escribir la contraseña. El token lleva algunos datos, como el id del usuario y su rol, y una firma que el servidor hace con una clave secreta que solo él conoce. Si alguien cambia algo del token, la firma deja de coincidir y el servidor lo rechaza; verificar el token es revisar que la firma siga coincidiendo. Los datos del token se pueden leer, así que nunca se guarda ahí una contraseña. Tampoco se debe guardar el token en el `localStorage` del navegador, porque cualquier código malicioso que corra en la página lo puede robar, ni ponerlo en la URL; lo más seguro es una cookie especial que JavaScript no puede leer.

   **Fuente:** <https://www.jwt.io/introduction> · <https://github.com/auth0/node-jsonwebtoken> · <https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html>

6. **Buenas prácticas: CORS, helmet, logs, paginación.**

   **CORS:** por seguridad, el navegador no deja que una página use una API que está en otra dirección, a menos que la API diga que esa página tiene permiso. Configurar CORS es decirle a la API qué páginas pueden usarla. **helmet:** es una librería que, con una sola línea, agrega a las respuestas unas instrucciones de seguridad para el navegador y oculta que la API está hecha con Express. **Logs:** son el registro de lo que pasa en la API, como qué petición llegó, cómo salió y cuánto tardó; sirven para encontrar errores, pero nunca se deben guardar ahí contraseñas ni tokens. **Paginación:** es devolver los datos por partes, por ejemplo de 20 en 20, en vez de mandar toda la tabla de una vez, para que la API no se vuelva lenta.

   **Fuente:** <https://developer.mozilla.org/es/docs/Web/HTTP/Guides/CORS> · <https://expressjs.com/en/resources/middleware/cors.html> · <https://expressjs.com/en/advanced/best-practice-security.html> · <https://learn.microsoft.com/es-es/azure/architecture/best-practices/api-design>

## Lo que aprendí hoy (3 cosas)

- A crear un servidor con Express y armar una API REST. Primero hice la ruta `/salud`, que responde si el servidor está funcionando. Después hice el CRUD de productos (consultar, crear, cambiar y borrar): primero guardando los productos en una lista en memoria, que se borra cada vez que se apaga el servidor, y después guardándolos en PostgreSQL con la librería `pg`. Cada respuesta usa el código de estado que corresponde: `201` al crear, `204` al borrar y `404` cuando el producto no existe.
- A organizar la API del proyecto integrador por capas: las rutas reciben la petición, los controladores revisan los datos con zod, los servicios tienen las reglas del negocio y los repositorios hacen las consultas SQL. Todos los errores llegan a un solo middleware, que siempre responde de la misma forma. Crear un pedido se hace dentro de una transacción: se guarda el pedido, se descuenta el stock y se guarda el detalle, y si un producto no tiene stock suficiente se hace ROLLBACK y no queda nada guardado. También hice la lista de pedidos con filtro por estado y paginación.
- A hacer el login con JWT. En la base no se guardan las contraseñas, se guarda su hash con bcrypt. Al iniciar sesión, la API revisa el correo y la contraseña y entrega un token firmado, que después se manda en cada petición en el encabezado `Authorization`. Las rutas protegidas revisan ese token, y algunas, como las de borrar, solo las puede usar un usuario con rol admin. También aprendí a probar la API con pruebas automáticas, que con `npm test` revisan todas las rutas en pocos segundos, y con una colección de Postman.

## Lo que no entendí o me costó

- Entender el camino que hace una petición por todas las capas y saber en qué archivo va cada cosa. Me costó ubicar las reglas: revisar que los datos lleguen completos y bien escritos va en el controlador, con zod, y revisar que haya stock va en el servicio, porque es una regla del negocio.
- Entender cómo funciona el token: los datos que lleva se pueden leer, pero no se pueden cambiar sin que la firma deje de coincidir. La API no guarda los tokens en ninguna parte; solo revisa la firma con la clave secreta del `.env` y la fecha en que vence.
- Hacer la transacción desde Node. Hay que pedirle una conexión al pool, hacer `BEGIN`, ejecutar todas las consultas con esa misma conexión, terminar con `COMMIT` o `ROLLBACK` y al final devolver la conexión al pool, haya error o no. Si una consulta usa otra conexión, queda por fuera de la transacción.

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
| --- | --- | --- |
| Los precios y el total de pedidos llegaban como texto (`"180000.00"`, `"12"`) y no como número | `pg` devuelve los tipos `NUMERIC` y `BIGINT` (el resultado de `COUNT`) como texto, para no perder precisión | Configuré `pg` para que convierta los `NUMERIC` en número (`setTypeParser`) y en la consulta usé `COUNT(*)::int` |
| Las fechas de los pedidos salían con hora (`2026-10-01T05:00:00.000Z`) | `pg` convierte las columnas `DATE` en una fecha con hora, y la hora depende de la zona horaria del computador | Configuré `pg` para que deje las fechas tal como están en la base (`2026-10-01`) |
| `Cannot set property query of #<IncomingMessage> which has only a getter` al validar los filtros de `GET /pedidos` | En Express 5, `req.query` no se puede reemplazar | Guardé los filtros ya validados en una variable aparte en vez de cambiar `req.query` |
| Los mensajes de error de zod salían en inglés | zod trae sus mensajes en inglés | Activé el idioma español de zod y le puse a cada regla un mensaje propio que dice qué corregir |

## Uso de IA hoy

- ¿La usé? Sí.
- ¿Para qué? Para responder la autoinvestigación con palabras sencillas, hacer los tres ejercicios y la API del reto, escribir las pruebas automáticas, los README y la colección de Postman, y entender los errores que salieron.
- ¿Qué aprendí de eso? Que las pruebas automáticas me dicen en pocos segundos si algo dejó de funcionar después de un cambio, y que los mensajes de error dicen qué pasó si los leo con calma. También, que tengo que correr la API yo mismo y probar cada ruta para entender cómo funciona por dentro.

## Autoevaluación del tema (1-5): 4

Entendí cómo se arma una API REST con Express, cómo se organiza por capas y cómo funciona el login con JWT, pero todavía necesito practicar para hacer una API así sin ayuda, sobre todo la transacción de los pedidos, el middleware que revisa el token y los esquemas de zod.
