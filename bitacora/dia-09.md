# Bitácora Día 09 · Docker

**Fecha:** 13-10-2026

**Horas invertidas:** 6 h (autoinvestigación 2 h · práctica 2 h · reto 3 h)

## Autoinvestigación básica

1. **Pregunta:** Contenedor vs máquina virtual.

   **Respuesta (con mis palabras):** Una **máquina virtual** es un computador completo creado por un programa dentro de mi computador, con su propio sistema operativo entero. Por eso ocupa mucha memoria y mucho disco, y se demora en prender. Un **contenedor** es un programa que corre aislado del resto, con sus propios archivos y librerías, pero que usa el núcleo del sistema operativo del computador en vez de traer uno propio. Por eso pesa poco, prende en segundos y se pueden tener muchos al mismo tiempo. En Windows, Docker Desktop corre los contenedores dentro de un Linux pequeño que da WSL 2, que fue lo que tuve que instalar en el día 05.

   **Fuente:** <https://www.docker.com/resources/what-container/> · <https://learn.microsoft.com/es-es/virtualization/windowscontainers/about/containers-vs-vm>

2. **Pregunta:** Imagen, contenedor, capa, registro (Docker Hub).

   **Respuesta (con mis palabras):** Una **imagen** es un paquete que tiene todo lo que un programa necesita para funcionar: el programa, sus librerías y su configuración. La imagen no cambia: es la base para crear contenedores. Un **contenedor** es una imagen que está corriendo. De una misma imagen se pueden crear varios contenedores, y cada uno guarda sus propios datos. Una **capa** es cada parte con la que se arma una imagen: cada paso que se hace al construirla deja una capa, y Docker guarda cada capa por separado para no descargarla ni construirla otra vez si ya la tiene. Un **registro** es un sitio en internet donde se guardan y se comparten imágenes. **Docker Hub** es el registro principal; de ahí salen las imágenes oficiales, como las de PostgreSQL, SQL Server y Node.js.

   **Fuente:** <https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/> · <https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/> · <https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-registry/>

3. **Pregunta:** Comandos: run, ps, logs, exec, stop, rm, images, rmi, pull, build.

   **Respuesta (con mis palabras):** `docker run` crea un contenedor a partir de una imagen y lo prende. `docker ps` muestra los contenedores que están prendidos, y con `-a` también los apagados. `docker logs` muestra los mensajes que ha escrito un contenedor, y sirve para ver si arrancó bien o qué error tuvo. `docker exec` ejecuta un comando dentro de un contenedor que ya está prendido. `docker stop` apaga un contenedor sin borrarlo, y se puede volver a prender con `docker start`. `docker rm` borra un contenedor que ya está apagado. `docker images` muestra las imágenes que tengo descargadas en mi computador. `docker rmi` borra una imagen, si ningún contenedor la está usando. `docker pull` descarga una imagen de un registro, como Docker Hub, sin crear ningún contenedor. `docker build` construye una imagen nueva a partir de un Dockerfile.

   **Fuente:** <https://docs.docker.com/reference/cli/docker/> · <https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/>

4. **Pregunta:** Puertos, variables de entorno y volúmenes.

   **Respuesta (con mis palabras):** Un contenedor tiene su propia red, así que desde mi computador no se puede entrar a él si no se publica un **puerto**. Publicar un puerto es conectar un puerto de mi computador con un puerto del contenedor; así hice con el 5432 de `pg-induccion` para que DBeaver se pudiera conectar. Las **variables de entorno** son datos de configuración que se le pasan al contenedor cuando se crea, como la contraseña de PostgreSQL, sin tener que cambiar la imagen. Un **volumen** es un espacio para guardar datos por fuera del contenedor. Si se borra un contenedor, se borran los datos que tenía adentro; si esos datos están en un volumen, se quedan guardados, y un contenedor nuevo los puede volver a usar.

   **Fuente:** <https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/> · <https://docs.docker.com/get-started/docker-concepts/running-containers/overriding-container-defaults/> · <https://docs.docker.com/get-started/docker-concepts/running-containers/persisting-container-data/>

5. **Pregunta:** ¿Qué es Docker Compose?

   **Respuesta (con mis palabras):** Docker Compose es una herramienta de Docker para prender varios contenedores que trabajan juntos, por ejemplo una API y su base de datos. En vez de escribir un comando largo por cada contenedor, todo se describe en un archivo llamado `compose.yaml`: qué imagen usa cada uno, sus puertos, sus variables de entorno y sus volúmenes. Con `docker compose up` se prenden todos los contenedores del archivo, y con `docker compose down` se apagan y se borran. En la API del proyecto ya tengo un `compose.yaml`, que prende la API en el puerto 3001.

   **Fuente:** <https://docs.docker.com/compose/> · <https://docs.docker.com/get-started/docker-concepts/running-containers/multi-container-applications/>

