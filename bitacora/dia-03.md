# Bitácora Día 01 · Inducción Cielum + entorno de trabajo + Git básico

**Fecha:** 01-10-2026

**Horas invertidas:** 6 h (autoinvestigación 3 h · práctica 2 h · reto 1 h)

## Autoinvestigación básica

1. **Pregunta:** ¿Qué es el scope y qué es un closure? Da un ejemplo.

   **Respuesta (con mis palabras):** El scope es el "alcance" de una variable, o sea, desde qué partes del código puedo usarla. Hay scope global (se ve en todo el programa), de función (solo dentro de la función) y de bloque (solo dentro de unas llaves `{}` cuando uso `let` o `const`). Un closure es cuando una función "recuerda" las variables del lugar donde fue creada, aunque esa función externa ya haya terminado de ejecutarse. Es como si la función interna se llevara una mochila con esas variables.

   **Ejemplo propio:**

```js
   function crearContador() {
     let cuenta = 0;
     return function () {
       cuenta++;
       return cuenta;
     };
   }

   const contador = crearContador();
   console.log(contador());
   console.log(contador());
```

   La variable `cuenta` se crea dentro de `crearContador`, así que su scope es solo esa función y desde afuera no se puede usar directamente. Cuando llamo a `crearContador()`, me devuelve una función interna que sigue teniendo acceso a `cuenta`, aunque `crearContador` ya terminó. Eso es el closure. Por eso la primera vez que llamo a `contador()` imprime `1` y la segunda imprime `2`: la función recuerda el valor anterior de `cuenta`.

   **Fuente:** <https://developer.mozilla.org/es/docs/Web/JavaScript/Closures>

2. **Pregunta:** ¿Cómo funcionan las clases en JS (`class`, `constructor`, herencia con `extends`)?

   **Respuesta (con mis palabras):** Una clase es como un molde para crear objetos que tienen las mismas propiedades y métodos. El `constructor` es un método especial que se ejecuta automáticamente cuando creo un objeto con `new`, y ahí se le dan los valores iniciales usando `this`. Con `extends` una clase hija hereda todo lo de la clase padre, y con `super()` se llama al constructor del padre. Se parece mucho a lo que he visto en C#, aunque por debajo JS usa prototipos.

   **Ejemplo propio:**

```js
   class Animal {
     constructor(nombre) {
       this.nombre = nombre;
     }
     hablar() {
       return `${this.nombre} hace un sonido`;
     }
   }

   class Perro extends Animal {
     constructor(nombre, raza) {
       super(nombre);
       this.raza = raza;
     }
     hablar() {
       return `${this.nombre} ladra`;
     }
   }

   const miPerro = new Perro("Toby", "Criollo");
   console.log(miPerro.hablar());
```

   `Animal` es la clase padre y su constructor guarda el nombre en `this.nombre`. `Perro` hereda de `Animal` usando `extends`. En el constructor de `Perro` primero llamo a `super(nombre)` para que el constructor de `Animal` asigne el nombre, y después agrego la propiedad propia `raza`. Además, `Perro` sobrescribe el método `hablar()` del padre, por eso al ejecutar `miPerro.hablar()` se imprime "Toby ladra" y no "Toby hace un sonido".

   **Fuente:** <https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes>

3. **Pregunta:** ¿Qué es JSON y cómo se usan `JSON.parse` y `JSON.stringify`?

   **Respuesta (con mis palabras):** JSON (JavaScript Object Notation) es un formato de texto para guardar y enviar datos, por ejemplo entre el frontend y una API. Se parece a un objeto de JS, pero las claves van entre comillas dobles y no puede tener funciones. `JSON.stringify` convierte un objeto de JS en un texto JSON (para enviarlo o guardarlo), y `JSON.parse` hace lo contrario: convierte un texto JSON en un objeto de JS para poder usarlo.

   **Ejemplo propio:**

```js
   const estudiante = { nombre: "Nicolas", semestre: 5 };

   const texto = JSON.stringify(estudiante);
   console.log(texto);
   console.log(typeof texto);

   const objeto = JSON.parse(texto);
   console.log(objeto.nombre);
```

   Primero tengo un objeto normal de JS llamado `estudiante`. Con `JSON.stringify` lo convierto en el texto `'{"nombre":"Nicolas","semestre":5}'`, y al revisar con `typeof` confirmo que ahora es un `string`. Después uso `JSON.parse` para convertir ese texto otra vez en un objeto, y así puedo acceder a sus propiedades como `objeto.nombre`, que imprime "Nicolas".

   **Fuente:** <https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON>

