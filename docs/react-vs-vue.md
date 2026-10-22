# React vs Vue

Hice la misma página de pedidos dos veces: en React (`proyecto/frontend-react`, día 11) y en Vue (`proyecto/frontend-vue`, día 12). Las dos usan la misma API y tienen las mismas pantallas, los mismos mensajes y los mismos estilos. Esta es mi comparación, con lo que vi al hacerlas.

## Comparación

| Tema | React | Vue |
|---|---|---|
| **Reactividad** | El estado se crea con `useState`, que devuelve el valor y una función para cambiarlo. El valor nunca se cambia directamente: siempre se usa esa función, y para un arreglo se crea uno nuevo con `map`, `filter` o `[...lista, nuevo]`. Cada cambio vuelve a ejecutar toda la función del componente; por eso existen `useEffect` con su arreglo de dependencias, `useMemo` y `useCallback`. | El estado se crea con `ref` y se cambia directamente con `.value`, por ejemplo `lineas.value.push(...)`. Vue sabe qué datos usa cada parte de la pantalla y solo actualiza lo que cambió. `computed` se vuelve a calcular solo y `watch` corre cuando cambia lo que vigila, sin escribir una lista de dependencias. Lo que más me confundió fue cuándo poner `.value`: en el `<script>` sí, en el `<template>` no. |
| **Sintaxis** | Todo es JavaScript: el componente es una función que devuelve JSX. Las listas se hacen con `map`, las condiciones con `&&` o `? :` y los eventos con `onClick` y `onChange`. Cada campo de un formulario se conecta a mano con `value` y `onChange`. | El archivo `.vue` separa el HTML (`<template>`), el JavaScript (`<script setup>`) y el CSS (`<style>`). En el HTML se usan directivas: `v-for`, `v-if`, `v-show`, `v-model`, `:` y `@`. `v-model` conecta un campo con una variable en una sola línea, y tiene modificadores como `.number` y `.trim`. Los estilos pueden ser `scoped`, para que solo se apliquen a ese componente. |
| **Estado global** | Con Context: `AuthProvider` guarda la sesión con `useState`, `createContext` crea el contexto y un hook propio, `useAuth`, la lee. Fueron tres archivos, y tuve que usar `useMemo` y `useCallback` para que los componentes no se volvieran a dibujar de más. | Con Pinia: un solo archivo (`stores/sesion.js`) con `defineStore`, donde los `ref` son el estado y las funciones son las acciones. Cualquier componente lo usa con `useSesionStore()`, y también se puede usar por fuera de los componentes, como en la guarda del router. Además, el estado del store se ve en Vue DevTools. |
| **Curva de aprendizaje** | Al principio me costó más: hay que entender cuándo se vuelve a dibujar el componente, las reglas de los hooks y las dependencias de `useEffect` (el lint me marcó un error por cambiar el estado dentro de un efecto). Lo bueno es que, sabiendo JavaScript, no hay que aprender otra forma de escribir el HTML. | Me pareció más fácil para empezar, porque el `<template>` se ve como HTML normal y las directivas son pocas. Lo nuevo fue aprender las directivas, la diferencia entre `ref` y `reactive`, y que en el `<template>` los refs solo se sacan solos cuando no están dentro de un objeto. La documentación oficial es muy clara, y el router y Pinia también son oficiales. |
| **Cuándo usaría cada uno** | En un proyecto grande o en un equipo que ya trabaja con React, porque es el más usado: hay más librerías, más ejemplos y más ofertas de trabajo. También sirve para aplicaciones de celular, con React Native. | En un proyecto pequeño o mediano, o con un equipo que viene de HTML y CSS, porque se aprende rápido y trae lo necesario de forma oficial (router, Pinia y herramientas). También se puede agregar por partes a una página que ya existe. |

## Cómo quedó cada parte en los dos proyectos

| Qué | React (`frontend-react`) | Vue (`frontend-vue`) |
|---|---|---|
| Arrancar la aplicación | `main.jsx`: `createRoot`, `BrowserRouter` y `AuthProvider` | `main.js`: `createApp`, `app.use(createPinia())` y `app.use(router)` |
| Las rutas | En `App.jsx`, con `<Routes>` y `<Route>` | En `router/index.js`, en un arreglo |
| Páginas que piden sesión | El componente `RutaProtegida.jsx`, que manda al login con `<Navigate>` | La guarda `router.beforeEach`, que revisa `meta.requiereSesion`, y un `watch` en `App.vue` para cuando la sesión se cierra estando en una de esas páginas |
| La sesión (token) | `contexto/AuthProvider.jsx` (Context) | `stores/sesion.js` (Pinia) |
| Pedir datos con carga y error | `hooks/useConsulta.js`, con `useEffect` | `composables/useConsulta.js`, con `watch` |
| Peticiones con el token | `hooks/useApi.js` | `composables/useApi.js` |
| Volver a la página después del login | Se guarda en el `state` de la navegación | Se guarda en la dirección: `/login?desde=/pedidos` |
| Estilos | Un solo archivo, `index.css` | `estilos.css` para lo general y `<style scoped>` en cada componente |
| Puerto con `npm run dev` / en Docker | 5173 / 8080 | 5175 / 8082 |

## Lo que concluí

Los dos sirven para lo mismo y la página quedó igual. React me obligó a pensar más en cuándo se dibuja cada cosa; con Vue escribí menos código para lo mismo, sobre todo en los formularios (`v-model`) y en el estado global (Pinia). Si empezara un proyecto solo, escogería Vue; si entrara a un equipo, usaría el que el equipo ya use.
