# Bitácora Día 08 · Postman: pruebas de APIs

**Fecha:** 09-10-2026

**Horas invertidas:** 7 h (autoinvestigación 2 h · práctica 2 h · reto 3 h)

## Autoinvestigación básica

1. **Pregunta:** Anatomía de una petición HTTP: método, URL, headers, query params, body.

   **Respuesta (con mis palabras):** Una petición HTTP es el mensaje que se le manda a una API para pedirle algo, y tiene varias partes. El **método** dice qué se quiere hacer: `GET` para consultar, `POST` para crear, `PUT` o `PATCH` para cambiar y `DELETE` para borrar. La **URL** es la dirección a la que va la petición, y dice en qué servidor está la API y a qué recurso se quiere llegar. Los **headers** (encabezados) son datos extra sobre la petición, cada uno con un nombre y un valor; por ejemplo, el tipo de datos que se manda o el token para demostrar quién soy. Los **query params** son valores que van al final de la URL, después de un `?`, separados por `&`, y se usan sobre todo para filtrar o paginar. El **body** (cuerpo) es la información que se manda, normalmente en formato JSON; se usa al crear o cambiar datos, y en un `GET` no se manda.

   **Fuente:** <https://developer.mozilla.org/es/docs/Web/HTTP/Guides/Messages> · <https://developer.mozilla.org/es/docs/Web/HTTP/Guides/Overview>

2. **Pregunta:** Colecciones, carpetas y entornos en Postman.

   **Respuesta (con mis palabras):** Postman es un programa para enviar peticiones a una API y ver lo que responde, sin tener que hacer una página web. Una **colección** es un grupo de peticiones guardadas que pertenecen a la misma API, para no tener que escribirlas otra vez cada vez que quiero probar algo. Dentro de una colección se pueden crear **carpetas** para ordenar las peticiones por tema, por ejemplo una carpeta para productos y otra para pedidos. Una colección se puede exportar como un archivo JSON y compartir con otras personas. Un **entorno** es un grupo de variables con los datos que cambian según dónde está corriendo la API, como la dirección del servidor. Se pueden tener varios entornos, por ejemplo uno para mi computador y otro para el servidor de pruebas, y cambiar de uno a otro con el selector de entornos, sin cambiar las peticiones.

   **Fuente:** <https://learning.postman.com/docs/use/use-collections/overview> · <https://learning.postman.com/docs/use/send-requests/variables/managing-environments>

3. **Pregunta:** Variables (globales, de colección, de entorno) y su prioridad.

   **Respuesta (con mis palabras):** Una variable en Postman es un nombre que guarda un valor, para escribirlo una sola vez y usarlo en muchas peticiones. Se usa escribiendo su nombre entre dos llaves dobles, por ejemplo `{{base}}`, y Postman lo cambia por el valor antes de enviar la petición. Hay tres tipos principales. Las **globales** sirven en todo Postman, en cualquier colección. Las **de colección** solo sirven dentro de la colección donde se crearon. Las **de entorno** solo sirven cuando ese entorno está seleccionado. Si hay dos variables con el mismo nombre, Postman usa la que tiene el alcance más pequeño: primero la de entorno, después la de colección y por último la global.

   **Fuente:** <https://learning.postman.com/docs/sending-requests/variables/variables/>

4. **Pregunta:** Tipos de autenticación: API Key, Bearer Token, Basic, OAuth 2.0.

   **Respuesta (con mis palabras):** La autenticación es la forma en que la API sabe quién está haciendo la petición. Con **API Key** se manda una clave fija que la API le entregó a quien la va a usar; va en un header o en la URL, y casi no cambia. Con **Bearer Token** se manda un token en el header `Authorization`, después de la palabra `Bearer`; ese token se consigue al iniciar sesión, como el JWT del día 07, y vence después de un tiempo. Con **Basic** se mandan el usuario y la contraseña en cada petición, en el header `Authorization`; van codificados, pero no cifrados, así que solo se debe usar con HTTPS. Con **OAuth 2.0**, el usuario inicia sesión en un servidor aparte, que le pregunta si le da permiso a la aplicación; si acepta, ese servidor le entrega un token a la aplicación, y la aplicación nunca ve la contraseña del usuario. Postman tiene una pestaña de autorización donde se escoge el tipo y se llenan los datos, y Postman arma el header solo.

   **Fuente:** <https://learning.postman.com/docs/use/send-requests/authorization/authorization-types> · <https://developer.mozilla.org/es/docs/Web/HTTP/Guides/Authentication>