4. **Pregunta:** ¿Qué es el DOM y cómo se seleccionan y modifican elementos?

   **Respuesta (con mis palabras):** El DOM (Document Object Model) es la representación de la página HTML como un árbol de objetos que JavaScript puede leer y cambiar. Cada etiqueta es un "nodo". Para seleccionar elementos uso métodos como `document.getElementById`, `document.querySelector` (el primero que coincide) o `document.querySelectorAll` (todos los que coinciden). Después puedo cambiarles el texto (`textContent`), el estilo (`style`), las clases (`classList`) o reaccionar a eventos con `addEventListener`.

   **Ejemplo propio:**

```html
   <h1 id="titulo">Hola</h1>
   <button class="btn">Cambiar</button>

   <script>
     const titulo = document.getElementById("titulo");
     const boton = document.querySelector(".btn");

     boton.addEventListener("click", () => {
       titulo.textContent = "¡Texto cambiado desde JS!";
       titulo.style.color = "blue";
       titulo.classList.add("activo");
     });
   </script>
```

   En el HTML hay un título con id `titulo` y un botón con la clase `btn`. En el script selecciono el título por su id con `getElementById` y el botón por su clase con `querySelector`. Luego le agrego al botón un evento `click`, y cuando el usuario lo presiona se cambia el texto del título con `textContent`, se pone de color azul con `style.color` y se le agrega la clase `activo` con `classList.add`.

   **Fuente:** <https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model/Introduction>

5. **Pregunta:** ¿Qué son los módulos ES (`import`/`export`)?

   **Respuesta (con mis palabras):** Los módulos sirven para dividir el código en varios archivos, y que cada archivo comparta solo lo que quiera. Con `export` digo qué funciones, variables o clases se pueden usar desde afuera, y con `import` las traigo a otro archivo. Hay export con nombre (puede haber varios y se importan con llaves `{}`) y export por defecto (`export default`, solo uno por archivo y se importa sin llaves). En el navegador hay que poner `type="module"` en la etiqueta `<script>`.

   **Ejemplo propio:**

```js
   export function sumar(a, b) {
     return a + b;
   }
   export const PI = 3.1416;
   export default function restar(a, b) {
     return a - b;
   }
```

```js
   import restar, { sumar, PI } from "./operaciones.js";
   console.log(sumar(2, 3));
   console.log(restar(5, 2));
   console.log(PI);
```

```html
   <script type="module" src="main.js"></script>
```

   El primer bloque es el archivo `operaciones.js`, donde exporto con nombre la función `sumar` y la constante `PI`, y exporto por defecto la función `restar`. El segundo bloque es `main.js`, donde las importo: `restar` va sin llaves porque es el export por defecto, y `sumar` y `PI` van dentro de llaves porque son exports con nombre. Al ejecutar, se imprime `5`, `3` y `3.1416`. Para que el navegador entienda los `import`, el script se carga con `type="module"`.

   **Fuente:** <https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules>

## Autoinvestigación avanzada

1. **¿Cómo funciona el event loop? Diferencia entre call stack, task queue y microtask queue.**

   JavaScript solo puede ejecutar una cosa a la vez, y el event loop es el mecanismo que le permite manejar tareas asíncronas sin bloquearse. El call stack (pila de llamadas) es donde se van ejecutando las funciones en el momento; cuando una función se llama entra a la pila y cuando termina sale. La task queue (cola de tareas o macrotareas) guarda callbacks que están listos para ejecutarse, como los de `setTimeout`, `setInterval` o eventos del DOM. La microtask queue (cola de microtareas) guarda callbacks de mayor prioridad, como los `.then()` de las promesas y el código después de un `await`. El event loop revisa constantemente: cuando el call stack queda vacío, primero ejecuta todas las microtareas pendientes y después toma una tarea de la task queue. Por eso un `.then()` se ejecuta antes que un `setTimeout(..., 0)`.

2. **Callbacks → Promesas → `async/await`: ¿qué problema resuelve cada uno?**

   Los callbacks fueron la primera forma de manejar código asíncrono: se le pasa una función a otra para que la ejecute cuando termine. Resolvieron el problema de no bloquear el programa mientras se espera algo, pero cuando hay muchas operaciones que dependen una de otra se forma el "callback hell", con funciones anidadas muy difíciles de leer y de manejar errores. Las promesas resolvieron eso, porque representan un valor que llegará en el futuro y permiten encadenar operaciones con `.then()` y manejar los errores en un solo `.catch()`, dejando el código más plano. `async/await` se construye sobre las promesas y resuelve el problema de legibilidad que todavía tenían las cadenas largas de `.then()`, ya que permite escribir código asíncrono que se lee como si fuera síncrono, paso a paso, y usar `try/catch` normal.

