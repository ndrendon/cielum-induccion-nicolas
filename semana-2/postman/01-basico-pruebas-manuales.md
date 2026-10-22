# Básico: probar a mano todos los endpoints del día 07

En este ejercicio cada petición se arma a mano en Postman, sin variables ni scripts, para ver bien cada parte: el método, la URL, el cuerpo y el token.

## Cómo hacerlo

1. En Postman, crear una colección nueva: **New → Collection**, con el nombre `Día 07 - pruebas manuales`.
2. Dentro de la colección, crear una carpeta por cada servidor (clic derecho en la colección → **Add folder**): `Ejercicio básico`, `Ejercicio intermedio`, `Ejercicio avanzado` y `API del proyecto`.
3. Para cada petición de las listas de abajo:
   1. Clic derecho en la carpeta → **Add request**, y ponerle un nombre.
   2. Escoger el método (`GET`, `POST`, `PUT`, `PATCH` o `DELETE`) y escribir la URL.
   3. Si la petición lleva cuerpo: pestaña **Body** → **raw** → **JSON**, y pegar el cuerpo.
   4. Si la petición necesita token: pestaña **Authorization** → **Bearer Token**, y pegar el token (solo el texto largo, sin la palabra `Bearer`).
   5. Clic en **Send**.
   6. Revisar el código que sale arriba de la respuesta (por ejemplo `200 OK`) y lo que respondió. Si es lo que dice la lista, marcar la casilla: cambiar `[ ]` por `[x]` en este archivo.
   7. Guardar la petición con `Ctrl + S`.

Todos los servidores usan el puerto 3000, así que se prenden de a uno. Para apagar el que está corriendo: `Ctrl + C` en su terminal.

## 1. Ejercicio básico

En la terminal: `cd semana-2/node-express` y `npm run basico`.

- [ ] **GET** `http://localhost:3000/salud` → **200** con `"estado": "ok"` y la fecha.

## 2. Ejercicio intermedio (productos en memoria)

En la terminal: `npm run intermedio`. Empieza con 3 productos; si se apaga y se vuelve a prender, vuelven los 3 del principio.

- [ ] **GET** `http://localhost:3000/productos` → **200** con la lista de 3 productos.
- [ ] **GET** `http://localhost:3000/productos/1` → **200** con el Teclado mecánico.
- [ ] **GET** `http://localhost:3000/productos/99` → **404** con `"Producto no encontrado"`.
- [ ] **POST** `http://localhost:3000/productos` con el cuerpo `{"nombre": "Parlante", "categoria": "Audio", "precio": 99000, "stock": 5}` → **201** con el producto nuevo y `"id": 4`.
- [ ] **POST** `http://localhost:3000/productos` con el cuerpo `{"nombre": "Parlante"}` → **400** con `"La categoría es obligatoria"`.
- [ ] **PUT** `http://localhost:3000/productos/4` con el cuerpo `{"nombre": "Parlante BT", "categoria": "Audio", "precio": 109000, "stock": 4}` → **200** con los cambios.
- [ ] **DELETE** `http://localhost:3000/productos/4` → **204**, sin cuerpo.
- [ ] **GET** `http://localhost:3000/productos/4` → **404**, porque ya se borró.

## 3. Ejercicio avanzado (productos en PostgreSQL)

En la terminal: `npm run avanzado`, con el contenedor `pg-induccion` prendido. Usa la tabla `productos` de la base `induccion`.

- [ ] **GET** `http://localhost:3000/productos` → **200** con los productos de la tabla.
- [ ] **GET** `http://localhost:3000/productos/1` → **200** con el Teclado mecánico.
- [ ] **GET** `http://localhost:3000/productos/abc` → **400** con `"El id debe ser un número"` en `errores.id`.
- [ ] **GET** `http://localhost:3000/productos/999` → **404** con `"Producto no encontrado"`.
- [ ] **POST** `http://localhost:3000/productos` con el cuerpo `{"nombre": "Parlante", "categoria": "Audio", "precio": 99000, "stock": 5}` → **201**. Anotar el `id_producto` que devuelve.
- [ ] **POST** `http://localhost:3000/productos` con el cuerpo `{"nombre": "", "precio": "caro", "stock": -1}` → **400** con un error para `nombre`, `categoria`, `precio` y `stock`.
- [ ] **POST** `http://localhost:3000/productos` con el cuerpo mal escrito `{"nombre":` → **400** con `"El cuerpo de la petición no es un JSON válido"`.
- [ ] **PUT** `http://localhost:3000/productos/ID` (cambiar `ID` por el número anotado) con el cuerpo `{"nombre": "Parlante BT", "categoria": "Audio", "precio": 109000, "stock": 4}` → **200** con los cambios.
- [ ] **DELETE** `http://localhost:3000/productos/ID` → **204**, sin cuerpo.
- [ ] **DELETE** `http://localhost:3000/productos/1` → **409** con `"No se puede borrar el producto porque ya está en pedidos"`.
- [ ] **GET** `http://localhost:3000/nada` → **404** con `"No existe la ruta GET /nada"`.

## 4. API del proyecto

En la terminal: `cd proyecto/api`, `npm run db:init` (para empezar con los datos de ejemplo, así los números de abajo coinciden) y `npm run dev`.

