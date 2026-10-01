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

-
## Lo que no entendí o me costó

-
## Errores que tuve y cómo los resolví
| Error | Causa | Solución |
|---|---|---|


## Uso de IA hoy

## Autoevaluación del tema (1-5):4




Comando git log --oneline --graph
ndrendon@ndrendon UCRT64 ~/Documents/cielum-induccion-nicolas (main)
$ git log --oneline --graph
* 650c34b (HEAD -> main) docs: crear bitácora del día 01
* d7f3b69 chore: agregar .gitignore
* c8ed620 chore: agregar .gitignore~
* 8089692 docs: agregar README inicial

Comando git diff --staged
ndrendon@ndrendon UCRT64 ~/Documents/cielum-induccion-nicolas (main)
$ git diff --staged

ndrendon@ndrendon UCRT64 ~/Documents/cielum-induccion-nicolas (main)
$ git add bitacora/dia-01.md
git diff --staged
warning: in the working copy of 'bitacora/dia-01.md', LF will be replaced by CRLF the next time Git touches it
diff --git a/bitacora/dia-01.md b/bitacora/dia-01.md
index 7dbaf02..e7b81ff 100644
--- a/bitacora/dia-01.md
+++ b/bitacora/dia-01.md
@@ -1 +1,153 @@
-# Bitácora - Día 01
+# 05 · Plantilla de Bitácora Diaria
+Copia esta plantilla en `bitacora/dia-XX.md` cada día (por ejemplo `bitacora/dia-03.md`) y llénala a lo largo de la jornada, no al final.
+
+**Reglas de la bitácora**
+- Responde con tus palabras. Una respuesta copiada de internet o de una IA vale 2.0.

Comando git commit -m "docs: documentar comando" escrito mal a proposito
ndrendon@ndrendon UCRT64 ~/Documents/cielum-induccion-nicolas (main)
$ git commit -m "docs: documentar comando"
On branch main
Your branch is based on 'origin/main', but the upstream is gone.
  (use "git branch --unset-upstream" to fixup)

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        entorno.md

nothing added to commit but untracked files present (use "git add" to track)

Comando git commit --amend para corregirlo
ndrendon@ndrendon UCRT64 ~/Documents/cielum-induccion-nicolas (main)
$ git commit --amend -m "docs: documentar comandos avanzados en bitácora"
git log --oneline --graph
[main 46cc144] docs: documentar comandos avanzados en bitácora
 Date: Wed Sep 30 12:02:41 2026 -0500
 1 file changed, 1 insertion(+)
 create mode 100644 bitacora/dia-01.md
* 46cc144 (HEAD -> main) docs: documentar comandos avanzados en bitácora
* d7f3b69 chore: agregar .gitignore
* c8ed620 chore: agregar .gitignore~
* 8089692 docs: agregar README inicial

ndrendon@ndrendon UCRT64 ~/Documents/cielum-induccion-nicolas (main)
$ git push -u origin main
Enumerating objects: 13, done.
Counting objects: 100% (13/13), done.
Delta compression using up to 8 threads
Compressing objects: 100% (7/7), done.
Writing objects: 100% (13/13), 1.14 KiB | 233.00 KiB/s, done.
Total 13 (delta 1), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (1/1), done.
To github.com:ndrendon/cielum-induccion-nicolas.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.

Uso de los comandos avanzados
- `git log --oneline --graph`: me mostró el historial de commits resumido, una línea por commit con su código corto (hash) y un gráfico de las ramas.
- `git diff --staged`: me mostró los cambios que ya había agregado con `git add` pero que todavía no había guardado con commit. Las líneas nuevas salen en verde con `+`.
- `git commit --amend`: me permitió corregir el mensaje del último commit sin crear uno nuevo. Noté que el hash del commit cambió.
```