5. **Pregunta:** Alternativas: Bruno, Insomnia, Thunder Client y curl.

   **Respuesta (con mis palabras):** Son otras herramientas que también sirven para enviar peticiones a una API. **Bruno** es un programa gratuito y de código abierto que guarda las colecciones como archivos de texto dentro de la carpeta del proyecto, así que se pueden subir a Git; no necesita cuenta ni internet. **Insomnia** es un programa de escritorio para enviar peticiones y organizarlas en colecciones, con variables y entornos. **Thunder Client** es una extensión de VS Code, así que las peticiones se hacen sin salir del editor. **curl** es un comando que se escribe en la terminal; no tiene ventanas ni botones, pero viene instalado en Windows y sirve para probar una ruta rápido o dentro de un script.

   **Fuente:** <https://docs.usebruno.com/> · <https://docs.insomnia.rest/> · <https://docs.thunderclient.com/> · <https://curl.se/docs/manpage.html>

## Autoinvestigación avanzada

1. **Scripts pre-request y post-response (tests) con pm.test y pm.expect.**

   Un script es un pedazo de código JavaScript que Postman ejecuta solo en una petición. El **pre-request** se ejecuta antes de enviar la petición y sirve para preparar datos, como crear un valor y guardarlo en una variable. El **post-response** se ejecuta cuando llega la respuesta y sirve para revisarla: ahí van los tests. `pm.test` crea una prueba con un nombre, y `pm.expect` revisa que un valor sea el esperado, por ejemplo que el código de estado sea `200` o que la respuesta traiga un campo. El resultado de cada prueba aparece en la pestaña **Test Results**, en verde si pasó y en rojo si falló.

   **Fuente:** <https://learning.postman.com/docs/tests-and-scripts/write-scripts/intro-to-scripts> · <https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-examples>

2. **Guardar el token del login automáticamente en una variable.**

   En el script post-response de la petición de login se lee el token que llega en la respuesta y se guarda en una variable de la colección o del entorno, con `pm.collectionVariables.set` o `pm.environment.set`. Después, en la pestaña de autorización de la colección se escoge **Bearer Token** y se pone esa variable, `{{token}}`. Así, cada vez que hago login el token nuevo queda guardado solo, y todas las peticiones lo usan sin tener que copiarlo y pegarlo. Así funciona la colección de Postman de la API del proyecto (`proyecto/api/postman`).

   **Fuente:** <https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-examples> · <https://learning.postman.com/docs/sending-requests/variables/variables/>

3. **Collection Runner y ejecuciones con archivos de datos (CSV/JSON).**

   El **Collection Runner** ejecuta todas las peticiones de una colección o de una carpeta, una detrás de otra y en orden, y al final muestra cuántas pruebas pasaron y cuántas fallaron. Se puede escoger cuántas veces repetir la colección; cada repetición se llama iteración. Con un **archivo de datos**, que puede ser un CSV o un JSON, cada fila es una iteración, y cada columna se vuelve una variable que se usa en las peticiones con `{{nombre_de_la_columna}}`. Sirve para probar la misma petición con muchos datos distintos sin escribirla varias veces, por ejemplo varios correos y contraseñas en el login.

   **Fuente:** <https://learning.postman.com/docs/tests-and-scripts/running-collections/intro-to-collection-runs> · <https://learning.postman.com/docs/tests-and-scripts/running-collections/test-data/working-with-data-files>

