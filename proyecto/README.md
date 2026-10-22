# Proyecto integrador backend

API REST de una tienda: clientes, productos, pedidos con su detalle y login con JWT. Guarda los datos en PostgreSQL, se prueba con una colección de Postman de 135 pruebas y se prende completa en Docker con un solo comando.

## Inicio rápido

Con Docker Desktop prendido, en la terminal de VS Code, parado en esta carpeta (`proyecto`):

1. Crear el `.env` y llenar las tres contraseñas (`POSTGRES_PASSWORD`, `JWT_SECRET` y `MSSQL_SA_PASSWORD`; las reglas de cada una están más abajo, en "Cómo prenderlo"):

   ```powershell
   Copy-Item .env.example .env
   code .env
   ```

2. Prender todo:

   ```powershell
   docker compose up -d
   ```

3. Correr la colección de Postman contra la API de Docker:

   ```powershell
   cd postman
   npm install
   npm run test:api:docker
   ```

## Comprobar que todo funciona

- [ ] `docker compose ps` muestra los cuatro contenedores `Up`, y `postgres`, `api` y `sqlserver` dicen `(healthy)`.
- [ ] <http://localhost:3001/salud> responde `{"estado":"ok",...}`.
- [ ] `npm run test:api:docker` termina con 135 pruebas y 0 fallidas, y deja `postman/reporte-docker.html`.
- [ ] Adminer, en <http://localhost:8081>, muestra las cinco tablas de la base `proyecto`.

## Qué hay en esta carpeta

| Carpeta o archivo | Qué es |
|---|---|
| `api/` | La API REST: clientes, productos, pedidos y login con JWT (parte 1) |
| `postman/` | La colección completa de Postman, los entornos, Newman y curl (parte 2) |
| `docker-compose.yml` | Todo el proyecto corriendo en Docker (parte 3) |
| `.env.example` | Plantilla de las variables que usa `docker-compose.yml` |

## Parte 3: todo el proyecto en Docker

`docker-compose.yml` prende cuatro contenedores que trabajan juntos:

| Servicio | Contenedor | En el computador | Qué hace |
|---|---|---|---|
| `postgres` | `proyecto-postgres` | `localhost:5433` | PostgreSQL 16 con la base `proyecto`. Guarda los datos en el volumen `datos-postgres` y, la primera vez, ejecuta los scripts de `api/db` para crear las tablas y cargar los datos de ejemplo |
| `api` | `proyecto-api` | <http://localhost:3001> | La API del proyecto, construida con `api/Dockerfile`. Se conecta a `postgres` por el nombre del servicio |
| `sqlserver` | `proyecto-sqlserver` | `localhost:1434` | SQL Server 2022, con sus datos en el volumen `datos-sqlserver` |
| `adminer` | `proyecto-adminer` | <http://localhost:8081> | Una página web para ver y consultar la base de PostgreSQL |

Los puertos son 5433 y 1434 porque el 5432 y el 1433 ya los usan `pg-induccion` y el SQL Server del día 05. La API queda en el 3001, que es el que usa el entorno `docker` de Postman.

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

   Llenar los tres valores vacíos:
   - `POSTGRES_PASSWORD`: la contraseña de la base nueva. Es una base aparte de `pg-induccion`, así que se puede escoger cualquiera.
   - `JWT_SECRET`: un texto de mínimo 16 caracteres. Se puede generar uno con `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
   - `MSSQL_SA_PASSWORD`: mínimo 8 caracteres, mezclando mayúsculas, minúsculas, números y símbolos. Si no cumple, SQL Server no arranca.

   El `.env` no se sube a GitHub, porque está en el `.gitignore`.

3. Prender todo:

   ```powershell
   docker compose up -d
   ```

   La primera vez se demora más, porque construye la imagen de la API y descarga las de PostgreSQL, SQL Server y Adminer.

4. Revisar que todo esté funcionando:

   ```powershell
   docker compose ps
   ```

   Los cuatro contenedores deben salir `Up`, y `postgres`, `api` y `sqlserver` deben decir `(healthy)`. SQL Server puede tardar cerca de un minuto en quedar `healthy`.

   Probar la API: <http://localhost:3001/salud>.

### Probar la colección de Postman contra el entorno `docker`

- **En Postman:** escoger el entorno **docker** → clic derecho en la colección **Proyecto API · colección completa** → **Run collection** → **Run**. Deben pasar las 135 pruebas.
- **Con Newman:**

  ```powershell
  cd postman
  npm run test:api:docker
  ```

  Deja el reporte en `postman/reporte-docker.html`.

### Ver las bases de datos

- **Adminer:** en <http://localhost:8081>, Sistema **PostgreSQL**, Servidor `postgres`, Usuario `postgres`, la contraseña de `POSTGRES_PASSWORD` y Base de datos `proyecto`.
- **DBeaver, PostgreSQL:** Host `localhost`, Puerto `5433`, Base `proyecto`, usuario `postgres` y la contraseña de `POSTGRES_PASSWORD`.
- **DBeaver, SQL Server:** Host `localhost`, Puerto `1434`, usuario `sa` y la contraseña de `MSSQL_SA_PASSWORD`. Marcar *Trust Server Certificate*.

### Comandos

| Comando (en la carpeta `proyecto`) | Qué hace |
|---|---|
| `docker compose up -d` | Prende los cuatro contenedores |
| `docker compose ps` | Muestra el estado de cada contenedor |
| `docker compose logs -f api` | Muestra los logs de la API (`Ctrl + C` para dejar de verlos) |
| `docker compose up -d --build` | Vuelve a construir la imagen de la API, después de cambiar su código |
| `docker compose down` | Apaga y borra los contenedores. Los datos quedan en los volúmenes |
| `docker compose down -v` | Apaga y borra los contenedores **y los volúmenes**. Se pierden los datos |

Los scripts de `api/db` solo se ejecutan cuando el volumen de PostgreSQL está vacío. Para volver a los datos de ejemplo: `docker compose down -v` y después `docker compose up -d`.

### Si algo falla

| Lo que sale | Qué pasa | Qué hacer |
|---|---|---|
| `required variable ... is missing a value` | Falta el `.env` o un valor del `.env` | Crear el `.env` (paso 2) y llenarlo |
| `port is already allocated` | Otro contenedor o programa usa ese puerto | Apagar la API del día 08 (paso 1), o ver cuál lo usa con `docker ps` |
| `proyecto-sqlserver` se apaga solo | La contraseña de `MSSQL_SA_PASSWORD` no cumple las reglas | Cambiarla en el `.env` y volver a correr `docker compose up -d`. El motivo sale en `docker compose logs sqlserver` |
| `proyecto-api` se apaga solo | Le falta una variable, como un `JWT_SECRET` de menos de 16 caracteres | Ver el motivo con `docker compose logs api` |
| La colección falla en el login | La base no tiene los datos de ejemplo | `docker compose down -v` y `docker compose up -d` |