### Salud y login

- [ ] **GET** `http://localhost:3000/salud` → **200** con `"estado": "ok"`.
- [ ] **POST** `http://localhost:3000/auth/login` con el cuerpo `{"email": "vendedor@cielum.test", "password": "Vendedor2026*"}` → **200** con el `token` y el usuario. Copiar el token: es el **token del vendedor**.
- [ ] **POST** `http://localhost:3000/auth/login` con el cuerpo `{"email": "admin@cielum.test", "password": "Admin2026*"}` → **200**. Copiar el token: es el **token del admin**.
- [ ] **POST** `http://localhost:3000/auth/login` con el cuerpo `{"email": "vendedor@cielum.test", "password": "otra"}` → **401** con `"Correo o contraseña incorrectos"`.
- [ ] **GET** `http://localhost:3000/auth/perfil` con el token del vendedor → **200** con `"nombre": "Vendedor"` y `"rol": "vendedor"`.
- [ ] **GET** `http://localhost:3000/clientes` **sin token** (Authorization → No Auth) → **401** con `"Debes iniciar sesión para usar esta ruta"`.

### Productos

- [ ] **GET** `http://localhost:3000/productos` sin token → **200** con 10 productos.
- [ ] **GET** `http://localhost:3000/productos/1` sin token → **200** con el Teclado mecánico.
- [ ] **POST** `http://localhost:3000/productos` con el token del vendedor y el cuerpo `{"nombre": "Cámara web Full HD", "categoria": "Periféricos", "precio": 150000, "stock": 10}` → **201**. Anotar el `id_producto`.
- [ ] **PUT** `http://localhost:3000/productos/ID` con el token del vendedor y el cuerpo `{"nombre": "Cámara web 4K", "categoria": "Periféricos", "precio": 260000, "stock": 8}` → **200** con los cambios.
- [ ] **DELETE** `http://localhost:3000/productos/ID` con el token del **vendedor** → **403** con `"No tienes permiso para hacer esta acción"`.
- [ ] **DELETE** `http://localhost:3000/productos/ID` con el token del **admin** → **204**.

### Clientes (todas con token)

- [ ] **GET** `http://localhost:3000/clientes` → **200** con 10 clientes.
- [ ] **GET** `http://localhost:3000/clientes/1` → **200** con Ana Gómez.
- [ ] **POST** `http://localhost:3000/clientes` con el cuerpo `{"nombre": "Carlos Pérez", "email": "carlos.perez@example.com", "ciudad": "Medellín"}` → **201**. Anotar el `id_cliente`.
- [ ] **POST** `http://localhost:3000/clientes` con el mismo cuerpo otra vez → **409** con `"Ya existe un cliente con ese correo"`.
- [ ] **PUT** `http://localhost:3000/clientes/ID` con el cuerpo `{"nombre": "Carlos Andrés Pérez", "email": "carlos.perez@example.com", "ciudad": "Bogotá"}` → **200** con los cambios.
- [ ] **DELETE** `http://localhost:3000/clientes/1` con el token del admin → **409** con `"No se puede borrar el cliente porque tiene pedidos"`.
- [ ] **DELETE** `http://localhost:3000/clientes/ID` con el token del admin → **204**.

### Pedidos (todas con token)

- [ ] **GET** `http://localhost:3000/pedidos` → **200** con `"pagina": 1`, `"limite": 10`, `"total": 12` y `"totalPaginas": 2`.
- [ ] **GET** `http://localhost:3000/pedidos?estado=pendiente&pagina=1&limite=2` → **200** con 2 pedidos, los dos pendientes, y `"total": 3`.
- [ ] **GET** `http://localhost:3000/pedidos/1` → **200** con el detalle y `"total": 310000`.
- [ ] **POST** `http://localhost:3000/pedidos` con el cuerpo `{"id_cliente": 9, "detalle": [{"id_producto": 8, "cantidad": 2}, {"id_producto": 9, "cantidad": 1}]}` → **201** con `"estado": "pendiente"` y `"total": 960000`. Anotar el `id_pedido`.
- [ ] **POST** `http://localhost:3000/pedidos` con el cuerpo `{"id_cliente": 10, "detalle": [{"id_producto": 2, "cantidad": 1}, {"id_producto": 9, "cantidad": 500}]}` → **409** con `"No hay stock suficiente de Silla ergonómica..."`.
- [ ] **PATCH** `http://localhost:3000/pedidos/ID/estado` con el cuerpo `{"estado": "enviado"}` → **200** con `"estado": "enviado"`.
- [ ] **PATCH** `http://localhost:3000/pedidos/ID/estado` con el cuerpo `{"estado": "cancelado"}` → **200** con `"estado": "cancelado"`. Las unidades vuelven al stock.
- [ ] **DELETE** `http://localhost:3000/pedidos/1` con el token del admin → **409** con `"Solo se pueden borrar pedidos pendientes o cancelados"`.
- [ ] **DELETE** `http://localhost:3000/pedidos/ID` con el token del admin → **204**.

Si una respuesta no es la que dice la lista, revisar el método, la URL, el cuerpo y el token. Si el token ya tiene más de una hora, vence: hay que hacer login otra vez y copiar el token nuevo.
