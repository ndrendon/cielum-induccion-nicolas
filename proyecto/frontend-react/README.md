# Frontend del proyecto integrador (parte 4)

Página web en React para manejar los pedidos de la tienda. Usa la API de `proyecto/api`: se inicia sesión, se ven los pedidos con filtros y paginación, se crean pedidos con varios productos y se les cambia el estado.

Está hecha con React, Vite y React Router.

## Qué se necesita

- Node.js 22.22 o más nuevo, porque React Router 8 lo pide. Para revisar la versión: `node -v`.
- La API del proyecto prendida, con los datos de ejemplo. Los pasos están en [`../api/README.md`](../api/README.md).

## Cómo correrlo en el computador

1. En una terminal, prender la API:

   ```powershell
   cd proyecto/api
   npm run dev
   ```

   Queda en <http://localhost:3000>. Esa terminal se deja abierta.

2. Abrir otra terminal (con el botón **+** de la terminal de VS Code) y, parado en la raíz del repo:

   ```powershell
   cd proyecto/frontend-react
   npm install
   npm run dev
   ```

   `npm install` es solo la primera vez.

3. Abrir <http://localhost:5173> y entrar con un usuario de prueba.

### Con la API de Docker

Si la API prendida es la de Docker (puerto 3001), antes de `npm run dev` se escribe:

```powershell
$env:API_URL="http://localhost:3001"
npm run dev
```

`$env:API_URL` dura mientras la terminal esté abierta.

## Cómo correrlo en Docker

El frontend es el servicio `frontend` del [`docker-compose.yml`](../docker-compose.yml) del proyecto. Parado en la carpeta `proyecto`:

```powershell
docker compose up -d --build
```

Queda en <http://localhost:8080>. Los pasos completos están en [`../README.md`](../README.md).

La imagen se arma en dos etapas, como dice el `Dockerfile`:

1. Con Node se instalan las librerías y `npm run build` deja la página lista en la carpeta `dist`.
2. nginx sirve los archivos de `dist`. La imagen final no tiene Node ni el código fuente: solo `dist` y la configuración de nginx (`nginx.conf`).

## Usuarios de prueba

| Correo | Contraseña | Rol |
|---|---|---|
| `admin@cielum.test` | `Admin2026*` | admin |
| `vendedor@cielum.test` | `Vendedor2026*` | vendedor |

Son los usuarios de ejemplo de `api/db/02_datos.sql`. También salen debajo del formulario de login.

## Las páginas

| Página | Dirección | Qué hace |
|---|---|---|
| Login | `/login` | Formulario con correo y contraseña |
| Pedidos | `/pedidos` | Tabla con los pedidos, filtro por estado, cuántos pedidos ver por página y botones **Anterior** y **Siguiente** |
| Nuevo pedido | `/pedidos/nuevo` | Se escoge el cliente y uno o varios productos con su cantidad. Muestra el subtotal de cada producto y el total aproximado |
| Detalle | `/pedidos/:id` | Los datos del pedido, sus productos y un formulario para cambiarle el estado |

- Todas, menos el login, necesitan sesión. Si alguien abre `/pedidos/5` sin sesión, la página lo manda al login y, después de entrar, lo devuelve a `/pedidos/5`.
- El filtro y la página quedan en la dirección, por ejemplo `/pedidos?estado=pendiente&pagina=2&limite=10`. Así no se pierden al entrar a un pedido y volver.
- Al crear un pedido, la página va al detalle del pedido nuevo.
- Al cancelar un pedido, las unidades vuelven al stock y el pedido ya no se puede cambiar.

## Mensajes y errores

| Cuándo | Qué se ve |
|---|---|
| Mientras llegan los datos | `Cargando pedidos...` |
| La API está apagada | `La API no respondió. Revisa que esté prendida.` y el botón **Reintentar** |
| Correo o contraseña malos (401) | `Correo o contraseña incorrectos` |
| Datos que no sirven (400) | El mensaje de la API y lo que está mal en cada campo |
| El token venció (401) | Se cierra la sesión y en el login sale `Tu sesión venció. Inicia sesión otra vez.` |
| Un pedido que no existe (404) | El mensaje de la API y el enlace para volver a los pedidos |
| No hay stock suficiente (409) | El mensaje de la API, con el producto que no alcanza |
| Pedido creado | Por ejemplo `Pedido 14 creado por $ 960.000.` |
| Estado cambiado | `Estado cambiado a enviado.`, o `Pedido cancelado. Las unidades volvieron al stock.` |

