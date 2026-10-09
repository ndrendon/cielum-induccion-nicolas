# Pruebas de la API del proyecto (proyecto, parte 2)

Colección completa de Postman para la API de `proyecto/api`, con sus entornos, el comando para correrla con Newman y los endpoints principales hechos con curl.

| Archivo | Para qué sirve |
|---|---|
| `proyecto-api.postman_collection.json` | La colección completa: 43 peticiones con casos felices y de error, y 135 pruebas |
| `entornos/local.postman_environment.json` | Entorno `local`: la API de `npm run dev`, en `http://localhost:3000` |
| `entornos/docker.postman_environment.json` | Entorno `docker`: la API del contenedor, en `http://localhost:3001` |
| `package.json` | Tiene el comando `npm run test:api`, que corre la colección con Newman y deja `reporte.html` |
| `reporte.html` | El reporte que genera `npm run test:api` |
| `curl.md` | Los 3 endpoints principales hechos con curl |
| `curl/` | Los cuerpos JSON que usan los comandos de `curl.md` |

## Qué se necesita

- La API prendida con los datos de ejemplo: `npm run db:init` y `npm run dev` en `proyecto/api`. Para el entorno `docker`, también `docker compose up -d --build` en `proyecto/api`.
- Postman, para usar la colección con ventanas.
- Node.js, para correrla con Newman.

## La colección

Está organizada en carpetas, en el orden en que se corre:

| Carpeta | Peticiones | Qué prueba |
|---|---|---|
| 1. Salud | 1 | Que la API esté prendida |
| 2. Login | 7 | Login del vendedor y del admin (guardan los tokens en el entorno), contraseña mala, correo inválido, perfil, sin token y con un token falso |
| 3. Productos | 11 | El CRUD completo, permisos (sin token, vendedor no puede borrar), id que no existe, id que no es número, datos malos y JSON mal escrito |
| 4. Clientes | 9 | El CRUD completo, cliente que no existe, sin datos, correo repetido y borrar un cliente con pedidos |
| 5. Pedidos | 14 | Listar, filtros y paginación, detalle, crear con transacción, sin productos, cliente que no existe, sin stock, cambiar el estado, cancelar y borrar |
| 6. Rutas que no existen | 1 | Una URL que la API no tiene |

Casos felices y casos de error, por código de estado:

| Código | Peticiones | Ejemplo |
|---|---|---|
| 200 / 201 / 204 | 21 | Listar productos, crear un pedido, borrar un cliente |
| 400 | 7 | Correo inválido, id que no es número, JSON mal escrito, pedido sin productos |
| 401 | 4 | Sin token, token falso, contraseña mala |
| 403 | 1 | Un vendedor intenta borrar un producto |
| 404 | 6 | Producto, cliente o pedido que no existe, ruta que no existe |
| 409 | 4 | Correo repetido, cliente con pedidos, pedido sin stock, borrar un pedido entregado |

Cada petición tiene pruebas de dos tipos:

- **Código de estado:** `pm.response.to.have.status(...)`.
- **Estructura de la respuesta:** que traiga los campos que debe tener (`pm.expect(...).to.have.all.keys(...)`), el mensaje de error exacto y algunos valores; por ejemplo, que el total del pedido sea la suma de los subtotales.

Además, la colección tiene un script propio que se ejecuta después de cada petición y revisa que la respuesta sea JSON. Por eso son 95 pruebas en las peticiones y 135 en total.

La colección deja la base como estaba: borra el producto, el cliente y el pedido que crea.

## Los entornos

Los dos entornos tienen las mismas variables; solo cambia `base_url`.

| Variable | Valor en el archivo |
|---|---|
| `base_url` | `http://localhost:3000` (local) o `http://localhost:3001` (docker) |
| `email_vendedor`, `password_vendedor` | El vendedor de prueba que crea `db/02_datos.sql` |
| `email_admin`, `password_admin` | El admin de prueba que crea `db/02_datos.sql` |
| `token`, `token_admin` | Vacíos. Se llenan solos al hacer login |

No tienen credenciales reales: solo los usuarios de prueba de la base de ejemplo, y los tokens van vacíos. Si se vuelven a exportar desde Postman, hay que revisar que `token` y `token_admin` sigan vacíos antes de subirlos a Git.

## Usarla en Postman

1. **Import** → arrastrar `proyecto-api.postman_collection.json` y los dos archivos de `entornos/`.
2. Escoger el entorno **local** arriba a la derecha.
3. Clic derecho en la colección **Proyecto API · colección completa** → **Run collection** → **Run**.
4. Deben salir las 43 peticiones y las 135 pruebas en verde. Para probar la API de Docker, se escoge el entorno **docker** y se corre otra vez.

## Correrla con Newman: `npm run test:api`

En una terminal parada en `proyecto/postman`:

```powershell
npm install
npm run test:api
```

- `npm install` instala Newman y el reporte HTML. Es solo la primera vez.
- `npm run test:api` corre la colección completa en el entorno `local`. Muestra cada prueba en la terminal y deja el reporte en `reporte.html`. El reporte se abre con doble clic, en el navegador, y necesita internet para cargar sus estilos.
- `npm run test:api:docker` hace lo mismo con el entorno `docker` y deja `reporte-docker.html`.

El comando que corre `npm run test:api` está en el `package.json`:

```powershell
newman run proyecto-api.postman_collection.json -e entornos/local.postman_environment.json -r cli,htmlextra --reporter-htmlextra-export reporte.html
```

## curl

En [`curl.md`](curl.md) están los 3 endpoints principales (login, listar pedidos con filtros y crear un pedido) hechos con curl desde PowerShell, con un caso de error de cada uno.
