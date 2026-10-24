# Proyecto integrador

Una tienda con clientes, productos, pedidos y login con JWT. Tiene una API REST con su base en PostgreSQL, una colección de Postman de 135 pruebas y una página web para manejar los pedidos, hecha en React y también en Vue. Cada pedido nuevo pasa por n8n a Zoho CRM, queda registrado en la base y llega un correo de aviso. Un bot de Python arma el reporte diario en Excel leyendo la página.

El diagrama y cómo se conectan las partes están en [`../docs/arquitectura.md`](../docs/arquitectura.md).

## Una sola base, un solo n8n y un solo Mailpit

PostgreSQL, n8n y Mailpit corren **siempre en Docker**, con `docker-compose.yml`, y son los mismos para los dos modos. La API y la página se pueden correr de dos formas:

| | Modo local (principal) | Modo Docker (segunda opción) |
|---|---|---|
| La base, n8n y Mailpit | En Docker: `docker compose up -d postgres mailpit n8n` | En Docker |
| La API y la página | En el computador, con `npm run dev` | En Docker: `docker compose up -d --build` |
| Página en React | <http://localhost:5173> | <http://localhost:8080> |
| API | <http://localhost:3000> | <http://localhost:3001> |
| n8n y Mailpit | <http://localhost:5678> y <http://localhost:8025> | Los mismos |

Como los dos modos usan la misma base, el mismo n8n y el mismo Mailpit, **todo queda guardado en un solo lugar**: un pedido creado en el modo local se ve después en el modo Docker, y al revés. n8n se prepara una sola vez, con una sola cuenta y unas solas credenciales.

## Qué hay en esta carpeta

| Carpeta o archivo | Qué es | Parte |
|---|---|---|
| `api/` | La API REST: clientes, productos, pedidos y login con JWT. Ver [`api/README.md`](api/README.md) | 1 |
| `postman/` | La colección completa de Postman, sus entornos `local` y `docker`, Newman y curl. Ver [`postman/README.md`](postman/README.md) | 2 |
| `docker-compose.yml` | La base, n8n y Mailpit, y también la API y las páginas para el modo Docker | 3, 4, 5 y 7 |
| `frontend-react/` | La página en React: login, pedidos con filtro y páginas, crear pedidos y cambiarles el estado. Ver [`frontend-react/README.md`](frontend-react/README.md) | 4 |
| `frontend-vue/` | La misma página hecha en Vue. Ver [`frontend-vue/README.md`](frontend-vue/README.md) | 5 |
| `zoho/` | Zoho CRM: la configuración, la colección de Postman zoho-crm y la función de Deluge. Ver [`zoho/README.md`](zoho/README.md) | 6 |
| `n8n/` | El workflow que pasa cada pedido nuevo a Zoho CRM, lo registra en `log_integraciones` y avisa por correo. Ver [`n8n/README.md`](n8n/README.md) | 7 |
| `rpa/` | El bot de Python que arma el reporte diario de pedidos en Excel. Ver [`rpa/README.md`](rpa/README.md) | 7 |
| `.env.example` | Plantilla de las variables de `docker-compose.yml` | 3 |

La comparación entre la página en React y la de Vue está en [`../docs/react-vs-vue.md`](../docs/react-vs-vue.md).

## La primera vez

Los comandos van en la terminal de VS Code (PowerShell), con Docker Desktop prendido, empezando desde la raíz del repo.

1. **El `.env` de Docker.** Parado en `proyecto`:

   ```powershell
   cd proyecto
   Copy-Item .env.example .env
   code .env
   ```

   Llena los cinco valores vacíos. Esto se hace **una sola vez**: si después vuelves a copiar `.env.example` encima, se borran.
   - `POSTGRES_PASSWORD`: la contraseña de la base.
   - `JWT_SECRET`: un texto aleatorio de mínimo 16 caracteres.
   - `MSSQL_SA_PASSWORD`: mínimo 8 caracteres, con mayúsculas, minúsculas, números y símbolos. Si no cumple, SQL Server no arranca.
   - `N8N_ENCRYPTION_KEY`: la llave con la que n8n cifra las credenciales. No se cambia después: si cambia, n8n ya no puede leer las credenciales.
   - `N8N_WEBHOOK_SECRET`: el secreto que la API le manda a n8n en cada aviso.

   Cada texto aleatorio sale de este comando:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

