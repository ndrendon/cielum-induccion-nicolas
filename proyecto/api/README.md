# API del proyecto integrador (parte 1)

API REST de la tienda del proyecto integrador: clientes, productos y pedidos, con login por JWT y rutas protegidas. Está hecha con Node.js, Express y PostgreSQL.

## Qué se necesita

- Node.js 22 o más nuevo. Para revisar la versión: `node -v`.
- Docker Desktop con el contenedor `pg-induccion` (PostgreSQL) prendido. Si está apagado:

  ```powershell
  docker start pg-induccion
  ```

## Cómo correrla

Los comandos se escriben en la terminal de VS Code (PowerShell), parados en la carpeta `proyecto/api`:

```powershell
cd proyecto/api
```

1. Instalar las librerías (solo la primera vez):

   ```powershell
   npm install
   ```

2. Crear el archivo `.env` a partir de la plantilla:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Abrir el `.env` y llenar los dos valores que están vacíos:
   - `PGPASSWORD`: la contraseña del contenedor `pg-induccion`, la misma que se usa en DBeaver.
   - `JWT_SECRET`: un texto secreto de mínimo 16 caracteres. Se puede generar uno con:

     ```powershell
     node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
     ```

   El `.env` no se sube a GitHub porque está en el `.gitignore`.

4. Crear la base `proyecto` con las tablas y los datos de ejemplo:

   ```powershell
   npm run db:init
   ```

   Si la base no existe, la crea. Si ya existe, borra las tablas y las vuelve a llenar, así que también sirve para dejar los datos como al principio.

5. Prender la API:

   ```powershell
   npm run dev
   ```

   Debe salir `API escuchando en http://localhost:3000`. Con `npm run dev` la API se reinicia sola cada vez que se guarda un archivo. Para apagarla: `Ctrl + C`. Para prenderla sin reinicio automático: `npm start`.

6. Probar en el navegador: <http://localhost:3000/salud> debe responder algo como `{"estado":"ok","fecha":"2026-10-08T19:40:00.000Z"}`.

Si falta una variable en el `.env`, la API no prende y dice cuál falta.

## Correr la API con Docker

> Para prender el **proyecto completo** (la API, su propia base PostgreSQL, SQL Server y Adminer) se usa `proyecto/docker-compose.yml`; los pasos están en [`../README.md`](../README.md). El `compose.yaml` de esta carpeta prende **solo la API**, conectada a `pg-induccion`. Los dos usan el puerto 3001, así que se prende uno o el otro.

La API también se puede prender dentro de un contenedor de Docker. El contenedor queda en el puerto **3001**, así que puede estar prendido al mismo tiempo que la API de `npm run dev` (puerto 3000). Las dos usan la misma base de datos: la del contenedor `pg-induccion`.

Antes se necesitan el `.env` (pasos 2 y 3) y la base creada con `npm run db:init` (paso 4).

```powershell
docker compose up -d --build
```

- `up`: crea el contenedor `api-proyecto` y lo prende.
- `-d`: lo deja corriendo por detrás, sin ocupar la terminal.
- `--build`: construye primero la imagen con los pasos del `Dockerfile`. La primera vez se demora un poco más, porque descarga la imagen de Node.

Para probarlo: <http://localhost:3001/salud>.

| Comando | Qué hace |
|---|---|
| `docker compose up -d --build` | Construye la imagen y prende el contenedor |
| `docker compose ps` | Muestra si el contenedor está prendido |
| `docker compose logs -f` | Muestra las peticiones que van llegando (`Ctrl + C` para dejar de verlas) |
| `docker compose down` | Apaga y borra el contenedor |

- Si se cambia el código, hay que volver a correr `docker compose up -d --build` para que el contenedor tenga los cambios.
- En los logs del contenedor sale `API escuchando en http://localhost:3000`, porque 3000 es el puerto de adentro del contenedor. Desde el computador se entra por el 3001.
- Dentro de un contenedor, `localhost` es el mismo contenedor y no el computador. Por eso en `compose.yaml` la API del contenedor usa `PGHOST=host.docker.internal`, que es la dirección del computador vista desde un contenedor, donde `pg-induccion` tiene publicado el puerto 5432.