3. **`Promise.all`, `Promise.allSettled`, `Promise.race`: ¿cuándo usar cada uno?**

   `Promise.all` se usa cuando necesito que todas las promesas se cumplan para continuar, por ejemplo cargar varios datos que son obligatorios para mostrar una página. Devuelve un arreglo con todos los resultados, pero si una sola falla, todo se rechaza. `Promise.allSettled` se usa cuando quiero esperar a que todas terminen sin importar si salieron bien o mal, por ejemplo enviar varias notificaciones y después revisar cuáles fallaron. Devuelve un arreglo donde cada elemento dice si fue `fulfilled` o `rejected`. `Promise.race` se usa cuando solo me interesa la primera que termine, ya sea con éxito o con error, por ejemplo para poner un tiempo límite a una petición compitiendo contra un `setTimeout`.

4. **¿Cómo se manejan errores en código asíncrono?**

   Depende de cómo esté escrito el código. Con callbacks, la costumbre es que el primer parámetro del callback sea el error (`(error, resultado)`) y se revisa si existe antes de continuar. Con promesas se usa `.catch()` al final de la cadena, que atrapa cualquier error que ocurra en los `.then()` anteriores, y también existe `.finally()` para ejecutar algo pase lo que pase. Con `async/await` se usa un bloque `try/catch` alrededor de los `await`, y `finally` si hace falta. Algo importante es que si una promesa se rechaza y nadie la maneja, aparece un error de "unhandled promise rejection", así que siempre hay que poner un `catch` o un `try/catch`.

5. **¿Qué es `this` y cómo cambia en funciones flecha?**

   `this` es una palabra clave que hace referencia al objeto que está ejecutando la función en ese momento, y su valor depende de cómo se llama la función, no de dónde se escribió. Por ejemplo, en un método de un objeto, `this` es ese objeto; en una función normal llamada sola, `this` es `undefined` en modo estricto (o el objeto global si no); con `new`, `this` es el objeto nuevo; y con `call`, `apply` o `bind` se puede decidir manualmente qué será `this`. Las funciones flecha no tienen su propio `this`, sino que toman el `this` del lugar donde fueron creadas (el contexto que las rodea). Por eso son útiles dentro de callbacks, como en un `setTimeout` dentro de un método, porque mantienen el `this` del objeto. Pero no conviene usarlas como métodos de un objeto, porque ahí `this` no apuntaría al objeto.

## Lo que aprendí hoy (3 cosas)

- A trabajar con ramas: crear una rama con `git switch -c`, subirla con `git push -u origin` y entender que una rama nueva solo existe en mi computador hasta que hago push.
- A usar `git stash` para guardar cambios sin terminar y cambiar de rama sin perderlos, y `git revert` para deshacer un commit que ya está subido sin reescribir el historial.
- A usar métodos de arrays en JavaScript (`map`, `filter`, `reduce`) para calcular totales, agrupar y promediar datos, y a relacionarlos con LINQ de C# (`Select`, `Where`, `Sum`).

## Lo que no entendí o me costó

- Diferenciar cuándo usar `rebase` y cuándo `merge`, sobre todo por el riesgo de reescribir el historial en ramas compartidas.
- Usar `reduce` para agrupar datos en un objeto (total por ciudad y promedio por cliente), porque el acumulador no es un número sino un objeto.

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
|---|---|---|
| La rama `feature/js-fundamentos` no aparecía en GitHub | La rama solo existía en local porque no había hecho push | La subí con `git push -u origin feature/js-fundamentos` |
| `nothing added to commit but untracked files present` | Hice `git add` de `.gitignore` y `entorno.md` sin haber guardado los cambios en VS Code | Guardé los archivos con `Ctrl + S`, verifiqué con `git status` y repetí el commit |
| `No local changes to save` al hacer `git stash` | No había cambios pendientes; todo ya estaba en un commit | Modifiqué un archivo sin hacer commit y repetí el `git stash` |
| No existía el archivo `03_Ejercicios_por_Tema.md` | El archivo no estaba en el repo ni en el material | Creé `semana-1/javascript/ejercicios-basicos.md` con 10 ejercicios de los temas de la autoinvestigación |

## Uso de IA hoy

- ¿La usé? Sí.
- ¿Para qué? Para guiarme paso a paso en el flujo de ramas, stash, revert y Pull Request, entender los errores de la terminal y resolver los ejercicios de JavaScript.
- ¿Qué aprendí de eso? Que hay que leer con atención lo que responde Git, porque mensajes como `nothing added to commit` o `No local changes to save` explican exactamente qué está pasando.

## Autoevaluación del tema (1-5): 4

Logré trabajar con ramas, stash y Pull Request, y resolver los ejercicios de JavaScript, pero todavía necesito practicar más `rebase` y `reduce` para usarlos con seguridad.