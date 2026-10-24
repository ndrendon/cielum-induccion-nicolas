# Frontend del proyecto integrador en Vue (parte 5)

Página web en Vue para manejar los pedidos de la tienda. Tiene las mismas funciones que la de React (`../frontend-react`): se inicia sesión, se ven los pedidos con filtros y paginación, se crean pedidos con varios productos y se les cambia el estado. Usa la misma API, `proyecto/api`.

Está hecha con Vue 3, Vite, Vue Router y Pinia. El proyecto se creó con `npm create vue@latest` (con Router, Pinia y ESLint) y se le quitó el código de ejemplo. La comparación entre las dos páginas está en [`../../docs/react-vs-vue.md`](../../docs/react-vs-vue.md).

## Qué se necesita

- Node.js 22 (22.18 o más nuevo) o Node.js 24 (24.12 o más nuevo). Para revisar la versión: `node -v`.
- La API del proyecto prendida, con los datos de ejemplo. Los pasos están en [`../api/README.md`](../api/README.md).
- En VS Code, la extensión **Vue (Official)**, para que los archivos `.vue` se vean con colores y avise los errores. Se instala en Extensiones (`Ctrl + Shift + X`), buscando `Vue (Official)`.

## Cómo correrlo en el computador

1. En una terminal, prender la API:

   ```powershell
   cd proyecto/api
   npm run dev
   ```

   Queda en <http://localhost:3000>. Esa terminal se deja abierta.

2. Abrir otra terminal (con el botón **+** de la terminal de VS Code) y, parado en la raíz del repo:

   ```powershell
   cd proyecto/frontend-vue
   npm install
   npm run dev
   ```

   `npm install` es solo la primera vez.

3. Abrir <http://localhost:5175> y entrar con un usuario de prueba.

Usa el puerto 5175 para poder tenerla prendida al mismo tiempo que la de React (5173). Abajo, en la mitad de la página, sale un botón pequeño: abre **Vue DevTools**, donde se ven los componentes, el store de Pinia con el token y las rutas. Solo sale con `npm run dev`.

### Con la API de Docker

Si la API prendida es la de Docker (puerto 3001), antes de `npm run dev` se escribe:

```powershell
$env:API_URL="http://localhost:3001"
npm run dev
```

`$env:API_URL` dura mientras la terminal esté abierta.

## Cómo correrlo en Docker

El frontend es el servicio `frontend-vue` del [`docker-compose.yml`](../docker-compose.yml) del proyecto. Parado en la carpeta `proyecto`:

```powershell
docker compose up -d --build
```

Queda en <http://localhost:8082>. Los pasos completos están en [`../README.md`](../README.md).

La imagen se arma en dos etapas, como dice el `Dockerfile`, igual que la de React:

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

- Todas, menos el login, necesitan sesión. Si alguien abre `/pedidos/5` sin sesión, la guarda del router lo manda a `/login?desde=/pedidos/5` y, después de entrar, lo devuelve a `/pedidos/5`.
- El filtro y la página quedan en la dirección, por ejemplo `/pedidos?estado=pendiente&pagina=2&limite=10`. Así no se pierden al entrar a un pedido y volver.
- Al crear un pedido, la página va al detalle del pedido nuevo.
- Al cancelar un pedido, las unidades vuelven al stock y el pedido ya no se puede cambiar.

## Mensajes y errores

Son los mismos de la página en React:

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

Antes de mandar un pedido nuevo, la página revisa que tenga cliente, que cada línea tenga producto y que las cantidades sean números enteros mayores que 0.

## Cómo está hecho

- **Componentes de archivo único:** cada componente y cada página es un archivo `.vue` con su `<template>`, su `<script setup>` y, si los necesita, sus estilos en `<style scoped>`.
- **La sesión está en un store de Pinia** (`stores/sesion.js`): el token, el usuario y las acciones `iniciarSesion` y `cerrarSesion`. El token se guarda solo en memoria y no en `localStorage`, para que ningún script de la página lo pueda leer guardado en el navegador. Por eso, al recargar la página (F5), toca iniciar sesión otra vez.
- **La guarda del router** (`router/index.js`) revisa, antes de cada cambio de página, si la página pide sesión (`meta.requiereSesion`) y si hay token. Si no hay, manda al login.
- **El `watch` de `App.vue`** vigila el token: si la sesión se cierra estando en una página que la pide (con el botón **Cerrar sesión** o porque la API respondió 401), manda al login.
- **Composables:** `useApi` le pone el token a cada petición y cierra la sesión si la API responde 401. `useConsulta` pide datos con carga y error, y vuelve a pedir cuando cambia la ruta, por ejemplo al cambiar un filtro.
- **Cómo habla con la API:** todas las peticiones van a `/api/...`. En el computador, Vite las pasa a la API y les quita el `/api` (`vite.config.js`); en Docker lo hace nginx (`nginx.conf`). Para el navegador, la página y la API están en la misma dirección, por eso no hay problemas de CORS.
- La guarda solo esconde las páginas. La seguridad de verdad la pone la API, que revisa el token en cada petición.

