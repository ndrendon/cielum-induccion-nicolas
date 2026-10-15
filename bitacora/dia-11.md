# Bitácora Día 11 · React

**Fecha:** 15-10-2026

**Horas invertidas:** 6 h (autoinvestigación 2 h · práctica 2 h · reto 3 h)

## Autoinvestigación básica

1. **Pregunta:** ¿Qué es React y qué es un componente? JSX.

   **Respuesta (con mis palabras):** React es una librería de JavaScript para construir la parte de una aplicación web que el usuario ve y usa: botones, formularios, listas y menús. Con React la pantalla se arma con componentes. Un **componente** es una función de JavaScript que devuelve un pedazo de la pantalla, por ejemplo el encabezado, la tarjeta de un producto o el formulario de login. Su nombre empieza con mayúscula, se puede usar varias veces y se puede poner dentro de otros componentes, hasta armar la página completa. **JSX** es la forma de escribir, dentro del código JavaScript, las etiquetas que el componente muestra en la pantalla. Tiene algunas reglas: el componente devuelve un solo elemento que envuelve a los demás, todas las etiquetas se cierran, el atributo de las clases se escribe `className` y los valores de JavaScript se ponen entre llaves `{}`.

   **Fuente:** <https://es.react.dev/learn/your-first-component> · <https://es.react.dev/learn/writing-markup-with-jsx>

2. **Pregunta:** Props vs state. useState.

   **Respuesta (con mis palabras):** Las **props** son los datos que un componente recibe del componente que lo usa, por ejemplo el nombre y el precio del producto que va a mostrar. El componente que las recibe solo las lee: no las puede cambiar. El **state** (estado) son los datos que el componente guarda y que pueden cambiar mientras la página está abierta, por ejemplo lo que el usuario escribió o si un menú está abierto. Cuando el estado cambia, React vuelve a dibujar el componente con el valor nuevo. **useState** es la función de React para crear un estado. Devuelve dos cosas: el valor actual y una función para cambiarlo. El valor nunca se cambia directamente; siempre se usa esa función, para que React se entere y actualice la pantalla.

   **Fuente:** <https://es.react.dev/learn/passing-props-to-a-component> · <https://es.react.dev/learn/state-a-components-memory> · <https://es.react.dev/reference/react/useState>

3. **Pregunta:** Eventos, renderizado condicional, listas y key.

   **Respuesta (con mis palabras):** Los **eventos** son las acciones del usuario, como hacer clic, escribir o enviar un formulario. En React, a un elemento se le pasa la función que debe ejecutarse cuando pasa el evento, con atributos como `onClick` u `onChange`; la función se pasa sin ejecutarla, para que React la llame en el momento del evento. El **renderizado condicional** es mostrar una cosa u otra según una condición: por ejemplo, el mensaje "Cargando..." mientras llegan los datos, o un mensaje de error si la API falló. Para eso se usan `if`, el operador `? :` o `&&`. Para mostrar una **lista** a partir de un arreglo se usa `map`, que crea un elemento por cada dato. Cada elemento de la lista necesita una **key**: un valor único y que no cambie, normalmente el id del dato. React usa la key para saber qué elemento se agregó, cambió o se borró, y así actualiza solo ese.

   **Fuente:** <https://es.react.dev/learn/responding-to-events> · <https://es.react.dev/learn/conditional-rendering> · <https://es.react.dev/learn/rendering-lists>

4. **Pregunta:** Formularios controlados.

   **Respuesta (con mis palabras):** Un formulario controlado es un formulario en el que el valor de cada campo vive en el estado del componente. El campo muestra lo que dice el estado, con el atributo `value`, y cada vez que el usuario escribe, el evento `onChange` guarda lo nuevo en el estado. Así el componente siempre sabe qué hay escrito en cada campo, y puede validar los datos mientras el usuario escribe, mostrar un error, limpiar el formulario o mandar los datos a la API. Al enviar el formulario se usa el evento `onSubmit`, y ahí se llama a `preventDefault()` para que el navegador no recargue la página.

   **Fuente:** <https://es.react.dev/reference/react-dom/components/input> · <https://es.react.dev/learn/reacting-to-input-with-state>

5. **Pregunta:** Crear proyecto con Vite.

   **Respuesta (con mis palabras):** Vite es una herramienta que crea la estructura de un proyecto de React y lo corre mientras uno programa. El proyecto se crea con el comando `npm create vite@latest`, donde se escoge el nombre, el framework (React) y el lenguaje (JavaScript o TypeScript). Después se entra a la carpeta, se instalan las librerías con `npm install` y se prende con `npm run dev`. El proyecto queda en `http://localhost:5173`, y la página se actualiza sola cada vez que se guarda un cambio. Ese es el puerto que la API del proyecto ya deja usar en `CORS_ORIGIN`. Para la versión final se usa `npm run build`, que deja los archivos listos en la carpeta `dist`.

   **Fuente:** <https://vite.dev/guide/> · <https://react.dev/learn/build-a-react-app-from-scratch>

