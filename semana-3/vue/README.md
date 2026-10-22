# Ejercicios del día 12: Vue

Una sola aplicación de Vue, hecha con Vite, Vue Router y Pinia, con los ejercicios del día. Cada ejercicio tiene su página en el menú de arriba.

| Archivo | Para qué sirve |
|---|---|
| `src/01-basico/ListaTareas.vue` | **Básico.** Lista de tareas con `v-for` y `v-model`: agregar, marcar, filtrar y borrar |
| `src/01-basico/TareaItem.vue` | **Básico.** Una fila de la lista: recibe la tarea por props y avisa con emits |
| `src/02-intermedio/TablaProductos.vue` | **Intermedio.** Tabla con los productos de `GET /productos`, con carga y error |
| `src/03-avanzado/sesion.js` | **Avanzado.** Store de Pinia con el usuario y el token |
| `src/03-avanzado/guardaSesion.js` | **Avanzado.** Guarda de ruta: si no hay sesión, manda al login |
| `src/03-avanzado/useApi.js` | **Avanzado.** Composable que pide datos a la API con el token del store |
| `src/03-avanzado/PaginaLogin.vue` y `PerfilUsuario.vue` | El login y la página protegida que usa `useApi` |
| `src/router/index.js` | Las rutas de los ejercicios; registra la guarda con `router.beforeEach` |
| `src/App.vue` | El menú, el lugar de las páginas (`RouterView`) y el `watch` de la sesión |
| `vite.config.js` | El puerto 5176 y el paso de `/api` a la API del proyecto |

El proyecto se creó con `npm create vue@latest` (con Router, Pinia y ESLint), igual que el reto (`proyecto/frontend-vue`), y se le quitó el código de ejemplo.

## Cómo correrlos

Los comandos se escriben en la terminal de VS Code, parados en la **raíz del repo** (`...\cielum-induccion-nicolas>`).

1. Para el intermedio y el avanzado, prender la API del proyecto en una terminal. El básico funciona sin la API.

   ```powershell
   cd proyecto/api
   npm run dev
   ```

2. Abrir otra terminal (con el botón **+**) y, parado otra vez en la raíz del repo:

   ```powershell
   cd semana-3/vue
   npm install
   npm run dev
   ```

   `npm install` es solo la primera vez.

3. Abrir <http://localhost:5176>.

Los ejercicios usan el puerto 5176 para poder tenerlos prendidos al mismo tiempo que el reto en Vue, que usa el 5175. Si la API prendida es la de Docker (puerto 3001), antes de `npm run dev` se escribe `$env:API_URL="http://localhost:3001"`.

Para ver los archivos `.vue` con colores en VS Code, hay que instalar la extensión **Vue (Official)**.

## Básico: lista de tareas (`/tareas`)

- Las tareas son un arreglo de objetos guardado en un `ref`. `v-for` dibuja un `TareaItem` por cada tarea, con su `id` como `:key`.
- `v-model` conecta el campo de texto con la variable `nueva`: debajo del campo se ve cómo cambia con cada letra. También conecta el casillero **Mostrar solo las pendientes** con `soloPendientes`.
- `computed` calcula cuántas tareas faltan y cuáles se ven según el casillero. `watch` vigila las pendientes y felicita cuando llegan a 0.
- **Props y emits:** `TareaItem.vue` recibe la tarea por props y no la cambia. Cuando el usuario la marca o la borra, avisa con los eventos `cambiar` y `borrar`, y `ListaTareas.vue`, que es el dueño de la lista, hace el cambio.
- `v-if` y `v-else` muestran la lista o el mensaje de lista vacía. `v-show` esconde el botón **Borrar las hechas** cuando no hay tareas hechas: el botón sigue en la página, solo se oculta con CSS.
- `@submit.prevent` agrega la tarea con Enter o con **Agregar**, sin recargar la página. `:class` le pone la clase `hecha` a las tareas marcadas.
- **Probar:** agregar una tarea, marcar todas para ver la felicitación, marcar **Mostrar solo las pendientes**, y borrar.

## Intermedio: tabla de productos (`/productos`)