## Autoinvestigación avanzada

1. **Dockerfile: FROM, WORKDIR, COPY, RUN, CMD vs ENTRYPOINT, EXPOSE, ENV, ARG.**

   Un Dockerfile es un archivo de texto con los pasos para construir una imagen, en orden. `FROM` dice de qué imagen se parte, por ejemplo `node:24-alpine`. `WORKDIR` escoge la carpeta de trabajo dentro de la imagen; los pasos siguientes se hacen ahí. `COPY` copia archivos de mi computador a la imagen. `RUN` ejecuta un comando mientras se construye la imagen, por ejemplo para instalar las librerías con `npm ci`. `CMD` es el comando que corre cuando se prende el contenedor, y se puede cambiar escribiendo otro comando al final de `docker run`. `ENTRYPOINT` fija el programa que siempre corre al prender el contenedor; si también hay `CMD`, lo que dice el `CMD` se le pasa como argumentos. `EXPOSE` anota en qué puerto escucha el programa, pero no publica el puerto: eso se hace con `-p` o en el `compose.yaml`. `ENV` crea una variable de entorno que queda en la imagen y en los contenedores. `ARG` crea una variable que solo existe mientras se construye la imagen. El Dockerfile de la API del proyecto usa `FROM`, `WORKDIR`, `COPY`, `RUN`, `EXPOSE` y `CMD`.

   **Fuente:** <https://docs.docker.com/reference/dockerfile/>

2. **Caché de capas y orden de instrucciones; .dockerignore.**

   Cada instrucción del Dockerfile crea una capa. Cuando se vuelve a construir la imagen, Docker reutiliza las capas que no cambiaron, y eso hace que la construcción sea mucho más rápida. Pero si una capa cambia, Docker tiene que rehacer esa y todas las que vienen después. Por eso importa el orden: lo que casi no cambia va primero y lo que cambia seguido va al final. En la API del proyecto primero se copian `package.json` y `package-lock.json` y se instalan las librerías, y después se copia el código; así, si solo cambio el código, Docker no vuelve a instalar las librerías. El archivo **.dockerignore** dice qué archivos no se mandan a Docker al construir la imagen, como `node_modules` y el `.env`. Así la construcción es más rápida y las contraseñas no quedan guardadas dentro de la imagen.

   **Fuente:** <https://docs.docker.com/build/cache/> · <https://docs.docker.com/build/concepts/context/>

3. **Builds multi-stage.**

   Un build multi-stage es un Dockerfile con varias etapas, cada una con su propio `FROM`. En las primeras etapas se usan las herramientas que solo hacen falta para construir el programa, como las que compilan el código o instalan todas las librerías. En la última etapa se parte de una imagen limpia y se copia solo lo necesario para correr el programa, con `COPY --from=` y el nombre de la etapa. Así la imagen final queda más pequeña, porque no lleva las herramientas de construcción, y tiene menos cosas que se puedan usar para atacarla.

   **Fuente:** <https://docs.docker.com/build/building/multi-stage/>

4. **Redes en Docker y cómo se ven los servicios entre sí por nombre.**

   Docker conecta los contenedores a redes. Los contenedores que están en la misma red se pueden comunicar entre ellos, y los que están en redes distintas no se ven. Docker Compose crea una red para cada proyecto y conecta ahí todos sus servicios. Dentro de esa red, cada contenedor encuentra a los demás por el nombre del servicio: si la base de datos se llama `db` en el `compose.yaml`, la API se conecta a ella con `PGHOST=db`, sin saber su dirección IP. En la red que Docker trae por defecto los nombres no funcionan; solo funcionan en las redes que crea Compose o que crea uno mismo. Por eso la API del proyecto en Docker llega a `pg-induccion` con `host.docker.internal`: ese contenedor no está en la misma red que la API.

   **Fuente:** <https://docs.docker.com/engine/network/> · <https://docs.docker.com/compose/how-tos/networking/>

5. **healthcheck y depends_on con condición.**

   Un **healthcheck** es un comando que Docker ejecuta cada cierto tiempo dentro de un contenedor para saber si el programa de adentro está funcionando de verdad, y no solo prendido. Si el comando sale bien, el contenedor queda en estado `healthy`; si falla varias veces seguidas, queda `unhealthy`. Para PostgreSQL se usa el comando `pg_isready`, que revisa si la base ya acepta conexiones. **depends_on** se pone en el `compose.yaml` y dice qué servicio debe arrancar antes que otro. Solo con `depends_on`, Compose espera a que el otro contenedor prenda, pero no a que esté listo. Con la condición `service_healthy`, espera a que el healthcheck del otro servicio salga bien. Así la API no arranca antes de que PostgreSQL pueda recibir conexiones.

   **Fuente:** <https://docs.docker.com/reference/dockerfile/#healthcheck> · <https://docs.docker.com/compose/how-tos/startup-order/>