Los archivos de Docker son tres:

- `Dockerfile`: los pasos para construir la imagen de la API: parte de Node 24, instala las librerías y copia la carpeta `src`.
- `.dockerignore`: lo que no se copia a la imagen, como `node_modules`, el `.env` y las pruebas.
- `compose.yaml`: cómo se prende el contenedor: su nombre, el puerto `3001:3000`, las variables del `.env` y el `PGHOST` para llegar a PostgreSQL.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run db:init` | Crea la base `proyecto` (si no existe) y la llena con el modelo, los datos de ejemplo y la tabla `log_integraciones` |
| `npm run dev` | Prende la API y la reinicia sola al guardar cambios |
| `npm start` | Prende la API |
| `npm test` | Corre las pruebas automáticas |
| `docker compose up -d --build` | Prende la API en Docker, en el puerto 3001 |
| `docker compose down` | Apaga la API de Docker |

## Usuarios de prueba

| Correo | Contraseña | Rol |
|---|---|---|
| `admin@cielum.test` | `Admin2026*` | admin |
| `vendedor@cielum.test` | `Vendedor2026*` | vendedor |

Son usuarios de ejemplo para probar en el computador. En la tabla `usuarios` no se guarda la contraseña, se guarda su hash de bcrypt.

## Cómo funciona el login

1. Se hace `POST /auth/login` con el correo y la contraseña:

   ```json
   { "email": "vendedor@cielum.test", "password": "Vendedor2026*" }
   ```

   Si los datos están bien, responde el token y los datos del usuario:

   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "usuario": { "id_usuario": 2, "nombre": "Vendedor", "email": "vendedor@cielum.test", "rol": "vendedor" }
   }
   ```