- Cuando la página ya está en pantalla, `onMounted` pide `GET /api/productos`. Vite le pasa la petición a la API como `GET /productos`, que es pública y no necesita token.
- La página muestra **Cargando productos...**, el error con el botón **Reintentar**, o la tabla.
- `onUnmounted` marca que la página ya no está en pantalla, para ignorar una respuesta que llegue tarde. `computed` cuenta los productos con poco stock.
- **Probar el error:** marcar **Simular un error**, que pide una ruta que no existe (sale `La API respondió con el código 404.`); un `watch` vuelve a pedir cada vez que cambia el casillero. También se puede apagar la API con `Ctrl + C` y dar **Reintentar** (sale `La API no respondió (código 502). Revisa que esté prendida.`).
- **Probar la carga:** el mensaje **Cargando productos...** dura muy poco, porque la API está en el mismo computador. Para verlo más tiempo: F12 → pestaña **Network** → cambiar **No throttling** por **Slow 4G** y recargar la página.

## Avanzado: store de Pinia y guarda de ruta (`/perfil`)

- `sesion.js` es un store de Pinia de tipo setup: los `ref` (`token`, `usuario`, `aviso`) son el estado, `haySesion` es un getter (`computed`) y `iniciarSesion`, `cerrarSesion` y `usarTokenFalso` son las acciones. Cualquier componente lo usa con `useSesionStore()`, por ejemplo el encabezado, que muestra **Sesión: Vendedor** o **Sin sesión**.
- `PaginaLogin.vue` manda el correo y la contraseña a `POST /auth/login`, y el store guarda el token que responde la API.
- `guardaSesion.js` es la guarda de ruta. `router/index.js` la registra con `router.beforeEach`, así que corre antes de cada cambio de página: si la página lleva `meta.requiereSesion` y no hay token, manda al login con `?desde=/perfil`, para volver ahí después de entrar.
- `useApi(ruta)` es un composable: pide la ruta con el header `Authorization: Bearer <token>` y devuelve `{ datos, cargando, error, recargar }`. Si la API responde 401, cierra la sesión.
- `PerfilUsuario.vue` usa `useApi` dos veces: `GET /auth/perfil` y `GET /clientes`. Las dos rutas piden token. Saca el usuario del store con `storeToRefs`, para no perder la reactividad.
- La guarda solo corre al cambiar de página. Por eso `App.vue` tiene un `watch` del token: si la sesión se cierra estando en el perfil, manda al login.

**Probar:**

1. Entrar a **Perfil** sin sesión: la guarda manda al login.
2. Entrar con `vendedor@cielum.test` / `Vendedor2026*`: vuelve al perfil, con los datos del usuario y la lista de clientes. El encabezado dice **Sesión: Vendedor**.
3. Ir a **Tareas** y volver a **Perfil**: no pide entrar otra vez, porque el store guarda la sesión mientras la página esté abierta.
4. **Usar un token falso:** la API responde 401, `useApi` cierra la sesión y la página manda al login con el aviso `Tu sesión venció o el token no sirve. Inicia sesión otra vez.`
5. **Cerrar sesión:** vuelve al login. Al recargar la página (F5) también hay que volver a entrar, porque el token se guarda solo en memoria.

Con `npm run dev`, el botón pequeño de abajo abre **Vue DevTools**. En la pestaña **Pinia** se ve el store `sesion` con el token, y cómo cambia al entrar y al salir.

En el reto, `proyecto/frontend-vue`, la misma idea está partida en dos: `useApi` devuelve una función para hacer cualquier petición con el token (GET, POST o PATCH), y `useConsulta` pide los datos con carga y error.

## Comandos

| Comando (en `semana-3/vue`) | Qué hace |
|---|---|
| `npm install` | Instala las librerías (solo la primera vez) |
| `npm run dev` | Prende los ejercicios en <http://localhost:5176> y los actualiza solos al guardar cambios |
| `npm run build` | Deja la aplicación lista para publicar, en la carpeta `dist` |
| `npm run lint` | Revisa el código con oxlint y ESLint, y arregla solo lo que puede |

`node_modules` y `dist` no se suben a GitHub, porque están en el `.gitignore`.
