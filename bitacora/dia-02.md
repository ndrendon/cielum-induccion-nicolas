# Bitácora - Día 02

Copia esta plantilla en `bitacora/dia-XX.md` cada día (por ejemplo `bitacora/dia-03.md`) y llénala a lo largo de la jornada, no al final.

**Reglas de la bitácora**
- Responde con tus palabras. Una respuesta copiada de internet o de una IA vale 2.0.
- Cada respuesta con un ejemplo propio, aunque sea pequeño.
- Pon la fuente (enlace a la documentación oficial que usaste).
- Se sube con commit `docs(bitacora): dia XX` antes de las 5:00 p.m.

---

```markdown
# Bitácora Día 01 · [Inducción Cielum + entorno de trabajo + Git básico]
**Fecha:*01-10-2026*
**Horas invertidas:*6* autoinvestigación 3 h · práctica _2_ h · reto _1_ h

## Autoinvestigación básica
1. Pregunta: Git: ¿qué es una rama? branch, switch/checkout, merge. ¿Qué es un conflicto y cómo se resuelve? ¿Qué es un Pull Request?
   Respuesta (con mis palabras):
   Una rama es una línea de trabajo independiente que permite hacer cambios sin afectar la rama principal (main).
   - `git branch`: crea o lista ramas.
   - `git switch` / `git checkout`: cambia de rama. `switch` es el comando más reciente y solo sirve para eso; `checkout` es más antiguo y también restaura archivos.
   - `git merge`: une los cambios de otra rama en la rama actual.
   Un conflicto ocurre cuando dos ramas modifican las mismas líneas de un archivo y Git no sabe cuál conservar. Se resuelve abriendo el archivo, dejando el contenido correcto entre los marcadores `<<<<<<<`, `=======` y `>>>>>>>`, y luego ejecutando `git add` y `git commit`.
   Un Pull Request es una solicitud en GitHub o GitLab para fusionar una rama en otra, de modo que el equipo revise y apruebe los cambios antes del merge.
   Ejemplo propio:
    bash
   git switch -c feature/doc
   git add .
   git commit -m "docs: guía"
   git switch main
   git merge feature/doc

   Primero creo la rama `feature/doc` y me cambio a ella con `git switch -c`. Luego preparo los cambios con `git add .` y los guardo con `git commit`. Después vuelvo a `main` y uno los cambios de la rama con `git merge`. Si main también modificó las mismas líneas, Git marca un conflicto: lo resuelvo editando el archivo y luego hago `git add` y `git commit`. En un equipo, en lugar de hacer el merge directo, subiría la rama y abriría un Pull Request para que la revisen.
   Fuente: https://git-scm.com/book/es/v2/Ramificaciones-en-Git-%C2%BFQu%C3%A9-es-una-rama%3F | https://docs.github.com/es/pull-requests

2. Pregunta: JS: tipos de datos, let vs const vs var, == vs ===, condicionales, bucles, funciones normales vs flecha, arrays y objetos
   Respuesta (con mis palabras):
   - Tipos de datos: primitivos (`string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`) y `object`, que incluye arrays y funciones.
   - `var` tiene ámbito de función y se puede redeclarar. `let` tiene ámbito de bloque y se puede reasignar. `const` tiene ámbito de bloque y no se puede reasignar. Se recomienda usar `const` por defecto, `let` cuando el valor cambia, y evitar `var`.
   - `==` compara convirtiendo tipos (`"3" == 3` da true). `===` compara valor y tipo (`"3" === 3` da false), así que es más seguro.
   - Condicionales: `if / else`, `switch` y el ternario `condición ? a : b`.
   - Bucles: `for`, `while`, `for...of` (recorre valores) y `for...in` (recorre claves de un objeto).
   - La función flecha tiene sintaxis más corta y no tiene su propio `this`. La función normal sí lo tiene y puede usarse antes de declararse (hoisting).
   - Arrays: listas ordenadas por índice (`[1, 2, 3]`). Objetos: pares clave-valor (`{ nombre: "Nicolas" }`).
   Ejemplo propio:
    js
   const notas = [3, 5, 2];
   let total = 0;
   for (const n of notas) total += n;
   const aprobo = (x) => x >= 3;
   const estudiante = { nombre: "Nicolas" };
   console.log(notas.filter(aprobo));
   console.log("3" == 3, "3" === 3);
   console.log(total >= 9 ? "Bien" : "Mejorar");

   `notas` es un array declarado con `const` porque la variable no se reasigna, y `total` usa `let` porque su valor cambia. El bucle `for...of` recorre cada nota y la suma al total. `aprobo` es una función flecha que devuelve true si la nota es mayor o igual a 3, y `estudiante` es un objeto con una clave `nombre`. `filter(aprobo)` devuelve solo las notas aprobadas: `[3, 5]`. La comparación muestra `true false`, porque `==` convierte el texto a número y `===` también compara el tipo. Por último, el ternario evalúa si el total (10) es mayor o igual a 9 e imprime "Bien".
   Fuente: https://developer.mozilla.org/es/docs/Web/JavaScript/Guide | https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/Arrow_functions


## Autoinvestigación avanzada
1. Git: rebase vs merge (cuándo sí, cuándo no), stash, cherry-pick, reset (soft/mixed/hard) vs revert, tags, GitFlow vs trunk-based.
   - Rebase vs merge: `merge` une dos ramas con un commit de unión y conserva el historial tal como ocurrió. `rebase` mueve mis commits encima de otra rama y deja un historial lineal. Rebase conviene para actualizar mi rama local antes de un Pull Request. No se debe usar en ramas compartidas ya subidas, porque reescribe el historial. En esos casos se usa merge.
   - `stash`: guarda temporalmente los cambios sin hacer commit, para cambiar de rama. `git stash pop` los recupera.
   - `cherry-pick`: copia un commit específico de otra rama a la rama actual.
   - `reset` mueve la rama a un commit anterior: `--soft` conserva los cambios preparados, `--mixed` los conserva sin preparar y `--hard` los elimina. `revert` crea un commit nuevo que deshace otro, sin borrar historial. `reset` se usa en cambios locales y `revert` en cambios ya compartidos.
   - Tags: etiquetas que marcan un commit importante, normalmente una versión (v1.0).
   - GitFlow usa varias ramas de larga duración (main, develop, feature, release, hotfix) y sirve para proyectos con versiones planificadas. Trunk-based trabaja sobre una rama principal con ramas cortas e integraciones frecuentes, y es más ágil al apoyarse en integración continua.

2. JS: métodos de arrays (map, filter, reduce, find, some, every, sort), desestructuración, spread/rest, template literals, truthy/falsy, optional chaining (?.), nullish coalescing (??).
   - Métodos de arrays: `map` transforma cada elemento en un array nuevo, `filter` devuelve los que cumplen una condición, `reduce` acumula todo en un solo valor, `find` devuelve el primero que cumple, `some` es true si al menos uno cumple, `every` es true si todos cumplen y `sort` ordena el array modificando el original.
   - Desestructuración: extraer valores de un objeto o array en variables, por ejemplo `const { nombre } = usuario`.
   - Spread (`...`) expande un array u objeto para copiarlo o combinarlo. Rest (`...`) agrupa varios valores en un array, como los parámetros de una función.
   - Template literals: cadenas con comillas invertidas que insertan variables con `${}`.
   - Truthy/falsy: los valores falsy se evalúan como false (`false`, `0`, `""`, `null`, `undefined`, `NaN`). Todo lo demás es truthy.
   - Optional chaining (`?.`): accede a una propiedad sin error si el valor anterior es `null` o `undefined`, y devuelve `undefined`.
   - Nullish coalescing (`??`): asigna un valor por defecto solo si el valor es `null` o `undefined`. A diferencia de `||`, respeta `0` y `""`.

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

Informacion restante

ndrendon@ndrendon UCRT64 ~/Documents/cielum-induccion-nicolas (feature/js-fundamentos)
$ echo "console.log('prueba');" >> semana-1/javascript/fundamentos.js
git commit -am "test: línea de prueba"
git push
git log --oneline
git revert <hash-del-commit> --no-edit
git push
warning: in the working copy of 'semana-1/javascript/fundamentos.js', LF will be replaced by CRLF the next time Git touches it
[feature/js-fundamentos ca20c92] test: línea de prueba
 1 file changed, 2 insertions(+)
Enumerating objects: 9, done.
Counting objects: 100% (9/9), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (5/5), 432 bytes | 216.00 KiB/s, done.
Total 5 (delta 2), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To github.com:ndrendon/cielum-induccion-nicolas.git
   87c71c4..ca20c92  feature/js-fundamentos -> feature/js-fundamentos
ca20c92 (HEAD -> feature/js-fundamentos, origin/feature/js-fundamentos) test: línea de prueba
87c71c4 feat: ejercicios JS básico e intermedio
82645bf docs(bitacora): dia 02
cf4a2c6 docs: actualizar título del README
d57edf3 fix: corregir .gitignore y limpiar entorno.md
fab6503 (origin/main, origin/HEAD, main) docs: agregar versiones del entorno
7c2b678 docs: actualizar bitácora del día 01
46cc144 docs: documentar comandos avanzados en bitácora
d7f3b69 chore: agregar .gitignore
c8ed620 chore: agregar .gitignore~
8089692 docs: agregar README inicial
bash: hash-del-commit: No such file or directory
Everything up-to-date

ndrendon@ndrendon UCRT64 ~/Documents/cielum-induccion-nicolas (feature/js-fundamentos)
$ git revert b1f6a42 ca20c92 --no-edit
git push
git log --oneline -5
[feature/js-fundamentos 84f0a49] Revert "test: línea de prueba"
 Date: Fri Oct 2 09:01:24 2026 -0500
 1 file changed, 1 deletion(-)
[feature/js-fundamentos 56ec59b] Revert "test: línea de prueba"
 Date: Fri Oct 2 09:01:24 2026 -0500
 1 file changed, 2 deletions(-)
Enumerating objects: 14, done.
Counting objects: 100% (14/14), done.
Delta compression using up to 8 threads
Compressing objects: 100% (6/6), done.
Writing objects: 100% (10/10), 747 bytes | 124.00 KiB/s, done.
Total 10 (delta 5), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (5/5), completed with 2 local objects.
To github.com:ndrendon/cielum-induccion-nicolas.git
   b1f6a42..56ec59b  feature/js-fundamentos -> feature/js-fundamentos
56ec59b (HEAD -> feature/js-fundamentos, origin/feature/js-fundamentos) Revert "test: línea de prueba"
84f0a49 Revert "test: línea de prueba"
b1f6a42 test: línea de prueba
ca20c92 test: línea de prueba
87c71c4 feat: ejercicios JS básico e intermedio

ndrendon@ndrendon UCRT64 ~/Documents/cielum-induccion-nicolas (feature/js-fundamentos)
$ tail -3 semana-1/javascript/fundamentos.js
console.log("Pedido más caro:", masCaro);
console.log("Promedio por cliente:", promedioPorCliente);
console.log("Ejercicio en progreso");

ndrendon@ndrendon UCRT64 ~/Documents/cielum-induccion-nicolas (feature/js-fundamentos)
$ git switch main
git pull
git switch feature/js-fundamentos
git merge main
Switched to branch 'main'
Your branch is up to date with 'origin/main'.
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 3 (delta 1), reused 0 (delta 0), pack-reused 0 (from 0)
Unpacking objects: 100% (3/3), 970 bytes | 57.00 KiB/s, done.
From github.com:ndrendon/cielum-induccion-nicolas
   fab6503..68ae2d0  main       -> origin/main
Updating fab6503..68ae2d0
Fast-forward
 README.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
Switched to branch 'feature/js-fundamentos'
Your branch is up to date with 'origin/feature/js-fundamentos'.
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.

ndrendon@ndrendon UCRT64 ~/Documents/cielum-induccion-nicolas (feature/js-fundamentos|MERGING)
$ git add README.md
git commit --no-edit
git push
git log --oneline --graph -8
[feature/js-fundamentos e1fb833] Merge branch 'main' into feature/js-fundamentos
Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 371 bytes | 371.00 KiB/s, done.
Total 3 (delta 2), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (2/2), completed with 2 local objects.
To github.com:ndrendon/cielum-induccion-nicolas.git
   56ec59b..e1fb833  feature/js-fundamentos -> feature/js-fundamentos
*   e1fb833 (HEAD -> feature/js-fundamentos, origin/feature/js-fundamentos) Merge branch 'main' into feature/js-fundamentos
|\  
| * 68ae2d0 (origin/main, origin/HEAD, main) docs: cambio de título desde main
* | 56ec59b Revert "test: línea de prueba"
* | 84f0a49 Revert "test: línea de prueba"
* | b1f6a42 test: línea de prueba
* | ca20c92 test: línea de prueba
* | 87c71c4 feat: ejercicios JS básico e intermedio
* | 82645bf docs(bitacora): dia 02