2. En las rutas protegidas se manda ese token en el encabezado `Authorization`:

   ```text
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

El token dura 1 hora (`JWT_EXPIRES_IN` en el `.env`). Cuando vence, hay que hacer login otra vez.

## Rutas

- **Público**: no necesita token.
- **Sesión**: necesita el token de cualquier usuario.
- **Admin**: necesita el token de un usuario con rol `admin`.

| Método | Ruta | Qué hace | Quién puede |
|---|---|---|---|
| GET | `/salud` | Revisa que la API esté prendida | Público |
| POST | `/auth/login` | Inicia sesión y devuelve el token | Público |
| GET | `/auth/perfil` | Muestra el usuario del token | Sesión |
| GET | `/productos` | Lista los productos | Público |
| GET | `/productos/:id` | Muestra un producto | Público |
| POST | `/productos` | Crea un producto | Sesión |
| PUT | `/productos/:id` | Cambia un producto | Sesión |
| DELETE | `/productos/:id` | Borra un producto | Admin |
| GET | `/clientes` | Lista los clientes | Sesión |
| GET | `/clientes/:id` | Muestra un cliente | Sesión |
| POST | `/clientes` | Crea un cliente | Sesión |
| PUT | `/clientes/:id` | Cambia un cliente | Sesión |
| DELETE | `/clientes/:id` | Borra un cliente | Admin |
| GET | `/pedidos?estado=&pagina=&limite=` | Lista los pedidos con filtro y paginación | Sesión |
| GET | `/pedidos/:id` | Muestra un pedido con su detalle | Sesión |
| POST | `/pedidos` | Crea un pedido con su detalle | Sesión |
| PATCH | `/pedidos/:id/estado` | Cambia el estado de un pedido | Sesión |
| DELETE | `/pedidos/:id` | Borra un pedido | Admin |

### Qué se manda en el cuerpo

Producto (`POST /productos` y `PUT /productos/:id`):

```json
{ "nombre": "Cámara web HD", "categoria": "Accesorios", "precio": 120000, "stock": 15 }
```

Cliente (`POST /clientes` y `PUT /clientes/:id`):

```json
{ "nombre": "Carlos Pérez", "email": "carlos.perez@example.com", "ciudad": "Medellín" }
```

Pedido (`POST /pedidos`): el cliente y la lista de productos con su cantidad. El precio no se manda, se toma del producto.

```json
{
  "id_cliente": 9,
  "detalle": [
    { "id_producto": 8, "cantidad": 2 },
    { "id_producto": 9, "cantidad": 1 }
  ]
}
```

Estado (`PATCH /pedidos/:id/estado`):

```json
{ "estado": "enviado" }
```

Los estados que existen son `pendiente`, `enviado`, `entregado` y `cancelado`.

## Reglas de los pedidos

- Crear un pedido se hace en una transacción: se guarda el pedido, se descuenta el stock de cada producto y se guarda cada línea del detalle con el precio que tiene el producto en ese momento.
- Si un producto no existe o no tiene stock suficiente, no se guarda nada (ROLLBACK) y la API responde el error. Por ejemplo: `409` con `No hay stock suficiente de Silla ergonómica: hay 4 y se pidieron 50`.
- Todo pedido nuevo empieza en `pendiente`.
- Al cancelar un pedido, sus unidades vuelven al stock. Un pedido cancelado ya no se puede cambiar.
- Solo un admin puede borrar pedidos, y solo si están `pendiente` o `cancelado`. Si estaba `pendiente`, sus unidades vuelven al stock.
- No se puede borrar un cliente que tiene pedidos, ni un producto que está en algún pedido (`409`).

Respuesta al crear un pedido (`201`):

```json
{
  "id_pedido": 13,
  "fecha": "2026-10-08",
  "estado": "pendiente",
  "id_cliente": 9,
  "cliente": "Andrés López",
  "total": 960000,
  "detalle": [
    { "id_producto": 8, "producto": "Memoria USB 64 GB", "cantidad": 2, "precio_unitario": 35000, "subtotal": 70000 },
    { "id_producto": 9, "producto": "Silla ergonómica", "cantidad": 1, "precio_unitario": 890000, "subtotal": 890000 }
  ]
}
```

## Aviso a n8n cuando se crea un pedido (parte 7)

Cada vez que se crea un pedido, la API le manda un aviso al webhook de n8n que dice `N8N_WEBHOOK_URL`, con el secreto de `N8N_WEBHOOK_SECRET` en el encabezado `X-Webhook-Secret`. El workflow de n8n que lo recibe está en [`../n8n`](../n8n/README.md).

Cuerpo del aviso (`POST`, JSON):

```json
{
  "evento": "pedido.creado",
  "pedido": {
    "id_pedido": 13,
    "fecha": "2026-10-21",
    "estado": "pendiente",
    "total": 135000,
    "detalle": [
      { "id_producto": 8, "producto": "Memoria USB 64 GB", "cantidad": 2, "precio_unitario": 35000, "subtotal": 70000 },
      { "id_producto": 2, "producto": "Mouse inalámbrico", "cantidad": 1, "precio_unitario": 65000, "subtotal": 65000 }
    ]
  },
  "cliente": { "id_cliente": 2, "nombre": "Luis Pérez", "email": "luis.perez@example.com", "ciudad": "Bogotá" }
}
```

- El aviso **no frena la respuesta**: la API responde el `201` del pedido y avisa a n8n por detrás, sin `await`. Si n8n tarda o está apagado, quien creó el pedido no lo nota.
- **Reintentos:** si n8n no responde en 5 segundos, no se puede conectar o responde un error 5xx, la API lo intenta otra vez después de 1 segundo y después de 2 segundos (3 intentos en total). Un 4xx no se reintenta, porque es un problema del secreto, del webhook o de los datos.
- **Logs:** los primeros fallos salen como aviso (`Intento 1 de 3: ...`) y solo el último como error, para no llenar el log de errores que se arreglaron solos.
- Si `N8N_WEBHOOK_URL` está vacía, la API no avisa a nadie y todo lo demás funciona igual.
- El código está en `src/integraciones/n8n.js` y se llama desde `crear` en `src/servicios/pedidos.servicio.js`.

## Filtros y paginación de pedidos

`GET /pedidos` recibe tres valores en la URL. Los tres son opcionales:

| Parámetro | Qué hace | Si no se manda |
|---|---|---|
| `estado` | Muestra solo los pedidos con ese estado | Muestra todos |
| `pagina` | Qué página mostrar, desde 1 | `1` |
| `limite` | Cuántos pedidos por página, de 1 a 100 | `10` |

Los pedidos salen del más nuevo al más viejo. Ejemplo: `GET /pedidos?estado=pendiente&pagina=1&limite=2`

```json
{
  "datos": [
    { "id_pedido": 12, "fecha": "2026-10-01", "estado": "pendiente", "id_cliente": 1, "cliente": "Ana Gómez", "total": 785000 },
    { "id_pedido": 11, "fecha": "2026-09-28", "estado": "pendiente", "id_cliente": 3, "cliente": "Sofía Ruiz", "total": 540000 }
  ],
  "pagina": 1,
  "limite": 2,
  "total": 3,
  "totalPaginas": 2
}
```

- `total`: cuántos pedidos cumplen el filtro, sumando todas las páginas.
- `totalPaginas`: cuántas páginas hay con ese límite.

## Errores

Todos los errores responden un JSON con `mensaje`:

```json
{ "mensaje": "Debes iniciar sesión para usar esta ruta" }
```

Si los datos que se mandaron no son válidos, también viene `errores` con lo que falla en cada campo:

```json
{
  "mensaje": "Los datos enviados no son válidos",
  "errores": {
    "email": ["Escribe un correo válido"],
    "ciudad": ["La ciudad es obligatoria"]
  }
}
```

| Código | Cuándo sale |
|---|---|
| `400` | Los datos o el JSON enviados no son válidos |
| `401` | No se mandó el token, el token no sirve o ya venció, o el correo o la contraseña del login están mal |
| `403` | El usuario no tiene el rol que pide la ruta (por ejemplo, un vendedor intenta borrar) |
| `404` | La ruta o el registro no existen |
| `409` | La acción choca con los datos: correo repetido, falta stock, registro con pedidos, pedido cancelado |
| `500` | Error inesperado del servidor (el detalle se ve en la terminal de la API) |

## Probar con Postman

La colección completa, con sus entornos `local` y `docker`, 135 pruebas, el comando `npm run test:api` (Newman) y los ejemplos con curl, está en la carpeta [`proyecto/postman`](../postman/README.md).

La carpeta `postman/` de aquí tiene la colección sencilla del día 07:

1. En Postman: **Import** y elegir el archivo `postman/proyecto-api.postman_collection.json`.
2. Ejecutar primero **Login vendedor** y **Login admin**. Cada uno guarda su token solo, y las demás peticiones lo usan.
3. Probar las peticiones de cada carpeta. También se pueden correr todas en orden con **Run collection**; cada petición revisa el código que debe responder.

La colección usa la variable `base` con `http://localhost:3000`. Si la API corre en otro puerto, se cambia en la pestaña **Variables** de la colección.

