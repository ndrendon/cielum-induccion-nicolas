# Ejercicios del día 11: React

Una sola aplicación de React, hecha con Vite y React Router, con los ejercicios del día. Cada ejercicio tiene su página en el menú de arriba.

| Archivo | Para qué sirve |
|---|---|
| `src/01-basico/Contador.jsx` | **Básico.** Contador con `useState`: sumar, restar y reiniciar |
| `src/01-basico/ListaTareas.jsx` | **Básico.** Lista de tareas: agregar, marcar como hecha y borrar |
| `src/01-basico/FormularioRegistro.jsx` | **Básico.** Formulario controlado que revisa los datos antes de enviarlos |
| `src/02-intermedio/TablaProductos.jsx` | **Intermedio.** Tabla con los productos de `GET /productos`, con carga y error |
| `src/03-avanzado/useApi.js` | **Avanzado.** Custom hook que pide datos a la API con el token |
| `src/03-avanzado/RutaProtegida.jsx` | **Avanzado.** Ruta protegida: si no hay sesión, manda al login |
| `src/03-avanzado/AuthProvider.jsx`, `auth-contexto.js` y `useAuth.js` | La sesión (el token y el usuario), guardada en un Context |
| `src/03-avanzado/Login.jsx` y `Perfil.jsx` | El login y la página protegida que usa `useApi` |
| `src/App.jsx` | El menú y las rutas de los ejercicios |
| `vite.config.js` | El puerto 5174 y el paso de `/api` a la API del proyecto |

La base es la misma plantilla de Vite del reto (`npm create vite@latest`, con React y JavaScript), con `react-router` instalado.

## Cómo correrlos

Los comandos se escriben en la terminal de VS Code, parados en la **raíz del repo** (`...\cielum-induccion-nicolas>`).

1. Para el intermedio y el avanzado, prender la API del proyecto en una terminal. El básico funciona sin la API.

   ```powershell
   cd proyecto/api
   npm run dev
   ```

2. Abrir otra terminal (con el botón **+**) y, parado otra vez en la raíz del repo:

   ```powershell
   cd semana-3/react
   npm install
   npm run dev
   ```

   `npm install` es solo la primera vez.

3. Abrir <http://localhost:5174>.

Los ejercicios usan el puerto 5174 para poder tenerlos prendidos al mismo tiempo que el reto (`proyecto/frontend-react`), que usa el 5173. Si la API prendida es la de Docker (puerto 3001), antes de `npm run dev` se escribe `$env:API_URL="http://localhost:3001"`.

## Básico

### Contador (`/contador`)

- La página tiene dos contadores hechos con el mismo componente, `Contador`. Cada uno recibe props distintas (`titulo`, `paso` y `meta`) y guarda su propio número en el estado con `useState`.
- **Probar:** sumar en uno y ver que el otro no cambia. El botón de restar se apaga cuando el contador no puede bajar más de 0. Al llegar a la meta sale un mensaje verde (renderizado condicional).

### Lista de tareas (`/tareas`)

- Las tareas son un arreglo de objetos guardado en el estado. Se dibujan con `map`, y cada tarea usa su `id` como `key`.
- Para agregar, marcar o borrar, el arreglo no se cambia: se crea uno nuevo (`[...tareas, nueva]`, `map` o `filter`) y se guarda con `setTareas`.
- **Probar:** agregar una tarea con Enter o con el botón **Agregar**, marcarla (queda tachada) y borrarla. Al borrar todas sale el mensaje de lista vacía. Las tareas pendientes se cuentan solas.

### Formulario controlado (`/formulario`)

- Cada campo tiene `value`, que muestra lo que dice el estado, y `onChange`, que guarda lo que se escribe. Un solo manejador, `cambiar`, sirve para todos los campos, porque usa el `name` de cada uno.
- Al enviar, `revisar` busca los errores y los muestra debajo de cada campo. Si no hay errores, sale el mensaje de registro y el formulario se limpia.
- **Probar:** enviar el formulario vacío (salen 3 errores), escribir y mirar el cuadro **Lo que hay en el estado**, que cambia con cada letra, y corregir un campo para ver que su error se quita.

## Intermedio: tabla de productos (`/productos`)

- Al abrir la página, un `useEffect` pide `GET /api/productos`. Vite le pasa la petición a la API como `GET /productos`, que es pública y no necesita token.
- La página tiene tres estados: `cargando` (sale **Cargando productos...**), `error` (sale el mensaje y el botón **Reintentar**) y `productos` (sale la tabla).
- La limpieza del efecto (`vigente = false`) hace que se ignore una respuesta que llega cuando ya no sirve, por ejemplo si el usuario se fue de la página.
- **Probar el error:** marcar **Simular un error**, que pide una ruta que no existe (sale `La API respondió con el código 404.`), o apagar la API con `Ctrl + C` y dar **Reintentar** (sale `La API no respondió (código 502). Revisa que esté prendida.`). Al prender la API otra vez, **Reintentar** carga la tabla.
- **Probar la carga:** el mensaje **Cargando productos...** dura muy poco, porque la API está en el mismo computador. Para verlo más tiempo: F12 → pestaña **Network** → cambiar **No throttling** por **Slow 4G** y recargar la página.
- Con `npm run dev`, React corre el efecto dos veces al abrir la página (por `StrictMode`), para ayudar a encontrar limpiezas que faltan. Por eso en la pestaña **Network** salen dos peticiones a `productos`. Es normal.

## Avanzado: useApi con token y ruta protegida (`/perfil`)

- `AuthProvider.jsx` guarda la sesión (el token y el usuario) en el estado y la comparte con toda la aplicación por medio de un Context. `useAuth()` la lee desde cualquier componente.
- `Login.jsx` manda el correo y la contraseña a `POST /auth/login` y guarda el token que responde la API.
- `useApi(ruta)` es el custom hook. Pide la ruta con el header `Authorization: Bearer <token>` y devuelve `{ datos, cargando, error, recargar }`. Si la API responde 401, cierra la sesión.
- `RutaProtegida.jsx` envuelve la página del perfil: si no hay token, manda al login y recuerda que el usuario quería ir a `/perfil`.
- `Perfil.jsx` usa `useApi` dos veces: `GET /auth/perfil` (los datos que trae el token) y `GET /clientes`. Las dos rutas piden token.

**Probar:**

1. Entrar a **Perfil** sin sesión: la página manda al login.
2. Entrar con `vendedor@cielum.test` / `Vendedor2026*`: vuelve al perfil, con los datos del usuario y la lista de clientes.
3. **Usar un token falso:** la API responde 401, `useApi` cierra la sesión y la página manda al login con el aviso `Tu sesión venció o el token no sirve. Inicia sesión otra vez.`
4. **Cerrar sesión:** vuelve al login. Al recargar la página (F5) también hay que volver a entrar, porque el token se guarda solo en memoria.

En el reto, `proyecto/frontend-react`, la misma idea está partida en dos: `useApi` devuelve una función para hacer cualquier petición con el token (GET, POST o PATCH), y `useConsulta` pide los datos con carga y error.

## Comandos

| Comando (en `semana-3/react`) | Qué hace |
|---|---|
| `npm install` | Instala las librerías (solo la primera vez) |
| `npm run dev` | Prende los ejercicios en <http://localhost:5174> y los actualiza solos al guardar cambios |
| `npm run build` | Deja la aplicación lista para publicar, en la carpeta `dist` |
| `npm run lint` | Revisa el código con oxlint |

`node_modules` y `dist` no se suben a GitHub, porque están en el `.gitignore`.