## Autoinvestigación avanzada

1. **useEffect: dependencias, limpieza, errores comunes (ciclos infinitos).**

   `useEffect` sirve para conectar un componente con algo que está por fuera de React, después de que el componente se dibuja: pedir datos a una API, prender un temporizador o escuchar un evento del navegador. Recibe una función y un arreglo de **dependencias**: sin el arreglo, el efecto corre después de cada dibujo; con `[]`, corre solo cuando el componente aparece; con `[id]`, corre otra vez cada vez que cambia `id`. La función del efecto puede devolver otra función de **limpieza**, que React ejecuta antes de volver a correr el efecto y cuando el componente desaparece; sirve para apagar el temporizador, quitar el evento o ignorar una respuesta que llegó tarde. El error más común es el **ciclo infinito**: el efecto cambia un estado que está en sus propias dependencias, o no tiene arreglo y cambia un estado, así que el cambio vuelve a dibujar el componente, el efecto corre otra vez y así sin parar. Otros errores son olvidar una dependencia, que deja datos viejos, y usar un efecto para calcular algo que se puede calcular directamente mientras se dibuja. En modo de desarrollo, React corre cada efecto dos veces al principio, para ayudar a encontrar limpiezas que faltan.

   **Fuente:** <https://es.react.dev/reference/react/useEffect> · <https://es.react.dev/learn/synchronizing-with-effects> · <https://es.react.dev/learn/you-might-not-need-an-effect>

2. **Custom hooks (useFetch, useAuth).**

   Un custom hook es una función propia cuyo nombre empieza con `use` y que por dentro usa otros hooks, como `useState`, `useEffect` o `useContext`. Sirve para sacar de los componentes una lógica que se repite y usarla en varios lugares. Un **useFetch** recibe una URL, hace la petición dentro de un `useEffect` y devuelve tres cosas: los datos, si todavía está cargando y el error, si lo hubo. Cada componente que lo usa tiene su propio estado. Un **useAuth** devuelve el usuario que inició sesión, su token y las funciones para iniciar y cerrar sesión, que lee de un Context. Los hooks tienen reglas: solo se llaman en el nivel de arriba de un componente o de otro hook, nunca dentro de un `if`, de un ciclo o de una función interna.

   **Fuente:** <https://es.react.dev/learn/reusing-logic-with-custom-hooks> · <https://es.react.dev/reference/rules/rules-of-hooks>

3. **Context API para estado global (usuario logueado).**

   Normalmente los datos pasan de un componente a sus hijos por props. Cuando muchos componentes, en niveles distintos, necesitan el mismo dato, como el usuario que inició sesión, pasarlo nivel por nivel obliga a mandar props por componentes que no las usan. Context resuelve eso: se crea con `createContext`, un componente proveedor (Provider) que envuelve la aplicación guarda el valor, por ejemplo el usuario y el token en un `useState`, y cualquier componente de adentro lo lee con `useContext`, sin importar en qué nivel esté. Cuando el valor cambia, React vuelve a dibujar los componentes que lo usan. Para el usuario logueado se arma un `AuthProvider` con una función de login, que llama a `POST /auth/login` y guarda el token, y otra de logout. Context no es para todo: los datos que usa un solo componente van en su propio estado.

   **Fuente:** <https://es.react.dev/learn/passing-data-deeply-with-context> · <https://es.react.dev/reference/react/useContext>

4. **React Router: rutas, parámetros, rutas protegidas.**

   React Router es una librería para que una aplicación de React tenga varias páginas sin que el navegador recargue: cada URL muestra un componente. Las **rutas** se definen con `<Routes>` y `<Route>`, diciendo qué componente va en cada dirección, por ejemplo `/productos`. Para moverse entre páginas se usa `<Link>`, y desde el código, `useNavigate`. Un **parámetro** es una parte de la URL que cambia, como el id en `/pedidos/:id`, y se lee con `useParams`; los valores después del `?` se leen con `useSearchParams`. Una **ruta protegida** es un componente que revisa si hay un usuario con sesión, por ejemplo con `useAuth`: si no hay, lo manda al login con `<Navigate to="/login" />`, y si hay, muestra la página. Esa protección solo esconde pantallas; la seguridad de verdad la pone la API, que responde `401` o `403` cuando el token no sirve o el rol no alcanza.

   **Fuente:** <https://reactrouter.com/start/modes> · <https://reactrouter.com/api/hooks/useParams>

5. **useMemo, useCallback y cuándo NO usarlos.**

   `useMemo` guarda el resultado de un cálculo y solo lo vuelve a calcular cuando cambian sus dependencias. `useCallback` guarda una función, para que sea la misma en cada dibujo del componente. Sirven para que la aplicación sea más rápida en casos concretos: un cálculo pesado, como filtrar miles de elementos, o una función u objeto que se le pasa a un componente envuelto en `memo`, o que se usa como dependencia de un `useEffect`. **Cuándo no usarlos:** en la mayoría de los casos no hacen falta. Agregan código, tienen su propio costo y, si el cálculo es rápido o el componente se dibuja pocas veces, no mejoran nada. Lo recomendado es primero hacer que funcione, medir con el Profiler de React DevTools y optimizar solo donde se ve lento.

   **Fuente:** <https://es.react.dev/reference/react/useMemo> · <https://es.react.dev/reference/react/useCallback>

