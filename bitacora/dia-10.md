# Bitácora Día 10 · Integrador backend + Evaluación Semana 2

**Fecha:** 14-10-2026

**Horas invertidas:** 8 h

## Qué hicimos hoy

Hoy cerramos la semana 2: terminé y pulí el proyecto integrador backend, lo revisamos en parejas y presenté la evaluación práctica.

- En la daily conté qué hice ayer, qué iba a hacer hoy y si tenía algún bloqueo.
- Prendí el proyecto completo en Docker con `docker compose up -d`: la API, PostgreSQL, SQL Server y Adminer. Revisé que los contenedores quedaran `healthy` y vi las cinco tablas de la base `proyecto` en Adminer.
- Corrí la colección de Postman contra el entorno `docker` con `npm run test:api:docker`. Pasaron las 135 pruebas y quedó guardado el reporte `reporte-docker.html`.
- Pulí los README del repositorio, del proyecto y de la API, para que cualquier persona pueda prender el proyecto siguiendo solo esos pasos.
- En la revisión de código en parejas revisamos el proyecto con un compañero: que prenda con el README, que no haya contraseñas en el repositorio, los códigos de estado, el SQL con parámetros, los roles, el manejo de errores, la transacción de los pedidos y las pruebas.
- Presenté la evaluación práctica de la semana 2.
- En la sustentación expliqué el proyecto en 10 minutos: qué hace, cómo están conectados los contenedores, una demostración en Postman, el código de `POST /pedidos` y las pruebas.
- En el teach-back le expliqué a un compañero el tema de la semana que me asignó el mentor.
- En la retro hablamos de lo que salió bien en la semana y de lo que hay que mejorar.

## Cómo quedó el proyecto

El proyecto es una API REST de una tienda. Maneja clientes, productos y pedidos, y tiene login con JWT y roles: solo el administrador puede borrar. Los pedidos se crean dentro de una transacción que descuenta el stock, y si un producto no alcanza, no se guarda nada. Los pedidos se pueden filtrar por estado y ver por páginas.

Los datos se guardan en PostgreSQL. La API tiene 29 pruebas automáticas y una colección de Postman con 135 pruebas de casos felices y de error. Todo se prende en Docker con un solo comando, y la colección pasa completa contra la API del contenedor.

## Lo que aprendí hoy (3 cosas)

- Que un proyecto está terminado cuando otra persona lo puede prender siguiendo solo el README. Por eso pulí los README: el de la raíz explica las carpetas y las ramas, y el del proyecto empieza con un inicio rápido y una lista para comprobar que todo funciona.
- A prender el proyecto completo con un solo comando y a comprobar que funciona: `docker compose ps` muestra si los contenedores están `healthy`, Adminer muestra las tablas y los datos, y Newman corre la colección contra la API del contenedor y guarda un reporte HTML.
- A explicar el proyecto por pedazos: qué hace, cómo están conectados los contenedores, el camino de una petición por las capas de la API y cómo se prueba. Explicarlo en voz alta, en la sustentación y en el teach-back, me ayudó a entender mejor cada cosa.

## Lo que no entendí o me costó

- Saber dónde quedan los reportes de Newman: en la terminal solo sale el resumen, y el reporte completo se guarda como `reporte-docker.html` en la carpeta `proyecto/postman`, para abrirlo en el navegador.
- Entender de dónde sale el nombre de la base `proyecto`: en Docker lo pone `POSTGRES_DB` en el `docker-compose.yml`, y la API sabe a qué base conectarse por `PGDATABASE`.
- Manejar las ramas: las del proyecto salen una de la otra (`feature/node-express`, `feature/postman` y `feature/docker`), y las bitácoras van en `main`. Tuve que pasar la bitácora del día 09 a `main`.

## Errores que tuve y cómo los resolví

- La bitácora del día 09 quedó en la rama `feature/docker` y no en `main`, porque hice el commit estando en esa rama. Lo resolví trayendo el archivo a `main` con `git checkout feature/docker -- bitacora/dia-09.md` y haciendo el commit ahí.
- Después de `npm install`, el archivo `package-lock.json` salió como modificado, pero npm solo le había cambiado los saltos de línea. Lo dejé como estaba con `git restore proyecto/postman/package-lock.json`.
- No encontraba el reporte de Newman, porque en la terminal solo salía el resumen. El reporte se guarda como un archivo y Newman no lo abre solo; lo abrí desde la terminal con `start reporte-docker.html`.

## Uso de IA hoy

- ¿La usé? Sí.
- ¿Para qué? Para pulir los README del proyecto, armar una guía con el funcionamiento de todo el proyecto, el guion de la sustentación y la lista para la revisión en parejas, y para resolver dudas sobre los reportes de Newman, el nombre de la base y las ramas.
- ¿Qué aprendí de eso? Que explicar el proyecto con mis palabras, sin leer el código, es la mejor forma de saber si de verdad lo entiendo.

## Autoevaluación del tema (1-5): 4

Terminé el proyecto integrador con todo funcionando en Docker y las 135 pruebas pasando. Todavía necesito practicar para escribir sin ayuda la transacción de los pedidos y el `docker-compose.yml`.