## Pruebas automáticas

```powershell
npm test
```

Corre 32 pruebas sobre todas las rutas: login, permisos, validaciones, CRUD, filtros, paginación, la transacción de los pedidos, los códigos de error y el aviso a n8n.

Las pruebas usan otra base, `proyecto_test` (se cambia en `test/entorno-pruebas.js`). Esa base se crea sola y se vuelve a llenar en cada corrida, así que las pruebas no cambian los datos de la base `proyecto`. Usan la misma contraseña del `.env`.

Para el aviso a n8n, las pruebas levantan un n8n falso en `http://127.0.0.1:3999`. Revisan que el aviso llegue con el pedido, el cliente y el secreto, que la API reintente si n8n responde 500 y que el pedido se cree sin esperar a n8n. Si el puerto 3999 está ocupado, esas pruebas fallan.

## Variables de entorno

| Variable | Para qué sirve | Valor en `.env.example` |
|---|---|---|
| `PORT` | Puerto de la API | `3000` |
| `PGHOST`, `PGPORT` | Dónde está PostgreSQL | `localhost`, `5432` |
| `PGDATABASE` | Nombre de la base | `proyecto` |
| `PGUSER`, `PGPASSWORD` | Usuario y contraseña de PostgreSQL | `postgres` y vacío |
| `JWT_SECRET` | Secreto para firmar los tokens (mínimo 16 caracteres) | vacío |
| `JWT_EXPIRES_IN` | Cuánto dura un token | `1h` |
| `CORS_ORIGIN` | Dirección del frontend que puede usar la API | `http://localhost:5173` |
| `PGOPTIONS` | Opciones de la conexión a PostgreSQL. Con `-c timezone=America/Bogota`, los pedidos nuevos quedan con la fecha de Colombia | `-c timezone=America/Bogota` |
| `N8N_WEBHOOK_URL` | Webhook de n8n que recibe cada pedido nuevo (parte 7). Si está vacía, no se avisa | vacío |
| `N8N_WEBHOOK_SECRET` | Secreto que va en el encabezado `X-Webhook-Secret` (mínimo 16 caracteres si hay `N8N_WEBHOOK_URL`) | vacío |