6. **Seguridad: no correr como root, no meter secretos en la imagen, imágenes pequeñas (alpine/slim).**

   **No correr como root:** root es el usuario administrador, que puede hacer cualquier cosa dentro del contenedor. Si alguien encuentra una falla en el programa y lo controla, tendría todos esos permisos. Por eso en el Dockerfile se cambia a un usuario sin permisos de administrador con la instrucción `USER`; las imágenes de Node ya traen uno llamado `node`, y es el que usa la API del proyecto. **No meter secretos en la imagen:** las contraseñas, tokens y claves no se copian a la imagen ni se escriben con `ENV` o `ARG` en el Dockerfile, porque cualquiera que tenga la imagen puede leerlos, aunque después se borren en otra capa. Los secretos se pasan cuando se prende el contenedor, como variables de entorno o desde un archivo `.env`, y el `.env` va en el `.dockerignore`. **Imágenes pequeñas:** las versiones `alpine` y `slim` traen solo lo mínimo para correr el programa. Así la imagen pesa menos, se descarga más rápido y tiene menos programas que puedan tener fallas de seguridad. La API del proyecto usa `node:24-alpine`.

   **Fuente:** <https://docs.docker.com/build/building/best-practices/> · <https://docs.docker.com/build/building/secrets/> · <https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html>

## Lo que aprendí hoy (3 cosas)

- A usar Docker desde la terminal con nginx: descargar una imagen, crear un contenedor publicando un puerto, ver sus logs, entrar a él con `docker exec` y borrar el contenedor y la imagen. Vi que un cambio hecho adentro del contenedor se pierde cuando se borra, si no está guardado en un volumen.
- A escribir un Dockerfile para la API del proyecto, construir la imagen con `docker build` y correrla con `docker run`, pasándole las variables con `--env-file`. Después lo mejoré con dos etapas (multi-stage), el usuario `node` en vez de root y un healthcheck que revisa `/salud`, y comparé el tamaño de las dos imágenes con `docker images`.
- A prender todo el proyecto con Docker Compose: PostgreSQL con un volumen y los scripts que crean las tablas y cargan los datos, la API, SQL Server y Adminer. La API se conecta a la base por el nombre del servicio, `postgres`, y espera a que su healthcheck salga bien antes de arrancar. Con todo prendido, probé la colección de Postman contra el entorno `docker`.

## Lo que no entendí o me costó

- Entender que dentro de un contenedor `localhost` es el mismo contenedor y no mi computador. Por eso, para llegar a la base, la API usa `host.docker.internal` cuando la base está en mi computador, o el nombre del servicio cuando las dos están en el mismo Docker Compose.
- Los puertos: un puerto del computador no lo pueden usar dos contenedores al mismo tiempo. Por eso el PostgreSQL del proyecto queda en el 5433 y el SQL Server en el 1434, porque el 5432 y el 1433 ya los usan los contenedores del día 05.
- Que los scripts de inicialización de PostgreSQL solo se ejecutan la primera vez, cuando el volumen está vacío. Para volver a cargarlos hay que borrar el volumen con `docker compose down -v`, y con eso se pierden los datos.

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
| --- | --- | --- |
| `docker build` falló en `RUN npm install` con `npm error enoent Could not read package.json` | Creé la rama `feature/docker` desde `main`, donde `proyecto/api` no tiene el código de la API, solo `node_modules` y el `.env`. El `git checkout feature/postman` no había funcionado, porque el checklist del día 08 que marqué estaba sin seguimiento en `main` y Git no quería sobrescribirlo | Moví el checklist por fuera del repo, borré la rama, la volví a crear desde `feature/postman` y devolví el checklist a su carpeta |
| `docker run` respondió `pull access denied for api, repository does not exist` | Como el `docker build` falló, la imagen `api:intermedio` no existía, y Docker la intentó descargar de Docker Hub | Volví a construir la imagen en la rama correcta antes de correr el contenedor |

## Uso de IA hoy

- ¿La usé? Sí.
- ¿Para qué? Para responder la autoinvestigación con palabras sencillas, armar los dos Dockerfiles de la API y el `docker-compose.yml` del proyecto, y entender cada comando de Docker y los errores que salieron.
- ¿Qué aprendí de eso? Que cuando un contenedor no arranca o se apaga solo, lo primero es mirar sus logs con `docker logs` o `docker compose logs`, porque ahí dice qué pasó.

## Autoevaluación del tema (1-5): 4
