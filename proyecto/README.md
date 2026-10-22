# Proyecto integrador

Una tienda con clientes, productos, pedidos con su detalle y login con JWT. Tiene una API REST que guarda los datos en PostgreSQL, una colección de Postman de 135 pruebas y una página web para manejar los pedidos, hecha dos veces: en React y en Vue. Todo se prende en Docker con un solo comando. Además, la parte 6 configura Zoho CRM y lo usa por API, y la parte 7 conecta todo: cada pedido nuevo pasa por n8n a Zoho CRM, y un bot de Python arma el reporte diario en Excel leyendo la página.

## Inicio rápido

Con Docker Desktop prendido, en la terminal de VS Code, parado en esta carpeta (`proyecto`):

1. Crear el `.env` y llenar los cinco valores vacíos (`POSTGRES_PASSWORD`, `JWT_SECRET`, `MSSQL_SA_PASSWORD`, `N8N_ENCRYPTION_KEY` y `N8N_WEBHOOK_SECRET`; las reglas de cada uno están más abajo, en "Cómo prenderlo"):

   ```powershell
   Copy-Item .env.example .env
   code .env
   ```

2. Prender todo:

   ```powershell
   docker compose up -d
   ```

   La página en React queda en <http://localhost:8080>, la de Vue en <http://localhost:8082>, la API en <http://localhost:3001>, n8n en <http://localhost:5678> y Mailpit en <http://localhost:8025>.

3. Correr la colección de Postman contra la API de Docker:

   ```powershell
   cd postman
   npm install
   npm run test:api:docker
   ```

## Comprobar que todo funciona

- [ ] `docker compose ps` muestra los ocho contenedores `Up`, y `postgres`, `api` y `sqlserver` dicen `(healthy)`.
- [ ] <http://localhost:3001/salud> responde `{"estado":"ok",...}`.
- [ ] `npm run test:api:docker` termina con 135 pruebas y 0 fallidas, y deja `postman/reporte-docker.html`.
- [ ] Adminer, en <http://localhost:8081>, muestra las seis tablas de la base `proyecto`, con `log_integraciones` (parte 7).
- [ ] <http://localhost:8080> muestra el login y, al entrar con `vendedor@cielum.test` / `Vendedor2026*`, salen los pedidos.
- [ ] <http://localhost:8082> hace lo mismo con la página en Vue.
- [ ] <http://localhost:5678> muestra n8n y <http://localhost:8025> muestra Mailpit.
- [ ] Al crear un pedido, el workflow **Pedido a Zoho CRM** lo pasa a Zoho y llega un correo a Mailpit (ver [`n8n/README.md`](n8n/README.md)).

## Qué hay en esta carpeta

| Carpeta o archivo | Qué es |
|---|---|
| `api/` | La API REST: clientes, productos, pedidos y login con JWT (parte 1) |
| `postman/` | La colección completa de Postman, los entornos, Newman y curl (parte 2) |
| `docker-compose.yml` | Todo el proyecto corriendo en Docker (partes 3, 4, 5 y 7) |
| `frontend-react/` | La página web en React: login, pedidos con filtros y paginación, crear pedidos y cambiarles el estado (parte 4) |
| `frontend-vue/` | La misma página web hecha en Vue, con las mismas funciones (parte 5) |
| `zoho/` | Zoho CRM: la configuración con sus capturas, la colección de Postman zoho-crm y una función de Deluge (parte 6). Ver [`zoho/README.md`](zoho/README.md) |
| `n8n/` | El workflow de n8n que pasa cada pedido nuevo a Zoho CRM, lo registra en `log_integraciones` y avisa por correo (parte 7). Ver [`n8n/README.md`](n8n/README.md) |
| `rpa/` | El bot de Python que entra a la página de React y arma el reporte diario de pedidos en Excel (parte 7). Ver [`rpa/README.md`](rpa/README.md) |
| `.env.example` | Plantilla de las variables que usa `docker-compose.yml` |

La comparación entre la página en React y la página en Vue está en [`../docs/react-vs-vue.md`](../docs/react-vs-vue.md).

## Todo el proyecto en Docker (partes 3, 4, 5 y 7)

`docker-compose.yml` prende ocho contenedores que trabajan juntos:

