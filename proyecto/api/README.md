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

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run db:init` | Crea la base `proyecto` (si no existe) y la llena con el modelo y los datos de ejemplo |
| `npm run dev` | Prende la API y la reinicia sola al guardar cambios |
| `npm start` | Prende la API |
| `npm test` | Corre las pruebas automáticas |

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

1. En Postman: **Import** y elegir el archivo `postman/proyecto-api.postman_collection.json`.
2. Ejecutar primero **Login vendedor** y **Login admin**. Cada uno guarda su token solo, y las demás peticiones lo usan.
3. Probar las peticiones de cada carpeta. También se pueden correr todas en orden con **Run collection**; cada petición revisa el código que debe responder.

La colección usa la variable `base` con `http://localhost:3000`. Si la API corre en otro puerto, se cambia en la pestaña **Variables** de la colección.

## Pruebas automáticas

```powershell
npm test
```

Corre 29 pruebas sobre todas las rutas: login, permisos, validaciones, CRUD, filtros, paginación, la transacción de los pedidos y los códigos de error.

Las pruebas usan otra base, `proyecto_test` (se cambia en `test/entorno-pruebas.js`). Esa base se crea sola y se vuelve a llenar en cada corrida, así que las pruebas no cambian los datos de la base `proyecto`. Usan la misma contraseña del `.env`.

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

## Estructura por capas

```text
proyecto/api/
├── db/
│   ├── 01_modelo.sql          Tablas: el modelo de la semana 1 más la tabla usuarios
│   ├── 02_datos.sql           Datos de ejemplo y los dos usuarios de prueba
│   ├── inicializar.js         Crea la base si no existe y ejecuta los dos archivos .sql
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
│   ├── esquemas/              Esquemas de zod con las reglas de cada dato
│   └── middlewares/           Login con JWT, roles, registro de peticiones y manejo de errores
├── test/
│   ├── api.test.js            Pruebas automáticas
│   └── entorno-pruebas.js     Cambia la base a proyecto_test antes de las pruebas
└── .env.example               Plantilla de las variables
```

Camino de una petición, por ejemplo `POST /pedidos`:

1. **Ruta** (`rutas/pedidos.rutas.js`): recibe la petición y primero pasa por `autenticar`, que revisa el token.
2. **Controlador** (`controladores/pedidos.controlador.js`): valida el cuerpo con el esquema de zod y llama al servicio.
3. **Servicio** (`servicios/pedidos.servicio.js`): aplica las reglas (el cliente existe, hay stock) y abre la transacción.
4. **Repositorio** (`repositorios/pedidos.repositorio.js` y `productos.repositorio.js`): ejecuta las consultas SQL.
5. Si algo falla en cualquier paso, el error llega al middleware `manejarErrores`, que responde el código y el mensaje.