4. **Newman (ejecutar colecciones desde consola y en CI) y reportes HTML.**

   Newman es un programa que ejecuta una colección de Postman desde la terminal, sin abrir Postman. Se instala con npm, se exporta la colección como archivo JSON y se ejecuta con `newman run` y el nombre del archivo; muestra cada petición y cada prueba, y al final un resumen. Como corre en la terminal, se puede usar en **CI** (integración continua), que es cuando las pruebas se ejecutan solas en un servidor, por ejemplo cada vez que alguien sube cambios a GitHub; si una prueba falla, se ve el error antes de unir los cambios. Los resultados se pueden guardar como un **reporte HTML**, que es una página web con el resumen de las pruebas, usando el reportero `htmlextra`.

   **Fuente:** <https://learning.postman.com/docs/reference/newman-cli/command-line-integration-with-newman> · <https://github.com/DannyDainton/newman-reporter-htmlextra>

5. **Mock servers y documentación publicada.**

   Un **mock server** es un servidor falso que crea Postman y que responde con respuestas de ejemplo guardadas en la colección. Sirve para que el frontend pueda empezar a trabajar y probar sus pantallas aunque la API de verdad todavía no esté lista. La **documentación publicada** es una página web que Postman arma a partir de la colección, con cada petición, su descripción, los datos que necesita y ejemplos de respuesta. Se puede publicar con un enlace para que otras personas sepan cómo usar la API sin tener que preguntar.

   **Fuente:** <https://learning.postman.com/docs/design-apis/mock-apis/overview> · <https://learning.postman.com/docs/publishing-your-api/documenting-your-api>

## Lo que aprendí hoy (3 cosas)

- A probar una API a mano con Postman: armar cada petición con su método, la URL, el cuerpo en JSON y el token en la pestaña **Authorization**, enviarla y revisar el código de estado y lo que responde. Probé todos los endpoints del día 07, los de los tres ejercicios y los de la API del proyecto, y los fui guardando en una colección.
- A usar entornos y variables. Tengo un entorno `local`, con la API de `npm run dev` en el puerto 3000, y otro `docker`, con la API corriendo en un contenedor en el puerto 3001. Las peticiones usan `{{base_url}}`, así que con solo cambiar el entorno pruebo la otra API. El login guarda el token solo en el entorno, y todas las peticiones lo usan sin copiarlo.
- A escribir pruebas en Postman con `pm.test` y `pm.expect`, que revisan el código de estado y los campos de cada respuesta, y a correr toda la colección con el Collection Runner. También a crear productos en lote con un archivo CSV, donde cada fila es una vuelta, y a correr las colecciones desde la terminal con Newman, que genera un reporte HTML con el resultado. En el reto armé la colección completa del proyecto, con casos felices y de error (400, 401, 403, 404 y 409), y mandé los tres endpoints principales con curl desde PowerShell.

## Lo que no entendí o me costó

- Entender que el servidor se prende en la terminal y las peticiones se mandan desde Postman, y que todos los ejercicios usan el puerto 3000, así que hay que apagar uno con `Ctrl + C` antes de prender otro.
- Saber qué número poner en las peticiones que usan un id, como cambiar o borrar un producto: hay que usar el id que devuelve la respuesta al crearlo, porque ese número lo pone la base de datos.
- Entender la prioridad de las variables y en qué lugar se guarda cada una: el token y la dirección de la API van en el entorno, y los ids que se crean durante la prueba van en la colección.

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
| --- | --- | --- |

## Uso de IA hoy

- ¿La usé? Sí.
- ¿Para qué? Para responder la autoinvestigación con palabras sencillas, armar la lista de pruebas manuales, las colecciones con pruebas, los entornos `local` y `docker`, el archivo CSV, los comandos de Newman y el reto (la colección completa, `npm run test:api` y `curl.md`), y para entender cómo prender cada servidor y probarlo en Postman.
- ¿Qué aprendí de eso? Que probar a mano me ayuda a entender cada parte de una petición, y que después las pruebas automáticas de la colección revisan todo en segundos cada vez que cambio algo.

## Autoevaluación del tema (1-5): 4
