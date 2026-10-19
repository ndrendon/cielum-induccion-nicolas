# Bitácora Día 12 · Vue

**Fecha:** 16-10-2026

**Horas invertidas:** 6 h (autoinvestigación 2 h · práctica 2 h · reto 2 h)

## Autoinvestigación básica

1. **Pregunta:** Componentes de archivo único (`.vue`): `<template>`, `<script setup>`, `<style>`.

   **Respuesta (con mis palabras):** Un componente de archivo único es un archivo con extensión `.vue` que guarda todo lo de un componente en un solo lugar: lo que se ve, lo que hace y cómo se ve. Tiene tres partes. `<template>` tiene el HTML del componente, con las directivas de Vue y los valores de JavaScript entre dobles llaves `{{ }}`. `<script setup>` tiene el JavaScript: los datos, las funciones y los componentes que se importan. Todo lo que se declara ahí se puede usar directamente en el `<template>`, sin tener que devolverlo ni registrarlo. `<style>` tiene el CSS; si se le agrega `scoped`, esos estilos solo se aplican a ese componente y no se mezclan con los de los demás. El navegador no entiende los archivos `.vue`, por eso Vite, con el plugin de Vue, los convierte en JavaScript y CSS normales.

   **Fuente:** <https://vuejs.org/guide/scaling-up/sfc> · <https://vuejs.org/api/sfc-script-setup>

2. **Pregunta:** Directivas: `v-if`, `v-show`, `v-for`, `v-model`, `v-bind` (`:`), `v-on` (`@`).

   **Respuesta (con mis palabras):** Las directivas son atributos especiales que empiezan con `v-` y que se ponen en las etiquetas del `<template>` para darles un comportamiento. `v-if` muestra el elemento solo si la condición es verdadera; si es falsa, el elemento no se crea. Se puede acompañar de `v-else-if` y `v-else`. `v-show` también muestra u oculta según una condición, pero el elemento siempre se crea y solo se esconde con CSS (`display: none`); sirve para algo que se muestra y se oculta muchas veces. `v-for` repite un elemento por cada dato de una lista, y cada uno debe llevar `:key` con un valor único, normalmente el id. `v-model` conecta un campo del formulario con una variable: lo que el usuario escribe se guarda en la variable, y si la variable cambia, el campo también. `v-bind` pone el valor de una variable en un atributo, por ejemplo en `disabled` o en `class`; su forma corta son los dos puntos (`:`). `v-on` escucha un evento, como un clic o el envío de un formulario, y ejecuta una función; su forma corta es la arroba (`@`). Los eventos pueden llevar modificadores, como `.prevent`, que evita que el formulario recargue la página.

   **Fuente:** <https://vuejs.org/guide/essentials/template-syntax> · <https://vuejs.org/guide/essentials/conditional> · <https://vuejs.org/guide/essentials/list> · <https://vuejs.org/guide/essentials/forms> · <https://vuejs.org/guide/essentials/event-handling>

3. **Pregunta:** Reactividad: `ref` vs `reactive`.

   **Respuesta (con mis palabras):** La reactividad es lo que hace que Vue actualice la pantalla solo cuando cambia un dato. Para eso los datos se declaran con `ref` o con `reactive`. `ref` sirve para cualquier tipo de valor: un número, un texto, un booleano, un objeto o un arreglo. Devuelve un objeto que guarda el valor en `.value`: en el `<script>` se lee y se cambia con `.value`, y en el `<template>` se usa sin `.value`, porque Vue lo saca solo. `reactive` sirve solo para objetos y arreglos, y se usa sin `.value`, directamente con sus propiedades. Tiene límites: no sirve para un número o un texto solos, si se reemplaza el objeto completo se pierde la reactividad, y si se sacan sus propiedades a variables sueltas, esas variables ya no se actualizan. Por eso la documentación de Vue recomienda usar `ref` como la forma principal de declarar los datos.

   **Fuente:** <https://vuejs.org/guide/essentials/reactivity-fundamentals>

4. **Pregunta:** `computed` y `watch`.

   **Respuesta (con mis palabras):** `computed` crea un valor que se calcula a partir de otros datos reactivos, por ejemplo cuántas tareas faltan por hacer o el total de un pedido. Vue guarda el resultado y solo lo vuelve a calcular cuando cambia alguno de los datos que usa. La función de un `computed` solo calcula y devuelve el valor: no debe cambiar otros datos ni pedir cosas a una API. `watch` vigila un dato y ejecuta una función cada vez que ese dato cambia; la función recibe el valor nuevo y el anterior. Sirve para hacer algo cuando un dato cambia, por ejemplo volver a pedir los pedidos a la API cuando el usuario cambia un filtro. Con la opción `immediate` también se ejecuta apenas aparece el componente, y con `deep` vigila los cambios dentro de un objeto. La regla es: si se necesita un valor para mostrar, se usa `computed`; si se necesita hacer una acción cuando algo cambia, se usa `watch`.

   **Fuente:** <https://vuejs.org/guide/essentials/computed> · <https://vuejs.org/guide/essentials/watchers>