## Estructura por capas

```text
proyecto/api/
├── db/
│   ├── 01_modelo.sql          Tablas: el modelo de la semana 1 más la tabla usuarios
│   ├── 02_datos.sql           Datos de ejemplo y los dos usuarios de prueba
│   ├── 03_integraciones.sql   La tabla log_integraciones, donde n8n registra lo que hace (parte 7)
│   ├── inicializar.js         Crea la base si no existe y ejecuta los tres archivos .sql
│   └── init.js                Lo que corre npm run db:init
├── postman/
│   └── proyecto-api.postman_collection.json
├── src/
│   ├── index.js               Prende el servidor
│   ├── app.js                 Arma la app: middlewares, rutas y manejo de errores
│   ├── config.js              Lee y revisa las variables del .env
│   ├── db.js                  Pool de conexiones a PostgreSQL y la función enTransaccion
│   ├── errores.js             ErrorHttp: un error que lleva su código HTTP
│   ├── rutas/                 Qué método y URL va a qué controlador, y quién puede usarla
│   ├── controladores/         Validan lo que llega con zod y responden
│   ├── servicios/             Reglas del negocio: stock, estados, transacciones
│   ├── repositorios/          Las consultas SQL
│   ├── integraciones/         El aviso a n8n cuando se crea un pedido (parte 7)
│   ├── esquemas/              Esquemas de zod con las reglas de cada dato
│   └── middlewares/           Login con JWT, roles, registro de peticiones y manejo de errores
├── test/
│   ├── api.test.js            Pruebas automáticas
│   └── entorno-pruebas.js     Cambia la base a proyecto_test antes de las pruebas
├── .dockerignore              Lo que no se copia a la imagen de Docker
├── .env.example               Plantilla de las variables
├── compose.yaml               Cómo se prende la API en Docker (puerto 3001)
└── Dockerfile                 Pasos para construir la imagen de Docker de la API
```

Camino de una petición, por ejemplo `POST /pedidos`:

1. **Ruta** (`rutas/pedidos.rutas.js`): recibe la petición y primero pasa por `autenticar`, que revisa el token.
2. **Controlador** (`controladores/pedidos.controlador.js`): valida el cuerpo con el esquema de zod y llama al servicio.
3. **Servicio** (`servicios/pedidos.servicio.js`): aplica las reglas (el cliente existe, hay stock) y abre la transacción.
4. **Repositorio** (`repositorios/pedidos.repositorio.js` y `productos.repositorio.js`): ejecuta las consultas SQL.
5. Si algo falla en cualquier paso, el error llega al middleware `manejarErrores`, que responde el código y el mensaje.