2. **Prender la base, n8n y Mailpit:**

   ```powershell
   docker compose up -d postgres mailpit n8n
   ```

   La primera vez, PostgreSQL ejecuta los scripts de `api/db`: crea las tablas, carga los datos de ejemplo y crea `log_integraciones`.

3. **Preparar n8n:** la cuenta, las credenciales y los workflows. Los pasos están en [`n8n/README.md`](n8n/README.md).

4. **La API.** En `proyecto/api`:

   ```powershell
   cd api
   npm install
   Copy-Item .env.example .env
   code .env
   ```

   Llena estos valores:
   - `PGPASSWORD`: la misma de `POSTGRES_PASSWORD` en `proyecto/.env`. El `.env.example` ya trae `PGPORT=5433`, el puerto de la base de Docker.
   - `JWT_SECRET`: un texto aleatorio de mínimo 16 caracteres.
   - `N8N_WEBHOOK_URL`: `http://localhost:5678/webhook/pedido-creado`.
   - `N8N_WEBHOOK_SECRET`: el mismo de `proyecto/.env`, para que n8n acepte los avisos de los dos modos.

5. **La página en React.** En `proyecto/frontend-react`, `npm install` y `Copy-Item .env.example .env`. El `.env` ya trae `API_URL=http://localhost:3000`. Para la página en Vue es lo mismo, en `proyecto/frontend-vue`.

6. **El bot de RPA:** los pasos están en [`rpa/README.md`](rpa/README.md).

7. **Newman**, para correr la colección de Postman desde la terminal: `npm install` en `proyecto/postman`.

## Opción 1: modo local (principal)

| Terminal | Parado en | Comando | Queda en |
|---|---|---|---|
| 1. La base, n8n y Mailpit | `proyecto` | `docker compose up -d postgres mailpit n8n` | `localhost:5433`, <http://localhost:5678> y <http://localhost:8025> |
| 2. API | `proyecto/api` | `npm run dev` | <http://localhost:3000> |
| 3. Página en React | `proyecto/frontend-react` | `npm run dev` | <http://localhost:5173> |

El comando de la terminal 1 deja los tres contenedores prendidos por detrás, así que esa terminal te queda libre. La página en Vue es opcional: `npm run dev` en `proyecto/frontend-vue`, y queda en <http://localhost:5175>.

La API y la página se apagan con **Ctrl + C**. Los contenedores, con `docker compose stop` en `proyecto`.

### Comprobar que todo funciona

- [ ] <http://localhost:3000/salud> responde `{"estado":"ok",...}`.
- [ ] <http://localhost:5173> muestra el login y, al entrar con `vendedor@cielum.test` / `Vendedor2026*`, salen los pedidos.
- [ ] En n8n, el workflow **Pedido a Zoho CRM** está publicado.
- [ ] Al crear un pedido, sale una ejecución nueva en n8n, el cliente aparece en Zoho CRM y llega un correo a Mailpit.
- [ ] `npm test` en `proyecto/api` termina con 32 pruebas y 0 fallidas.
- [ ] `npm run test:api` en `proyecto/postman` termina con 135 pruebas y 0 fallidas.

## Opción 2: modo Docker

Si están prendidas la API y la página del modo local, apágalas con **Ctrl + C**. Después, parado en `proyecto`:

```powershell
docker compose up -d --build
docker compose ps
```

`--build` construye las imágenes de la API y de las páginas con el código de ahora. Los ocho contenedores deben salir `Up`, y `postgres`, `api` y `sqlserver` deben decir `(healthy)`.