5. **Pregunta:** Props y emits.

   **Respuesta (con mis palabras):** Las **props** son los datos que un componente recibe del componente que lo usa, por ejemplo la tarea que una fila de la lista va a mostrar. Se declaran con `defineProps`, diciendo el nombre y el tipo de cada una, y el componente que las recibe solo las lee: no las puede cambiar. Los **emits** son los eventos que un componente le manda al componente que lo usa, para avisarle que pasó algo, por ejemplo que el usuario marcó o borró una tarea. Se declaran con `defineEmits`, y el componente avisa llamando a `emit` con el nombre del evento y los datos. El componente de arriba escucha ese evento con `@` y decide qué hacer, porque es el dueño de los datos. Así los datos bajan por las props y los avisos suben por los emits.

   **Fuente:** <https://vuejs.org/guide/components/props> · <https://vuejs.org/guide/components/events>

## Autoinvestigación avanzada

1. **Composition API vs Options API.**

   Vue tiene dos formas de escribir los componentes. Con la **Options API**, el componente es un objeto con opciones fijas: `data` para los datos, `methods` para las funciones, `computed` para los valores calculados y `mounted` para lo que pasa cuando el componente aparece; dentro de las funciones se usa `this` para llegar a los datos. Con la **Composition API**, el componente usa funciones que se importan de Vue, como `ref`, `computed`, `watch` y `onMounted`, casi siempre dentro de `<script setup>`. Su ventaja es que el código de un mismo tema queda junto, en lugar de quedar repartido entre varias opciones, y que esa lógica se puede sacar a un composable para usarla en varios componentes. También funciona mejor con TypeScript y hace que la aplicación final pese menos. La Options API no está obsoleta: la documentación dice que sigue siendo una buena opción para proyectos pequeños y medianos. En los ejercicios y en el reto usé la Composition API con `<script setup>`, que es la forma que trae el proyecto que crea `npm create vue@latest`.

   **Fuente:** <https://vuejs.org/guide/introduction> · <https://vuejs.org/guide/extras/composition-api-faq>

2. **Composables (equivalente a custom hooks).**

   Un composable es una función propia que usa la Composition API para guardar una lógica con estado y usarla en varios componentes. Por costumbre su nombre empieza con `use`, por ejemplo `useApi` o `useConsulta`, y se guarda en un archivo aparte; en el reto quedaron en la carpeta `composables`. Por dentro crea sus datos con `ref`, puede usar `computed`, `watch` y los hooks del ciclo de vida, y devuelve un objeto con los refs y las funciones que el componente necesita: por ejemplo los datos, si está cargando, el error y una función para volver a pedir. Cada componente que llama al composable recibe sus propios datos. Si el composable recibe un valor que puede cambiar, como la ruta que debe pedir, se le pasa un ref o una función, y con `toValue` y `watch` vuelve a pedir los datos cada vez que ese valor cambia. Los composables se llaman dentro de `<script setup>` mientras el componente se está creando, no dentro de funciones que se ejecutan después, para que Vue sepa a qué componente pertenecen.

   **Fuente:** <https://vuejs.org/guide/reusability/composables>

3. **Vue Router y guardas de navegación.**

   Vue Router es la librería oficial para que una aplicación de Vue tenga varias páginas sin que el navegador recargue. Las rutas se definen en un arreglo, donde cada una tiene su dirección (`path`), un nombre y el componente que muestra; el router se crea con `createRouter` y `createWebHistory`, y se instala con `app.use(router)`. La página que toca se dibuja dentro de `<RouterView>`; para moverse entre páginas se usa `<RouterLink>` y, desde el código, `router.push`. Con `useRoute` se leen los parámetros de la dirección, como el id en `/pedidos/:id`, y los valores después del `?`. Una **guarda de navegación** es una función que se ejecuta antes de cambiar de página y decide si se deja pasar. La guarda global se registra con `router.beforeEach` y recibe la página a la que se va (`to`) y la página de la que viene (`from`): si devuelve `false`, cancela; si devuelve otra dirección, por ejemplo el login, redirige; y si no devuelve nada, deja pasar. Para proteger páginas, cada ruta que pide sesión lleva en su `meta` un dato como `requiereSesion`, y la guarda revisa si hay token. Hay que cuidar no mandar al login a quien ya va para el login, porque se haría un ciclo infinito. Antes se usaba un tercer parámetro, `next`, pero está marcado como obsoleto y se recomienda devolver el valor. La guarda solo esconde pantallas: la seguridad de verdad la pone la API, que revisa el token en cada petición.

   **Fuente:** <https://router.vuejs.org/guide> · <https://router.vuejs.org/guide/advanced/navigation-guards> · <https://router.vuejs.org/api/interfaces/navigationguardnext>

