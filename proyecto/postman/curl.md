# Los 3 endpoints principales con curl

curl es un programa de la terminal que manda peticiones HTTP, sin abrir Postman. Aquí están los tres endpoints principales de la API, los mismos de la colección:

1. `POST /auth/login`: iniciar sesión y recibir el token.
2. `GET /pedidos?estado=&pagina=&limite=`: listar los pedidos con filtro y paginación.
3. `POST /pedidos`: crear un pedido con su detalle.

## Antes de empezar

- La API debe estar prendida: `npm run dev` en `proyecto/api`.
- Los comandos se escriben en la terminal de VS Code (PowerShell), parados en `proyecto/postman`. Ahí está la carpeta `curl/`, con los cuerpos JSON que se mandan.
- En PowerShell se escribe **`curl.exe`** y no solo `curl`, porque en Windows PowerShell la palabra `curl` abre otro comando (`Invoke-WebRequest`), que no recibe las mismas opciones. `curl.exe` viene instalado en Windows.

Las opciones de curl que se usan:

| Opción | Para qué sirve |
|---|---|
| `-X POST` | El método de la petición. Si no se pone, curl usa `GET` |
| `-H "..."` | Agrega un header, por ejemplo el tipo de contenido o el token |
| `--data-binary "@archivo.json"` | Manda como cuerpo el contenido del archivo. El `@` le dice a curl que es un archivo |
| `-i` | Muestra también el código de estado y los headers de la respuesta |
| `-s` | No muestra la barra de progreso |

Los cuerpos van en archivos porque PowerShell cambia las comillas de un JSON escrito dentro del comando, y la API lo recibe mal escrito.

## 1. Login: `POST /auth/login`

```powershell
curl.exe -i -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" --data-binary "@curl/login.json"
```

`curl/login.json` tiene el correo y la contraseña del vendedor de prueba. Responde **200** con el token y el usuario:

```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","usuario":{"id_usuario":2,"nombre":"Vendedor","email":"vendedor@cielum.test","rol":"vendedor"}}
```

Para no copiar el token a mano, se guarda en una variable de PowerShell. `ConvertFrom-Json` convierte la respuesta en un objeto y `.token` toma solo el token:

```powershell
$token = (curl.exe -s -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" --data-binary "@curl/login.json" | ConvertFrom-Json).token
$token
```

La variable `$token` dura mientras la terminal esté abierta. Si se cierra la terminal, o el token cumple una hora, se vuelve a correr ese comando.

Caso de error, con la contraseña mala (`curl/login-contrasena-mala.json`):

```powershell
curl.exe -i -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" --data-binary "@curl/login-contrasena-mala.json"
```

```text
HTTP/1.1 401 Unauthorized

{"mensaje":"Correo o contraseña incorrectos"}
```

## 2. Listar pedidos con filtros: `GET /pedidos`

```powershell
curl.exe -i "http://localhost:3000/pedidos?estado=pendiente&pagina=1&limite=2" -H "Authorization: Bearer $token"
```

- La URL va entre comillas porque tiene `&`, que en PowerShell tiene otro significado.
- El token va en el header `Authorization`, después de la palabra `Bearer`. PowerShell cambia `$token` por su valor.

Responde **200** con máximo 2 pedidos pendientes y los datos de la paginación:

```text
HTTP/1.1 200 OK

{"datos":[{"id_pedido":12,"fecha":"2026-10-01","estado":"pendiente","id_cliente":1,"cliente":"Ana Gómez","total":785000},{"id_pedido":11,"fecha":"2026-09-28","estado":"pendiente","id_cliente":3,"cliente":"Sofía Ruiz","total":540000}],"pagina":1,"limite":2,"total":3,"totalPaginas":2}
```

Caso de error, sin el token:

```powershell
curl.exe -i "http://localhost:3000/pedidos?estado=pendiente&pagina=1&limite=2"
```

```text
HTTP/1.1 401 Unauthorized

{"mensaje":"Debes iniciar sesión para usar esta ruta"}
```

## 3. Crear un pedido: `POST /pedidos`

```powershell
curl.exe -i -X POST http://localhost:3000/pedidos -H "Content-Type: application/json" -H "Authorization: Bearer $token" --data-binary "@curl/pedido.json"
```

`curl/pedido.json` tiene el cliente 9 y dos productos: 2 memorias USB y 1 silla. Responde **201** con el pedido creado, su detalle y el total:

```text
HTTP/1.1 201 Created

{"id_pedido":13,"fecha":"2026-10-09","estado":"pendiente","id_cliente":9,"cliente":"Andrés López","total":960000,"detalle":[{"id_producto":8,"producto":"Memoria USB 64 GB","cantidad":2,"precio_unitario":35000,"subtotal":70000},{"id_producto":9,"producto":"Silla ergonómica","cantidad":1,"precio_unitario":890000,"subtotal":890000}]}
```

Caso de error, un pedido sin productos (`curl/pedido-sin-productos.json`):

```powershell
curl.exe -i -X POST http://localhost:3000/pedidos -H "Content-Type: application/json" -H "Authorization: Bearer $token" --data-binary "@curl/pedido-sin-productos.json"
```

```text
HTTP/1.1 400 Bad Request

{"mensaje":"Los datos enviados no son válidos","errores":{"detalle":["El pedido debe tener al menos un producto"]}}
```

## Notas

- El `id_pedido`, la fecha y los totales pueden cambiar según los datos que tenga la base. Para volver a los datos de ejemplo: `npm run db:init` en `proyecto/api`.
- Si las tildes salen raras en la terminal (por ejemplo `AndrÃ©s`), es la forma en que la consola muestra el texto; los datos están bien. Se arregla escribiendo una vez `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8` en esa terminal.
- Para probar contra la API de Docker, se cambia el puerto `3000` por `3001` en las URLs.