| Servicio | Contenedor | En el computador | Qué hace |
|---|---|---|---|
| `postgres` | `proyecto-postgres` | `localhost:5433` | PostgreSQL 16 con la base `proyecto`. **La usan los dos modos** |
| `n8n` | `proyecto-n8n` | <http://localhost:5678> | n8n, con sus workflows y credenciales en el volumen `datos-n8n`. **Lo usan los dos modos** |
| `mailpit` | `proyecto-mailpit` | <http://localhost:8025> | El correo de pruebas. **Lo usan los dos modos** |
| `api` | `proyecto-api` | <http://localhost:3001> | La API. Se conecta a `postgres` y a `n8n` por el nombre del servicio |
| `frontend` | `proyecto-frontend` | <http://localhost:8080> | La página en React. nginx le pasa a la `api` las peticiones de `/api` |
| `frontend-vue` | `proyecto-frontend-vue` | <http://localhost:8082> | La página en Vue |
| `sqlserver` | `proyecto-sqlserver` | `localhost:1434` | SQL Server 2022, el de los días 05 y 06 |
| `adminer` | `proyecto-adminer` | <http://localhost:8081> | Una página para ver la base de PostgreSQL |

Los puertos 5433 y 1434 son para no chocar con `pg-induccion` y el SQL Server del día 05, que usan los ejercicios de la semana 1 y 2. La API queda en el 3001, que es el del entorno `docker` de Postman.

### Comprobar que todo funciona en Docker

- [ ] <http://localhost:3001/salud> responde `{"estado":"ok",...}`.
- [ ] <http://localhost:8080> (React) y <http://localhost:8082> (Vue) muestran el login y los pedidos, también los que creaste en el modo local.
- [ ] Al crear un pedido, sale la ejecución en el mismo n8n y el correo en el mismo Mailpit.
- [ ] `npm run test:api:docker` en `proyecto/postman` termina con 135 pruebas y 0 fallidas.

## Ver la base de datos

Es la misma en los dos modos:

- **DBeaver:** Host `localhost`, Puerto `5433`, Base `proyecto`, Usuario `postgres` y la contraseña de `POSTGRES_PASSWORD`.
- **Adminer** (solo con el modo Docker prendido): <http://localhost:8081>, Sistema **PostgreSQL**, Servidor `postgres`, Usuario `postgres` y Base de datos `proyecto`.
- **Terminal:** `docker compose exec postgres psql -U postgres -d proyecto`. Se sale con `\q`.

## Demo de 5 minutos

El flujo completo: login → crear pedido → aparece en Zoho → correo → reporte RPA. Las direcciones son las del modo local; las de Docker van entre paréntesis.

