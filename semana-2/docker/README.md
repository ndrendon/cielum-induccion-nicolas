# Ejercicios del día 09: Docker

| Archivo | Para qué sirve |
|---|---|
| `Dockerfile.intermedio` | **Intermedio.** Dockerfile sencillo para la API del proyecto |
| `Dockerfile.avanzado` | **Avanzado.** Dockerfile mejorado: multi-stage, usuario no root y healthcheck |
| `.env.example` | Plantilla de las variables que necesitan los contenedores de la API |

Todos los comandos se escriben en la terminal de VS Code, parados en la **raíz del repo** (`...\cielum-induccion-nicolas>`), con Docker Desktop prendido.

## Básico: nginx, logs, exec y borrar todo

1. Descargar la imagen y prender un contenedor:

   ```powershell
   docker pull nginx
   docker run -d --name mi-nginx -p 8080:80 nginx
   docker ps
   ```

   - `-d` deja el contenedor corriendo por detrás.
   - `--name` le pone un nombre.
   - `-p 8080:80` conecta el puerto 8080 del computador con el 80 del contenedor, que es donde escucha nginx.

   En <http://localhost:8080> sale la página "Welcome to nginx!".

2. Ver los logs: `docker logs mi-nginx`. Sale una línea por cada vez que se abrió la página.

3. Entrar al contenedor con `exec`:

   ```powershell
   docker exec -it mi-nginx sh
   ```

   `-it` deja escribir comandos adentro. Ya dentro del contenedor:

   ```sh
   ls /usr/share/nginx/html
   echo "<h1>Hola desde el contenedor</h1>" > /usr/share/nginx/html/index.html
   exit
   ```

   Al recargar la página, sale el texto nuevo.

4. Borrar todo:

   ```powershell
   docker stop mi-nginx
   docker rm mi-nginx
   docker rmi nginx
   docker ps -a
   docker images
   ```

   `mi-nginx` ya no sale en `docker ps -a`, ni `nginx` en `docker images`. El cambio que se hizo en la página se perdió con el contenedor, porque no estaba en un volumen.

## Antes del intermedio y el avanzado: el `.env`

Los contenedores de la API necesitan la contraseña de PostgreSQL y el secreto del JWT:

```powershell
Copy-Item semana-2/docker/.env.example semana-2/docker/.env
code semana-2/docker/.env
```

En `PGPASSWORD` y `JWT_SECRET` se ponen los mismos valores del archivo `proyecto/api/.env`. Este `.env` usa `PGHOST=host.docker.internal`, que es la dirección del computador vista desde un contenedor, para llegar a la base `proyecto` de `pg-induccion`. El contenedor `pg-induccion` debe estar prendido.

## Intermedio: Dockerfile para la API, construir y correr la imagen

1. Construir la imagen:

   ```powershell
   docker build -f semana-2/docker/Dockerfile.intermedio -t api:intermedio proyecto/api
   ```

   - `-f` dice qué Dockerfile usar.
   - `-t api:intermedio` le pone nombre a la imagen: `api` es el nombre y `intermedio` la etiqueta.
   - `proyecto/api` es la carpeta con el código que se copia a la imagen.

2. Correr la imagen:

   ```powershell
   docker run -d --name api-intermedio -p 3002:3000 --env-file semana-2/docker/.env api:intermedio
   ```

   `--env-file` le pasa al contenedor las variables del `.env`.

3. Probarla: <http://localhost:3002/salud> responde `{"estado":"ok",...}`. Con `docker logs api-intermedio` se ven las peticiones que llegan.

4. Ver con qué usuario corre la API: `docker exec api-intermedio whoami` responde `root`.

## Avanzado: multi-stage, usuario no root y healthcheck

1. Construir y correr la imagen mejorada:

   ```powershell
   docker build -f semana-2/docker/Dockerfile.avanzado -t api:avanzado proyecto/api
   docker run -d --name api-avanzado -p 3003:3000 --env-file semana-2/docker/.env api:avanzado
   ```

2. Probarla: <http://localhost:3003/salud>.

3. **Healthcheck:** con `docker ps`, a los pocos segundos la columna STATUS dice `(healthy)`. Para ver las últimas revisiones:

   ```powershell
   docker inspect --format "{{json .State.Health}}" api-avanzado
   ```

4. **Usuario no root:** `docker exec api-avanzado whoami` responde `node`.

5. **Comparar el tamaño de las dos imágenes:**

   ```powershell
   docker images api
   ```

   Salen `api:intermedio` y `api:avanzado` con su tamaño. La intermedia pesa más de 1 GB y la avanzada menos de 200 MB, aproximadamente. La diferencia sale de tres cosas:

   | | Intermedio | Avanzado |
   |---|---|---|
   | Imagen base | `node:24` completa, con muchos programas que la API no usa | `node:24-alpine`, solo lo mínimo |
   | Librerías | Todas, también las de pruebas | Solo las de producción (`npm ci --omit=dev`) |
   | Etapas | Una: lo que se usó para instalar queda en la imagen | Dos: la imagen final solo copia `node_modules` y `src` |
   | Usuario | `root` | `node` |
   | Healthcheck | No tiene | Revisa `/salud` cada 10 segundos |

6. Al terminar, borrar los contenedores y las imágenes de los ejercicios:

   ```powershell
   docker rm -f api-intermedio api-avanzado
   docker rmi api:intermedio api:avanzado
   ```

   `docker rm -f` apaga y borra el contenedor en un solo paso.

La API del proyecto (`proyecto/api/Dockerfile`) ya usa `node:24-alpine`, `npm ci --omit=dev` y el usuario `node`; el healthcheck se lo pone el `docker-compose.yml` del proyecto.