6. **Manejo de estado de servidor (TanStack Query, opcional).**

   El estado de servidor son los datos que viven en la API y en la base de datos, como los productos o los pedidos. La aplicación de React solo tiene una copia, que se puede quedar vieja. Manejarlos a mano con `useEffect` y `useState` obliga a escribir muchas cosas: el estado de carga, los errores, la caché, los reintentos y volver a pedir la lista después de crear o borrar algo. TanStack Query hace eso por uno. Con `useQuery` se le da un nombre a la consulta y la función que pide los datos; la librería guarda la respuesta en caché, no pide dos veces lo mismo, vuelve a pedir los datos cuando se quedan viejos o cuando el usuario vuelve a la pestaña, y avisa si está cargando o si hubo un error. Con `useMutation` se crean, cambian o borran datos, y después se invalida la consulta para que la lista se vuelva a pedir. Es opcional: en una aplicación pequeña basta con un `useFetch` propio.

   **Fuente:** <https://tanstack.com/query/latest/docs/framework/react/overview>

## Lo que aprendí hoy (3 cosas)

- A armar una aplicación de React con Vite: componentes, props, estado con `useState`, eventos, listas con `key` y formularios controlados. Lo practiqué con un contador, una lista de tareas y un formulario de registro que revisa los datos antes de enviarlos.
- A pedirle datos a la API desde React con `useEffect`, con un mensaje mientras cargan y otro si hay un error, y un botón para reintentar. También a guardar la sesión en un Context, a hacer un custom hook (`useApi`) que le pone el token a cada petición y cierra la sesión si la API responde 401, y a proteger páginas con una ruta protegida que manda al login.
- A conectar el frontend con la API del proyecto: la página siempre llama a `/api/...`, y en desarrollo Vite le pasa esas peticiones a la API; en Docker lo hace nginx. En el reto armé la página de pedidos (login, lista con filtros y paginación, crear pedidos con varios productos y cambiarles el estado) y la agregué al `docker-compose.yml`, en el puerto 8080.

## Lo que no entendí o me costó

- Entender cuándo se ejecuta `useEffect` y para qué sirve la limpieza. Me ayudó ver que en desarrollo React corre el efecto dos veces al abrir la página, y que la limpieza sirve para ignorar una respuesta que llega cuando ya no se necesita.
- Por qué el token se guarda solo en memoria: así ningún script de la página lo puede leer guardado en el navegador. Por eso, al recargar la página, toca iniciar sesión otra vez.
- Que la ruta protegida solo esconde las pantallas. La seguridad de verdad la pone la API, que revisa el token en cada petición y responde 401 cuando no sirve.

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
| --- | --- | --- |
| `npm run lint` avisó `set-state-in-effect` en el hook que pide los datos | El efecto cambiaba el estado de "cargando" apenas empezaba, y eso hace que el componente se dibuje una vez de más | Ahora "cargando" se calcula: cada petición tiene una clave, y mientras la respuesta guardada no sea la de esa clave, está cargando |
| Después de iniciar sesión, la página no volvía a la dirección que el usuario quería ver, sino a la lista de pedidos | El login redirigía de dos formas y cada una mandaba a un lugar distinto | Las dos usan la misma dirección de destino |
| En la consola salió el aviso de React de dos elementos con la misma `key`, en la tabla del detalle del pedido | La `key` era solo el id del producto, y un pedido puede tener el mismo producto en dos líneas | La `key` lleva el id del producto y la posición de la línea |
| Después de cambiar el estado de un pedido, la pantalla seguía mostrando el estado anterior | La página mostraba el pedido que cargó al entrar | Se muestra el pedido que devuelve la API al cambiar el estado |
| Al iniciar sesión en el frontend salió `Error interno del servidor` | El contenedor `pg-induccion` estaba apagado, así que la API no pudo consultar la base (en su terminal salía `ECONNREFUSED 127.0.0.1:5432`) | Lo prendí con `docker start pg-induccion` y volví a iniciar sesión |

## Uso de IA hoy

- ¿La usé? Sí.
- ¿Para qué? Para responder la autoinvestigación con palabras sencillas, armar los ejercicios (contador, lista de tareas, formulario, tabla de productos, `useApi` y la ruta protegida) y el frontend del reto con su Dockerfile y el servicio en el `docker-compose.yml`, y para entender cómo se conecta React con la API.
- ¿Qué aprendí de eso? Que hay que probar cada pantalla también con los casos de error, como la API apagada, datos malos o un token que no sirve, y no solo cuando todo sale bien, porque ahí se ve si la página le explica al usuario qué pasó.

## Autoevaluación del tema (1-5): 4
