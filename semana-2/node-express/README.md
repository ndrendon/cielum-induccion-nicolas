# Ejercicios del día 07: Node.js y Express

Tres ejercicios de API REST con Express, del más sencillo al más completo.

| Archivo | Nivel | Qué hace |
|---|---|---|
| `01-basico-salud.js` | Básico | Servidor con `GET /salud`, que responde `{ estado: "ok", fecha }` |
| `02-intermedio-crud-memoria.js` | Intermedio | CRUD de productos guardados en memoria (un arreglo) |
| `03-avanzado-crud-postgres.js` | Avanzado | El mismo CRUD guardado en PostgreSQL con `pg`, validación con zod y middleware de errores |

## Qué se necesita

- Node.js 22 o más nuevo (`node -v`).
- Para el avanzado: Docker Desktop con el contenedor `pg-induccion` prendido y la base `induccion` con el modelo y los datos de la semana 1.

## Instalar

En la terminal de VS Code, parado en esta carpeta:

```powershell
cd semana-2/node-express
npm install
```

Los tres ejercicios usan el puerto 3000, así que se corren de a uno. Para apagar el que está corriendo: `Ctrl + C`.

## Básico: GET /salud

```powershell
npm run basico
```

Abrir <http://localhost:3000/salud> en el navegador. Responde:

```json
{ "estado": "ok", "fecha": "2026-10-08T19:45:07.673Z" }
```

## Intermedio: CRUD en memoria

```powershell
npm run intermedio
```

Empieza con 3 productos. Lo que se crea, cambia o borra se pierde cuando se apaga el servidor.

| Método | Ruta | Qué hace | Respuesta |
|---|---|---|---|
| GET | `/productos` | Lista los productos | `200` |
| GET | `/productos/:id` | Muestra un producto | `200`, o `404` si no existe |
| POST | `/productos` | Crea un producto | `201`, o `400` si faltan datos |
| PUT | `/productos/:id` | Cambia un producto | `200`, `400` o `404` |
| DELETE | `/productos/:id` | Borra un producto | `204`, o `404` si no existe |

Cuerpo para `POST` y `PUT`:

```json
{ "nombre": "Parlante", "categoria": "Audio", "precio": 99000, "stock": 5 }
```

La validación está hecha a mano en la función `revisarProducto`: responde `400` con el primer problema que encuentre, por ejemplo `{ "mensaje": "La categoría es obligatoria" }`.

## Avanzado: CRUD con PostgreSQL, zod y middleware de errores

1. Crear el `.env` y poner la contraseña del contenedor `pg-induccion` en `PGPASSWORD`:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Prender el servidor:

   ```powershell
   npm run avanzado
   ```

Tiene las mismas rutas del intermedio, pero los productos se guardan en la tabla `productos` de la base `induccion`, así que los cambios se ven en DBeaver y no se pierden al apagar el servidor.

Qué agrega:

- **zod**: revisa los datos que llegan y responde `400` con todos los campos que fallan:

  ```json
  {
    "mensaje": "Los datos enviados no son válidos",
    "errores": {
      "precio": ["El precio debe ser un número"],
      "stock": ["El stock no puede ser negativo"]
    }
  }
  ```

- **Consultas con parámetros** (`$1`, `$2`): los datos del usuario nunca se pegan dentro del texto del SQL.
- **Middleware de errores**: todos los errores llegan a un solo lugar, que decide el código y el mensaje:

| Caso | Respuesta |
|---|---|
| Datos inválidos (zod) | `400` con los errores de cada campo |
| JSON mal escrito | `400` |
| El producto no existe | `404` |
| La ruta no existe | `404` |
| Borrar un producto que está en algún pedido | `409` |
| Cualquier otro error | `500` (el detalle se ve en la terminal) |