**Antes de empezar:** todo prendido, el workflow **Pedido a Zoho CRM** publicado, y abiertas en el navegador la página (<http://localhost:5173>), n8n, Zoho CRM en **Contactos** y Mailpit.

1. **Datos en limpio.** En `proyecto/api`, `npm run db:init` deja la base con los datos de ejemplo. Sirve para los dos modos, porque la base es la misma.
2. **Login.** Entra con `vendedor@cielum.test` / `Vendedor2026*`. Muestra la lista de pedidos, el filtro por estado y el paso de página.
3. **Crear un pedido.** En **Nuevo pedido**, escoge un cliente y dos productos y crea el pedido. Sale su detalle, con el total.
4. **n8n.** En el workflow, pestaña **Executions**: sale la ejecución del pedido. Ábrela y muestra el camino que siguió.
5. **Zoho CRM.** En **Contactos** sale el cliente, y en **Descripción** dice `Último pedido: #... del ... por $ ...`.
6. **Correo.** En Mailpit llega *Pedido #...: el contacto se creó en Zoho CRM*.
7. **El log.** En DBeaver: `SELECT * FROM log_integraciones ORDER BY id_log DESC;`.
8. **Reporte RPA.** En `proyecto/rpa`, con el entorno virtual activo: `python reporte_diario.py`. Abre `salida/reporte_diario.xlsx`: está el pedido de hoy. En Docker, `FRONTEND_URL` del `.env` del bot va con `http://localhost:8080`.

## Pruebas

| Qué | Dónde | Comando | Resultado |
|---|---|---|---|
| Pruebas automáticas de la API | `proyecto/api` | `npm test` | 32 pruebas. Usan otra base, `proyecto_test`, así que no tocan los datos |
| Colección de Postman, modo local | `proyecto/postman` | `npm run test:api` | 135 pruebas y el reporte `reporte.html` |
| Colección de Postman, modo Docker | `proyecto/postman` | `npm run test:api:docker` | 135 pruebas y el reporte `reporte-docker.html` |
| Colección de Zoho CRM | Postman | **Run collection** en **zoho-crm** | 19 pruebas. Ver [`zoho/README.md`](zoho/README.md) |

En Postman se escoge el entorno **local** o **docker** y se corre la colección **Proyecto API · colección completa** con **Run collection**. Cada pedido que crea la colección también pasa por n8n. Por eso, en Zoho aparecen los clientes de prueba y en Mailpit un correo por cada pedido.

Newman vuelve a escribir `reporte.html` cada vez que corre. Si no quieres subir ese cambio a Git: `git restore proyecto/postman/reporte.html`.

## Comandos

| Comando | Dónde | Qué hace |
|---|---|---|
| `docker compose up -d postgres mailpit n8n` | `proyecto` | Prende la base, n8n y Mailpit (los dos modos los usan) |
| `docker compose up -d --build` | `proyecto` | Prende todo en Docker: también la API y las páginas |
| `docker compose ps` | `proyecto` | Muestra el estado de cada contenedor |
| `docker compose logs -f n8n` | `proyecto` | Muestra los logs de n8n (`Ctrl + C` para dejar de verlos). Sirve igual con `api` o `postgres` |
| `docker compose stop` | `proyecto` | Apaga los contenedores. Los datos quedan guardados |
| `docker compose down` | `proyecto` | Apaga y borra los contenedores. Los datos quedan en los volúmenes |
| `docker compose down -v` | `proyecto` | Borra también **los volúmenes**: se pierden la base y la configuración de n8n. No lo uses si no quieres empezar de cero |
| `npm run dev` | `proyecto/api` | Prende la API del modo local y la reinicia sola al guardar cambios |
| `npm run db:init` | `proyecto/api` | Deja la base con las tablas y los datos de ejemplo |
| `npm run dev` | `proyecto/frontend-react` o `proyecto/frontend-vue` | Prende la página del modo local |
| `python reporte_diario.py` | `proyecto/rpa` | Arma el reporte del día |

## Si algo falla

| Lo que sale | Qué pasa | Qué hacer |
|---|---|---|
| `required variable ... is missing a value` | Falta el `proyecto/.env` o uno de sus valores | Llénalo (La primera vez, paso 1) |
| La API local no prende y dice `Faltan variables de entorno` | Falta un valor en `proyecto/api/.env` | Llénalo. Si hay `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET` debe tener mínimo 16 caracteres |
| `Error interno del servidor` al entrar, y en la terminal de la API sale `ECONNREFUSED` | La base está apagada, o la API local apunta a otro puerto | `docker compose up -d postgres` y revisa `PGPORT=5433` en `proyecto/api/.env` |
| En la terminal de la API sale `password authentication failed` | `PGPASSWORD` no es igual a `POSTGRES_PASSWORD` | Pon la misma en los dos `.env` |
| La página dice `La API no respondió. Revisa que esté prendida.` | La API está apagada o en otro puerto | Prende la API. Revisa `API_URL` en el `.env` de la página |
| En la terminal de la API sale `Intento 1 de 3: no se pudo avisar a n8n` | n8n está apagado | `docker compose up -d n8n`. El pedido igual queda guardado |
| La API dice `n8n rechazó el pedido ... con el código 404` | El workflow no está publicado | Dale **Publish** en n8n |
| ... `con el código 403` | El `N8N_WEBHOOK_SECRET` de ese `.env` no es igual al de la credencial **Secreto de la API** | Deja el mismo secreto en `proyecto/.env`, en `proyecto/api/.env` y en la credencial |
| `port is already allocated` o `EADDRINUSE` | Otro programa usa ese puerto, por ejemplo un n8n que no es el de Docker | Apágalo. Con `docker ps` se ven los contenedores prendidos |
| `proyecto-sqlserver` se apaga solo | `MSSQL_SA_PASSWORD` no cumple las reglas | Cámbiala y corre otra vez `docker compose up -d` |
| `proyecto-n8n` se apaga solo y en sus logs dice `Mismatching encryption keys` | Cambió `N8N_ENCRYPTION_KEY` | Vuelve a poner la llave de antes. Si se perdió, `docker volume rm proyecto_datos-n8n` borra n8n para empezar de nuevo |
| La colección de Postman falla en el login | La base no tiene los datos de ejemplo | `npm run db:init` en `proyecto/api` |
