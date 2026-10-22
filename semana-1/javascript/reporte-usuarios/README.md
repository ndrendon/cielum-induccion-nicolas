# Reto Día 02: reporte de usuarios

Script en Node.js que consume `https://jsonplaceholder.typicode.com/users` y `/posts`, junta los datos y genera un reporte con usuario, ciudad y cantidad de posts. El reporte se muestra en consola y se guarda en `reporte.json`. También incluye una página HTML que muestra el mismo reporte en una tabla.

## Estructura

| Archivo | Responsabilidad |
|---|---|
| `api.js` | Consume la API con `fetch`, valida la respuesta y lanza errores claros (sin conexión, código HTTP distinto de 2xx o tiempo límite). |
| `reporte.js` | Une usuarios y posts: cuenta los posts por usuario con `reduce` y arma cada fila con `map`. No depende de Node ni del navegador. |
| `index.js` | Punto de entrada en Node: pide los datos en paralelo con `Promise.all`, imprime con `console.table` y escribe `reporte.json`. |
| `index.html` + `app.js` | Página que reutiliza `api.js` y `reporte.js` y pinta la tabla con el DOM. |

## Requisitos

- Node.js 18 o superior (trae `fetch` incluido).

## Cómo ejecutarlo

```bash
cd semana-1/javascript/reporte-usuarios
npm start
```

## Cómo ver la página HTML

Los módulos ES no funcionan abriendo el archivo con doble clic (`file://`), hay que servirlo por HTTP:

```bash
npx serve .
```

O abrir `index.html` con la extensión Live Server de VS Code.