| Servicio | Contenedor | En el computador | Qué hace |
|---|---|---|---|
| `frontend` | `proyecto-frontend` | <http://localhost:8080> | La página en React, construida con `frontend-react/Dockerfile`. nginx muestra la página y le pasa al servicio `api` las peticiones que llegan a `/api` |
| `frontend-vue` | `proyecto-frontend-vue` | <http://localhost:8082> | La misma página hecha en Vue, construida con `frontend-vue/Dockerfile`. Funciona igual: nginx muestra la página y pasa las peticiones de `/api` al servicio `api` |
| `api` | `proyecto-api` | <http://localhost:3001> | La API del proyecto, construida con `api/Dockerfile`. Se conecta a `postgres` por el nombre del servicio |
| `postgres` | `proyecto-postgres` | `localhost:5433` | PostgreSQL 16 con la base `proyecto`. Guarda los datos en el volumen `datos-postgres` y, la primera vez, ejecuta los scripts de `api/db` para crear las tablas y cargar los datos de ejemplo |
| `sqlserver` | `proyecto-sqlserver` | `localhost:1434` | SQL Server 2022, con sus datos en el volumen `datos-sqlserver` |
| `adminer` | `proyecto-adminer` | <http://localhost:8081> | Una página web para ver y consultar la base de PostgreSQL |
| `n8n` | `proyecto-n8n` | <http://localhost:5678> | n8n, con los workflows de la parte 7. Guarda los workflows, las credenciales cifradas y las ejecuciones en el volumen `datos-n8n`, y comparte la carpeta `n8n/archivos` |
| `mailpit` | `proyecto-mailpit` | <http://localhost:8025> | Servidor de correo de pruebas: recibe los correos que manda n8n y los muestra en una página, sin enviarlos a internet |

Los puertos son 5433 y 1434 porque el 5432 y el 1433 ya los usan `pg-induccion` y el SQL Server del día 05. La API queda en el 3001, que es el que usa el entorno `docker` de Postman. La página en React queda en el 8080 y la de Vue en el 8082, porque el 8081 ya lo usa Adminer.

El orden en que prenden: primero `postgres`; cuando está `healthy`, la `api` y `n8n` (que también espera a `mailpit`); y cuando la `api` está `healthy`, el `frontend` y el `frontend-vue`.

Cuando se crea un pedido, la API le avisa a n8n en `http://n8n:5678/webhook/pedido-creado`: dentro de la red de Compose, cada servicio encuentra a los otros por su nombre.

### Cómo prenderlo

Los comandos van en la terminal de VS Code, con Docker Desktop prendido.

1. Si está prendida la API de Docker del día 08, apagarla, porque también usa el puerto 3001:

   ```powershell
   cd proyecto/api
   docker compose down
   cd ..
   ```