## Estructura

```text
frontend-vue/
├── index.html              La página base: Vue se dibuja dentro de <div id="app">
├── vite.config.js          Configuración de Vite: el puerto 5175, el paso de /api a la API y el atajo @ para src
├── Dockerfile              Cómo se arma la imagen de Docker (Node construye y nginx sirve)
├── nginx.conf              Configuración de nginx dentro de Docker
├── .dockerignore           Archivos que no se copian a la imagen
├── eslint.config.js        Reglas de ESLint, que revisa también el <template>
├── .oxlintrc.json          Reglas de oxlint, el otro revisor de código
├── jsconfig.json           Le dice a VS Code que @ es la carpeta src
├── package.json            Librerías y comandos
├── public/favicon.ico      El ícono de la pestaña
└── src/
    ├── main.js             Crea la aplicación y le instala Pinia y el router
    ├── App.vue             El encabezado, el lugar de las páginas (RouterView) y el watch de la sesión
    ├── estilos.css         Los estilos generales
    ├── formato.js          El formato de los pesos y la lista de estados
    ├── api/                cliente.js: pedirApi, la función que hace cada petición a la API
    ├── router/             index.js: las rutas y la guarda de navegación
    ├── stores/             sesion.js: el store de Pinia con el token y el usuario
    ├── composables/        useApi (peticiones con el token) y useConsulta (pedir datos con carga y error)
    ├── componentes/        Piezas que se repiten: encabezado, mensajes, paginación y estado del pedido
    └── paginas/            PaginaLogin, PaginaPedidos, PaginaNuevoPedido, PaginaDetallePedido y PaginaNoEncontrada
```

Los nombres de los componentes tienen dos palabras (por ejemplo `CajaMensaje` y no `Mensaje`), porque así lo pide la guía de estilo de Vue y lo revisa ESLint.

## Comandos

| Comando (en `proyecto/frontend-vue`) | Qué hace |
|---|---|
| `npm install` | Instala las librerías (solo la primera vez) |
| `npm run dev` | Prende la página en <http://localhost:5175> y la actualiza sola al guardar cambios |
| `npm run build` | Deja la página lista para publicar, en la carpeta `dist` |
| `npm run preview` | Muestra lo que quedó en `dist`, en <http://localhost:4173> |
| `npm run lint` | Revisa el código con oxlint y ESLint, y arregla solo lo que puede |

`node_modules` y `dist` no se suben a GitHub, porque están en el `.gitignore`.

## Si algo falla

| Lo que sale | Qué pasa | Qué hacer |
|---|---|---|
| `La API no respondió. Revisa que esté prendida.` | La API está apagada o está en otro puerto. En la terminal de Vite sale `http proxy error` | Prender la API con `npm run dev` en `proyecto/api`. Si es la de Docker, usar `$env:API_URL` |
| `Error interno del servidor` al iniciar sesión | La API está prendida, pero no se puede conectar a la base. En la terminal de la API sale `ECONNREFUSED` | Prender la base: `docker compose up -d postgres` en `proyecto` |
| `npm WARN EBADENGINE` al hacer `npm install`, o Vite no prende | La versión de Node es muy vieja | Instalar Node 24 (24.12 o más nuevo) |
| Los archivos `.vue` se ven sin colores en VS Code | Falta la extensión | Instalar **Vue (Official)** |
| Al recargar la página, toca iniciar sesión otra vez | Es normal: el token está solo en memoria | Volver a entrar |
| `port is already allocated` en Docker | Otro contenedor usa el puerto 8082 | Ver cuál es con `docker ps` y apagarlo |