Antes de mandar un pedido nuevo, la página revisa que tenga cliente, que cada línea tenga producto y que las cantidades sean mayores que 0.

## Cómo habla con la API

- Todas las peticiones van a `/api/...`, por ejemplo `/api/pedidos`.
- En el computador, Vite las pasa a la API y les quita el `/api` (`vite.config.js`): `/api/pedidos` llega a la API como `/pedidos`.
- En Docker, nginx hace lo mismo y las pasa al servicio `api` (`nginx.conf`).
- Para el navegador, la página y la API están en la misma dirección, por eso no hay problemas de CORS.

## La sesión y el token

- Al iniciar sesión, la API devuelve un token. Se guarda solo en memoria (en el estado de React, en `AuthProvider.jsx`) y no en `localStorage`, para que ningún script de la página lo pueda leer guardado en el navegador.
- Por eso, al recargar la página (F5), toca iniciar sesión otra vez.
- `useApi` le pone el token a cada petición, en el header `Authorization: Bearer ...`.
- El token dura una hora. Si la API responde 401, `useApi` cierra la sesión y la página manda al login.
- `RutaProtegida` solo esconde las páginas. La seguridad de verdad la pone la API, que revisa el token en cada petición.

## Estructura

```text
frontend-react/
├── index.html            La página base: React se dibuja dentro de <div id="root">
├── vite.config.js        Configuración de Vite: el puerto 5173 y el paso de /api a la API
├── Dockerfile            Cómo se arma la imagen de Docker (Node construye y nginx sirve)
├── nginx.conf            Configuración de nginx dentro de Docker
├── .dockerignore         Archivos que no se copian a la imagen
├── .oxlintrc.json        Reglas de oxlint, el revisor de código
├── package.json          Librerías y comandos
├── public/favicon.svg    El ícono de la pestaña
└── src/
    ├── main.jsx          Arranca React con el router y la sesión
    ├── App.jsx           Las rutas de la aplicación
    ├── index.css         Los estilos
    ├── formato.js        El formato de los pesos y la lista de estados
    ├── api/              cliente.js: pedirApi, la función que hace cada petición a la API
    ├── contexto/         La sesión (AuthProvider), compartida con toda la aplicación
    ├── hooks/            useAuth (la sesión), useApi (peticiones con el token) y useConsulta (pedir datos con carga y error)
    ├── componentes/      Piezas que se repiten: encabezado, mensajes, paginación, estado del pedido y ruta protegida
    └── paginas/          Login, Pedidos, NuevoPedido, DetallePedido y NoEncontrada
```

## Comandos

| Comando (en `proyecto/frontend-react`) | Qué hace |
|---|---|
| `npm install` | Instala las librerías (solo la primera vez) |
| `npm run dev` | Prende la página en <http://localhost:5173> y la actualiza sola al guardar cambios |
| `npm run build` | Deja la página lista para publicar, en la carpeta `dist` |
| `npm run preview` | Muestra lo que quedó en `dist`, en <http://localhost:4173> |
| `npm run lint` | Revisa el código con oxlint |

`node_modules` y `dist` no se suben a GitHub, porque están en el `.gitignore`.

## Si algo falla

| Lo que sale | Qué pasa | Qué hacer |
|---|---|---|
| `La API no respondió. Revisa que esté prendida.` | La API está apagada o está en otro puerto. En la terminal de Vite sale `http proxy error` | Prender la API con `npm run dev` en `proyecto/api`. Si es la de Docker, usar `$env:API_URL` |
| `npm WARN EBADENGINE` al hacer `npm install`, o Vite no prende | La versión de Node es muy vieja | Instalar Node 22.22 o más nuevo |
| Al recargar la página, toca iniciar sesión otra vez | Es normal: el token está solo en memoria | Volver a entrar |
| `Tu sesión venció. Inicia sesión otra vez.` | Pasó una hora desde el login | Volver a entrar |
| `port is already allocated` en Docker | Otro contenedor usa el puerto 8080, por ejemplo `mi-nginx` del día 09 | Borrarlo con `docker rm -f mi-nginx` |
