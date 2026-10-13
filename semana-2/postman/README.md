# Ejercicios del día 08: Postman

Pruebas de la API del proyecto integrador (`proyecto/api`) con Postman y con Newman.

| Archivo | Para qué sirve |
|---|---|
| `01-basico-pruebas-manuales.md` | **Básico.** Lista de todas las peticiones del día 07 para probarlas a mano, con lo que debe responder cada una |
| `dia-08-api.postman_collection.json` | **Intermedio.** Colección con todas las rutas de la API, el login que guarda el token y pruebas del código y de la estructura de cada respuesta |
| `entornos/local.postman_environment.json` | **Intermedio.** Entorno `local`: la API de `npm run dev`, en `http://localhost:3000` |
| `entornos/docker.postman_environment.json` | **Intermedio.** Entorno `docker`: la API del contenedor, en `http://localhost:3001` |
| `dia-08-lote-productos.postman_collection.json` | **Avanzado.** Colección que crea un producto por cada fila del CSV |
| `datos/productos.csv` | **Avanzado.** Los 10 productos que se crean en lote |
| `package.json` | Instala Newman y el reporte HTML, y tiene los comandos para correr las colecciones |
| `reportes/` | Ahí quedan los reportes HTML que genera Newman |

## Qué se necesita

- Postman instalado.
- La API del proyecto lista: el `.env` creado y la base con los datos de ejemplo (`npm run db:init` en `proyecto/api`). Los pasos están en el README de `proyecto/api`.
- Docker Desktop con el contenedor `pg-induccion` prendido.

## Básico: probar a mano los endpoints del día 07

Seguir la lista de [`01-basico-pruebas-manuales.md`](01-basico-pruebas-manuales.md). Cada petición se arma a mano en Postman y se revisa que el código y la respuesta sean los que dice la lista.

## Intermedio: entornos, token guardado y pruebas

### 1. Prender las dos APIs

Cada entorno apunta a una API distinta, así que se prenden las dos. En dos terminales, paradas en `proyecto/api`:

```powershell
npm run dev
```

```powershell
docker compose up -d --build
```

Para revisar que las dos respondan: <http://localhost:3000/salud> (local) y <http://localhost:3001/salud> (docker).

### 2. Importar en Postman

**Import** → arrastrar estos tres archivos:

- `dia-08-api.postman_collection.json`
- `entornos/local.postman_environment.json`
- `entornos/docker.postman_environment.json`

### 3. Escoger el entorno y correr la colección

1. Arriba a la derecha de Postman está el selector de entornos (dice **No environment**). Escoger **local**.
2. Clic derecho en la colección **Día 08 · API del proyecto (pruebas)** → **Run collection** → **Run**.
3. Deben salir 31 peticiones y todas las pruebas en verde.
4. Cambiar el entorno a **docker** y correrla otra vez. Las peticiones son las mismas: lo único que cambia es la variable `base_url`, que ahora apunta al puerto 3001.

Para ver que la petición llegó al contenedor: `docker compose logs -f` en `proyecto/api` muestra cada petición que recibe.

### Qué tiene la colección

- **Variables de entorno.** Las URLs se escriben como `{{base_url}}/productos`. El entorno `local` tiene `base_url = http://localhost:3000` y el `docker` tiene `base_url = http://localhost:3001`.
- **Login que guarda el token.** El script post-response de **Login vendedor** guarda el token en la variable `token` del entorno con `pm.environment.set`. **Login admin** lo guarda en `token_admin`. La colección usa `Bearer {{token}}` en su pestaña **Authorization**, así que todas las peticiones mandan el token solas. Para verlo: clic en el ícono del ojo, al lado del selector de entornos.
- **Pruebas del código de estado.** Cada petición revisa su código con `pm.response.to.have.status(...)`: 200, 201, 204, 400, 401, 403, 404 o 409.
- **Pruebas de la estructura.** Cada petición revisa que la respuesta traiga los campos que debe tener, con `pm.expect(...).to.have.all.keys(...)`, y algunos valores: que el precio sea número, que la fecha venga como `AAAA-MM-DD`, que el total del pedido sea la suma de los subtotales.
- **Script de la colección.** En la pestaña **Scripts** de la colección hay una prueba que se ejecuta después de **cada** petición: revisa que la respuesta sea JSON.
- **Script pre-request.** **Crear cliente** crea un correo nuevo antes de enviarse, para que no se repita, y lo guarda en la variable `email_nuevo` de la colección.
- **Variables de colección.** Los ids que se crean durante la prueba (`id_producto`, `id_cliente`, `id_pedido`) se guardan en variables de la colección, para usarlos en las peticiones siguientes.