2. Parado en la carpeta `proyecto`, crear el `.env`:

   ```powershell
   Copy-Item .env.example .env
   code .env
   ```

   Llenar los cinco valores vacíos:
   - `POSTGRES_PASSWORD`: la contraseña de la base nueva. Es una base aparte de `pg-induccion`, así que se puede escoger cualquiera.
   - `JWT_SECRET`: un texto de mínimo 16 caracteres. Se puede generar uno con `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
   - `MSSQL_SA_PASSWORD`: mínimo 8 caracteres, mezclando mayúsculas, minúsculas, números y símbolos. Si no cumple, SQL Server no arranca.
   - `N8N_ENCRYPTION_KEY`: la llave con la que n8n cifra las credenciales. Se genera con el mismo comando del `JWT_SECRET` y no se cambia después.
   - `N8N_WEBHOOK_SECRET`: el secreto que la API le manda a n8n en cada aviso. Otro texto generado con el mismo comando.

   El `.env` no se sube a GitHub, porque está en el `.gitignore`.

3. Prender todo:

   ```powershell
   docker compose up -d
   ```

   La primera vez se demora más, porque construye las imágenes de la API y de los dos frontends, y descarga las de PostgreSQL, SQL Server, Adminer, Node, nginx, n8n y Mailpit. Si los otros contenedores ya estaban prendidos, este mismo comando prende solo los que faltan, por ejemplo `n8n` y `mailpit`. Si cambió el código de la API, como en la parte 7, se usa `docker compose up -d --build`.

4. Revisar que todo esté funcionando:

   ```powershell
   docker compose ps
   ```

   Los ocho contenedores deben salir `Up`, y `postgres`, `api` y `sqlserver` deben decir `(healthy)`. SQL Server puede tardar cerca de un minuto en quedar `healthy`.

   Probar la API en <http://localhost:3001/salud>, la página en React en <http://localhost:8080>, la de Vue en <http://localhost:8082>, n8n en <http://localhost:5678> y Mailpit en <http://localhost:8025>.

5. Si el volumen de PostgreSQL ya existía antes de la parte 7, crear la tabla `log_integraciones` una sola vez:

   ```powershell
   docker compose exec postgres psql -U postgres -d proyecto -f /docker-entrypoint-initdb.d/03_integraciones.sql
   ```

6. Preparar n8n: la cuenta, las credenciales y los workflows. Los pasos están en [`n8n/README.md`](n8n/README.md).

### Probar la colección de Postman contra el entorno `docker`

- **En Postman:** escoger el entorno **docker** → clic derecho en la colección **Proyecto API · colección completa** → **Run collection** → **Run**. Deben pasar las 135 pruebas.
- **Con Newman:**

  ```powershell
  cd postman
  npm run test:api:docker
  ```

  Deja el reporte en `postman/reporte-docker.html`.

### Probar el frontend

1. Abrir <http://localhost:8080> (React) o <http://localhost:8082> (Vue) y entrar con `vendedor@cielum.test` / `Vendedor2026*`.
2. En **Pedidos**, cambiar el filtro de estado y pasar de página con **Siguiente**.
3. En **Nuevo pedido**, escoger un cliente y dos productos, y crear el pedido.
4. En el detalle del pedido nuevo, cambiarle el estado a `enviado`.

Las dos páginas usan la misma API, así que un pedido creado en una también sale en la otra. Con n8n prendido y el workflow publicado, cada pedido nuevo también llega a Zoho CRM. Lo que se haga queda guardado en la base `proyecto` de `proyecto-postgres`, y se puede ver en Adminer. Para correr los frontends sin Docker, con `npm run dev`, los pasos están en [`frontend-react/README.md`](frontend-react/README.md) y [`frontend-vue/README.md`](frontend-vue/README.md).

### Ver las bases de datos

- **Adminer:** en <http://localhost:8081>, Sistema **PostgreSQL**, Servidor `postgres`, Usuario `postgres`, la contraseña de `POSTGRES_PASSWORD` y Base de datos `proyecto`.
- **DBeaver, PostgreSQL:** Host `localhost`, Puerto `5433`, Base `proyecto`, usuario `postgres` y la contraseña de `POSTGRES_PASSWORD`.
- **DBeaver, SQL Server:** Host `localhost`, Puerto `1434`, usuario `sa` y la contraseña de `MSSQL_SA_PASSWORD`. Marcar *Trust Server Certificate*.

### Comandos

| Comando (en la carpeta `proyecto`) | Qué hace |
|---|---|
| `docker compose up -d` | Prende los ocho contenedores |
| `docker compose ps` | Muestra el estado de cada contenedor |
| `docker compose logs -f api` | Muestra los logs de la API (`Ctrl + C` para dejar de verlos) |
| `docker compose logs -f frontend` | Muestra los logs de nginx: cada página y cada petición a `/api` que llega |
| `docker compose logs -f frontend-vue` | Lo mismo, para la página en Vue |
| `docker compose logs -f n8n` | Muestra los logs de n8n |
| `docker compose up -d --build` | Vuelve a construir las imágenes de la API y de los frontends, después de cambiar su código |
| `docker compose down` | Apaga y borra los contenedores. Los datos quedan en los volúmenes |
| `docker compose down -v` | Apaga y borra los contenedores **y los volúmenes**. Se pierden los datos |

Los scripts de `api/db` solo se ejecutan cuando el volumen de PostgreSQL está vacío. Para volver a los datos de ejemplo: `docker compose down -v` y después `docker compose up -d`.

### Si algo falla

| Lo que sale | Qué pasa | Qué hacer |
|---|---|---|
| `required variable ... is missing a value` | Falta el `.env` o un valor del `.env` | Crear el `.env` (paso 2) y llenarlo |
| `port is already allocated` | Otro contenedor o programa usa ese puerto | Apagar la API del día 08 (paso 1). Si es el 8080, puede ser `mi-nginx` del día 09: `docker rm -f mi-nginx`. Con `docker ps` se ve cuál lo usa |
| `proyecto-sqlserver` se apaga solo | La contraseña de `MSSQL_SA_PASSWORD` no cumple las reglas | Cambiarla en el `.env` y volver a correr `docker compose up -d`. El motivo sale en `docker compose logs sqlserver` |
| `proyecto-api` se apaga solo | Le falta una variable, como un `JWT_SECRET` de menos de 16 caracteres | Ver el motivo con `docker compose logs api` |
| `dependency failed to start: container proyecto-api is unhealthy` | Los frontends esperan a que la API esté `healthy`, y la API falló | Ver el motivo con `docker compose logs api` |
| La página de <http://localhost:8080> o la de <http://localhost:8082> dice `La API no respondió. Revisa que esté prendida.` | El contenedor de la API está apagado o se está reiniciando | Revisar con `docker compose ps`. Si la API está `healthy`, `docker compose restart frontend frontend-vue` |
| La colección falla en el login | La base no tiene los datos de ejemplo | `docker compose down -v` y `docker compose up -d` |
| `proyecto-n8n` se apaga solo y en `docker compose logs n8n` dice `Mismatching encryption keys` | Se cambió `N8N_ENCRYPTION_KEY` después de crear el volumen de n8n | Volver a poner la llave de antes. Si se perdió, `docker volume rm proyecto_datos-n8n` borra n8n (los workflows y las credenciales) para empezar de nuevo |
| Los pedidos no llegan a n8n | El workflow no está publicado, o el secreto no coincide | Ver **Si algo falla** en [`n8n/README.md`](n8n/README.md) |

Cada pedido que se crea, también desde la colección de Postman o con Newman, pasa por n8n y llega a Zoho CRM. Por eso, al correr la colección completa con n8n prendido, en Zoho aparecen contactos de los clientes de prueba y en Mailpit, un correo por cada pedido.