4. **Pinia para estado global.**

   Pinia es la librería oficial de Vue para el estado global: los datos que necesitan muchos componentes, como el usuario que inició sesión y su token. Se instala con `app.use(createPinia())`, y cada store se crea con `defineStore`, que recibe un nombre único y la definición. Hay dos formas de definir un store. La de opciones tiene `state` (los datos), `getters` (valores calculados) y `actions` (funciones que cambian los datos o llaman a la API). La de setup es una función donde los `ref` son el estado, los `computed` son los getters y las funciones son las acciones, y al final devuelve todo. Por costumbre la función se llama `use...Store`, por ejemplo `useSesionStore`, y cualquier componente la llama para leer o cambiar los datos: todos ven el mismo store, y la pantalla se actualiza sola cuando cambia. Si se quieren sacar datos del store a variables sueltas, hay que usar `storeToRefs`, porque si no se pierde la reactividad; las acciones sí se pueden sacar directamente. Vue DevTools muestra el estado de cada store y sus cambios. El estado de Pinia vive en memoria: si se recarga la página, vuelve a empezar.

   **Fuente:** <https://pinia.vuejs.org/introduction> · <https://pinia.vuejs.org/core-concepts/>

5. **Ciclo de vida (`onMounted`, `onUnmounted`).**

   Cada componente pasa por etapas: se crea, se pone en la página (se monta), se actualiza cada vez que cambian sus datos y al final se quita de la página (se desmonta). Los hooks del ciclo de vida son funciones que Vue llama en cada etapa. `onMounted` se ejecuta cuando el componente ya está en la página: ahí ya existen sus elementos, y es un buen lugar para pedir datos a la API, prender un temporizador o escuchar un evento del navegador. `onUnmounted` se ejecuta cuando el componente se quita de la página, y sirve para limpiar lo que se prendió: apagar el temporizador, quitar el evento o ignorar una respuesta que llegue tarde, para que no queden cosas corriendo. También existen `onBeforeMount`, `onBeforeUpdate`, `onUpdated` y `onBeforeUnmount`. Los hooks se tienen que llamar mientras el componente se está creando, por ejemplo directamente en `<script setup>`; si se llaman más tarde, como dentro de un `setTimeout`, no funcionan.

   **Fuente:** <https://vuejs.org/guide/essentials/lifecycle> · <https://vuejs.org/api/composition-api-lifecycle>

## Lo que aprendí hoy (3 cosas)

- A armar componentes de Vue en archivos `.vue`, con `<template>`, `<script setup>` y `<style scoped>`, y a usar las directivas: `v-for` con `:key`, `v-model`, `v-if` y `v-else`, `v-show`, `:` y `@`. Lo practiqué con una lista de tareas que además usa `computed`, `watch`, props y emits.
- A pedirle datos a la API con `onMounted` y `watch`, con un mensaje mientras cargan, otro si hay un error y un botón para reintentar. También a guardar la sesión (el usuario y el token) en un store de Pinia y a proteger páginas con una guarda de ruta (`router.beforeEach`) que manda al login.
- A hacer otra vez el frontend del proyecto, ahora en Vue, con las mismas funciones que el de React: login, pedidos con filtros y paginación, crear pedidos con varios productos y cambiarles el estado. Lo agregué al `docker-compose.yml` en el puerto 8082 y escribí la comparación entre los dos en `docs/react-vs-vue.md`.

## Lo que no entendí o me costó

- Cuándo usar `.value`: en el `<script>` siempre, pero en el `<template>` no. Además, en el `<template>` los refs solo se sacan solos cuando no están dentro de otro objeto; por eso, a lo que devuelve `useConsulta` le saqué los refs con otro nombre, por ejemplo `datos: clientes`.
- Que la guarda del router solo corre cuando se cambia de página: si la sesión se cierra estando en una página protegida, la guarda no se entera. Por eso agregué en `App.vue` un `watch` del token que manda al login.
- La diferencia entre `ref` y `reactive`, y por qué la documentación recomienda usar `ref` casi siempre.

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
| --- | --- | --- |
| `npm run lint` avisó `no-invalid-fetch-options`: `"body" is not allowed when method is "GET"` | La función que llama a la API siempre le pasaba `body` a `fetch`, aunque fuera vacío, y el método por defecto es GET | Ahora `body` solo se agrega cuando la petición manda datos (POST o PATCH) |
| `npm run lint` avisó `'process' is not defined` en `vite.config.js` | ESLint revisaba todos los archivos como si fueran del navegador, y `vite.config.js` corre en Node | En `eslint.config.js` agregué las variables de Node solo para `vite.config.js` |
| Con cantidad 0 en un producto no salía mi mensaje de error al crear el pedido | El campo tiene `min="1"`, así que el navegador no deja enviar el formulario y muestra su propio aviso | Lo dejé así, porque el navegador ya avisa. Mi mensaje sale cuando la cantidad está vacía o no es un número entero |

## Uso de IA hoy

- ¿La usé? Sí.
- ¿Para qué? Para responder la autoinvestigación con palabras sencillas, armar los ejercicios (lista de tareas, tabla de productos, store de Pinia y guarda de ruta), hacer el frontend del proyecto en Vue con su Dockerfile y el servicio en el `docker-compose.yml`, y escribir la comparación entre React y Vue.
- ¿Qué aprendí de eso? Que hacer la misma aplicación en dos frameworks ayuda a ver qué es propio de cada uno y qué es igual en los dos: la API, los mensajes de carga y de error, el token y las páginas protegidas.

## Autoevaluación del tema (1-5): 4
