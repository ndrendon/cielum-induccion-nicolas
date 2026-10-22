# 03 · Ejercicios por tema: JavaScript básico

Estos son los 10 ejercicios de JavaScript básico. El código completo está en `fundamentos.js` y se ejecuta con:

```bash
node semana-1/javascript/fundamentos.js
```

## Ejercicio 1: tipos de datos

**Enunciado:** declarar variables de distintos tipos y mostrar su tipo con `typeof`.

```js
const nombre = "Nicolas";
const horasPractica = 6;
const esPracticante = true;
let proyecto;
const jefe = null;
console.log(typeof nombre, typeof horasPractica, typeof esPracticante, typeof proyecto, typeof jefe);
```

**Salida:**

```text
string number boolean undefined object
```

`proyecto` da `undefined` porque se declaró sin valor. `null` da `object`, que es un error histórico de JavaScript.

## Ejercicio 2: let, const y var

**Enunciado:** comparar cómo se comportan `let`, `const` y `var` al reasignar valores y dentro de un bloque.

```js
const empresa = "Cielum";
let horas = 6;
horas = horas + 2;
if (true) {
  var dentroVar = "visible fuera del bloque";
  let dentroLet = "solo dentro del bloque";
}
console.log(empresa, horas);
console.log(dentroVar);
console.log(typeof dentroLet);
```

**Salida:**

```text
Cielum 8
visible fuera del bloque
undefined
```

`let` se puede reasignar y `const` no. `var` se puede ver fuera del `if` porque no respeta el bloque, mientras que `dentroLet` no existe afuera.

## Ejercicio 3: == vs ===

**Enunciado:** comparar valores con igualdad flexible (`==`) y estricta (`===`).

```js
console.log(5 == "5", 5 === "5");
console.log(0 == false, 0 === false);
console.log(null == undefined, null === undefined);
```

**Salida:**

```text
true false
true false
true false
```

`==` convierte los tipos antes de comparar. `===` compara valor y tipo, por eso es mejor usarlo siempre.

## Ejercicio 4: if/else

**Enunciado:** clasificar una nota como Excelente (4.5 o más), Aprobado (3 o más) o Reprobado.

```js
const nota = 4.2;
if (nota >= 4.5) {
  console.log("Excelente");
} else if (nota >= 3) {
  console.log("Aprobado");
} else {
  console.log("Reprobado");
}
```

**Salida:**

```text
Aprobado
```

## Ejercicio 5: switch

**Enunciado:** mostrar el nombre del día de la semana según un número del 1 al 7.

```js
const dia = 3;
switch (dia) {
  case 1: console.log("Lunes"); break;
  case 2: console.log("Martes"); break;
  case 3: console.log("Miércoles"); break;
  case 4: console.log("Jueves"); break;
  case 5: console.log("Viernes"); break;
  case 6: console.log("Sábado"); break;
  case 7: console.log("Domingo"); break;
  default: console.log("Día no válido");
}
```

**Salida:**

```text
Miércoles
```

El `break` evita que siga ejecutando los demás casos.

## Ejercicio 6: bucle for

**Enunciado:** imprimir la tabla de multiplicar del 7.

```js
for (let i = 1; i <= 10; i++) {
  console.log(`7 x ${i} = ${7 * i}`);
}
```

**Salida:**

```text
7 x 1 = 7
7 x 2 = 14
7 x 3 = 21
7 x 4 = 28
7 x 5 = 35
7 x 6 = 42
7 x 7 = 49
7 x 8 = 56
7 x 9 = 63
7 x 10 = 70
```

## Ejercicio 7: bucle while

**Enunciado:** sumar los números del 1 al 100.

```js
let numero = 1;
let suma = 0;
while (numero <= 100) {
  suma += numero;
  numero++;
}
console.log(suma);
```

**Salida:**

```text
5050
```

## Ejercicio 8: función normal vs flecha

**Enunciado:** calcular el IVA (19 %) de un precio con una función normal y con una función flecha.

```js
function calcularIvaNormal(precio) {
  return precio * 0.19;
}
const calcularIvaFlecha = (precio) => precio * 0.19;
console.log(calcularIvaNormal(100000), calcularIvaFlecha(100000));
```

**Salida:**

```text
19000 19000
```

Las dos dan el mismo resultado. La flecha es más corta y, cuando tiene una sola línea, devuelve el valor sin escribir `return`.

## Ejercicio 9: arrays

**Enunciado:** crear una lista de tareas, agregar una, mostrar su tamaño, el primer elemento, recorrerla y buscar una tarea.

```js
const tareas = ["Crear rama", "Resolver ejercicios", "Abrir PR"];
tareas.push("Subir bitácora");
console.log(tareas.length);
console.log(tareas[0]);
for (const tarea of tareas) {
  console.log("- " + tarea);
}
console.log(tareas.includes("Abrir PR"));
```

**Salida:**

```text
4
Crear rama
- Crear rama
- Resolver ejercicios
- Abrir PR
- Subir bitácora
true
```

## Ejercicio 10: objetos

**Enunciado:** crear un objeto `practicante`, modificarlo, acceder a sus propiedades y recorrerlo.

```js
const practicante = {
  nombre: "Nicolas",
  empresa: "Cielum",
  habilidades: ["C#", "SQL"]
};
practicante.habilidades.push("JavaScript");
practicante.semana = 1;
console.log(practicante.nombre, practicante["empresa"]);
for (const clave in practicante) {
  console.log(clave + ": " + practicante[clave]);
}
```

**Salida:**

```text
Nicolas Cielum
nombre: Nicolas
empresa: Cielum
habilidades: C#,SQL,JavaScript
semana: 1
```

Aunque el objeto es `const`, se le pueden agregar propiedades y modificar su arreglo, porque lo que no cambia es la referencia al objeto.