La colección deja la base como estaba: borra el producto, el cliente y el pedido que crea.

## Avanzado: lote con CSV, Newman y reporte HTML

### Crear los 10 productos en lote desde Postman

1. Importar `dia-08-lote-productos.postman_collection.json`.
2. Escoger el entorno **local**.
3. Clic derecho en la colección **Día 08 · Lote de productos (CSV)** → **Run collection**.
4. En **Data** → **Select File**, escoger `datos/productos.csv`. Postman muestra que son 10 iteraciones; con **Preview** se ven las filas.
5. Clic en **Run**.

Cada fila del CSV es una vuelta (iteración). En cada vuelta se hace login y se crea un producto con los valores de esa fila: el cuerpo de la petición usa `{{nombre}}`, `{{categoria}}`, `{{precio}}` y `{{stock}}`, que son las columnas del CSV. La prueba revisa con `pm.iterationData` que el producto creado tenga los datos de su fila.

Cada vez que se corre el lote se crean 10 productos más. Para volver a los datos de ejemplo: `npm run db:init` en `proyecto/api`.

### Correr con Newman y generar el reporte HTML

Newman corre las colecciones desde la terminal, sin abrir Postman. En una terminal parada en `semana-2/postman`:

```powershell
npm install
npm run lote
```

`npm install` instala Newman y el reporte HTML (solo la primera vez). `npm run lote` crea los 10 productos y genera el reporte en `reportes/reporte-lote-productos.html`. El reporte se abre con doble clic, en el navegador; necesita internet para cargar sus estilos.

| Comando | Qué hace |
|---|---|
| `npm run lote` | Corre el lote con el CSV en el entorno `local` y genera `reportes/reporte-lote-productos.html` |
| `npm run probar:local` | Corre la colección completa en el entorno `local` |
| `npm run probar:docker` | Corre la colección completa en el entorno `docker` |
| `npm run reporte` | Corre la colección completa en `local` y genera `reportes/reporte-api.html` |

Cada comando es un `newman run` con sus opciones, escrito en el `package.json`. Por ejemplo, `npm run lote` ejecuta:

```powershell
newman run dia-08-lote-productos.postman_collection.json -e entornos/local.postman_environment.json -d datos/productos.csv -r cli,htmlextra --reporter-htmlextra-export reportes/reporte-lote-productos.html
```

- `-e`: el entorno que se usa.
- `-d`: el archivo de datos (una iteración por fila).
- `-r cli,htmlextra`: muestra el resultado en la terminal y además genera el reporte HTML.
- `--reporter-htmlextra-export`: dónde se guarda el reporte.

## Si algo falla

| Lo que sale | Qué pasa | Qué hacer |
|---|---|---|
| `ECONNREFUSED` con el puerto 3000 | La API de `npm run dev` está apagada | `npm run dev` en `proyecto/api` |
| `ECONNREFUSED` con el puerto 3001 | El contenedor de la API está apagado | `docker compose up -d --build` en `proyecto/api` |
| Las URLs salen con `{{base_url}}` sin cambiar | No hay un entorno escogido | Escoger `local` o `docker` arriba a la derecha |
| Todas las rutas protegidas responden 401 | No se ha hecho login, o el token tiene más de una hora | Enviar **Login vendedor** y **Login admin** otra vez |
| El lote responde 400 | Se envió la petición del lote sin el CSV, así que `{{nombre}}` y las demás variables no existen | Correrla con el Collection Runner o con `npm run lote`, escogiendo el CSV |
