# Bitácora Día 01 · Inducción Cielum + entorno de trabajo + Git básico

**Fecha:** 30-09-2026

**Horas invertidas:** 6 h (autoinvestigación 3 h · práctica 2 h · reto 1 h)

## Autoinvestigación básica

1. **Pregunta:** ¿Qué es un sistema de control de versiones y por qué Git es "distribuido"?

   **Respuesta (con mis palabras):** Un sistema de control de versiones es un software encargado de gestionar o realizar un seguimiento de los cambios realizados en un proyecto o código en el que se trabaje, es muy importante ya que nos ayuda como desarrolladores a guardar una copia del código de forma permanente, teniéndolo a disposición para recuperarlo más adelante debido a un error, así mismo para tener un registro de cambios realizados o para reutilizarlo para otras tareas.

   Git es uno de los principales VCS, en base a lo consultado, Git es distribuido ya que no se necesita tener un único servidor central, sino que cada persona tiene una copia exacta de ese código o archivo que se está utilizando.

   **Ejemplo propio:** Un ejemplo básico sería el git como una máquina del tiempo, que si yo estoy trabajando en una API, haciendo modificaciones en un controlador y por algún motivo dentro de esta modificación que hice la aplicación no me quiere compilar, yo pueda utilizar git para recuperar la versión funcional en la cual empecé a trabajar.

   **Fuente:** <https://learn.microsoft.com/es-es/devops/develop/git/what-is-version-control>

2. **Pregunta:** ¿Qué diferencia hay entre working directory, staging area y repositorio?

   **Respuesta (con mis palabras):** La diferencia principal radica en el nivel de permanencia y seguridad de los archivos. En el working directory los cambios son temporales y vulnerables, es decir que si por error borras algo, no hay manera de recuperarlo. En el staging area los cambios siguen siendo temporales pero ya están preseleccionados y separados del resto del desorden para armar un paquete. Y en el repositorio la diferencia es que los cambios ya son definitivos, asegurados y forman parte del historial permanente del proyecto al que siempre puedes regresar.

   **Ejemplo propio:** En mi proyecto webSuperMkdo estaba modificando la clase de conexión en libCnxBD y el formulario de login para usar el procedimiento almacenado de búsqueda de usuarios en tblUsuario. Mientras edito esos archivos, los cambios están solo en el working directory, si borro por error un método de la clase de conexión y cierro Visual Studio sin guardar una versión, lo pierdo. Cuando termino la parte de la conexión y verifico que funciona, hago `git add libCnxBD/clsConexion.cs`, y ese archivo pasa al **staging area**, separado del formulario de login que todavía está a medias. Finalmente hago `git commit -m "Conexión a bdSuperMkdo con SP de búsqueda de usuario"` y ese cambio queda guardado en el **repositorio**; si más adelante daño la conexión, puedo volver a ese commit y recuperar la versión que funcionaba.

   **Fuente:** <https://www.geeksforgeeks.org/git/states-of-a-file-in-git-working-directory/>

3. **Pregunta:** ¿Para qué sirven git init, clone, status, add, commit, log, diff, push, pull?

   **Respuesta (con mis palabras):**

   - `git init`: convierte una carpeta en un repositorio Git, creando la carpeta oculta `.git` donde se guarda el historial.
   - `git clone`: descarga una copia completa de un repositorio remoto (archivos + historial) a mi equipo.
   - `git status`: muestra el estado actual: qué archivos están modificados, cuáles están en staging y cuáles no tienen seguimiento.
   - `git add`: pasa cambios del working directory al staging area para incluirlos en el próximo commit.
   - `git commit`: guarda los cambios del staging area en el repositorio como una versión permanente con un mensaje descriptivo.
   - `git log`: muestra el historial de commits (autor, fecha, mensaje e identificador).
   - `git diff`: muestra las diferencias línea por línea entre versiones (por ejemplo, lo modificado y aún no agregado al staging).
   - `git push`: envía mis commits locales al repositorio remoto (GitHub, GitLab, etc.).
   - `git pull`: trae los cambios del repositorio remoto y los integra en mi rama local.

   **Ejemplo propio:** En webSuperMkdo uso `git init` para iniciar el repositorio. Modifico la clase de conexión, reviso con `git status` y `git diff` qué cambió, luego hago `git add` y `git commit` para guardarlo. Con `git log` veo el historial, con `git push` lo subo a GitHub, con `git pull` traigo los cambios de mis compañeros y con `git clone` descargo el proyecto en otro computador.

   **Fuente:** <https://git-scm.com/docs> · <https://git-scm.com/book/es/v2>

4. **Pregunta:** ¿Qué es un remoto y qué es origin?

   **Respuesta (con mis palabras):** Un remoto es una copia del repositorio alojada en otro lugar, normalmente en un servidor como GitHub o GitLab, que sirve para compartir el código y sincronizar el trabajo entre varias personas o equipos. `origin` es simplemente el nombre por defecto que Git le asigna al remoto principal cuando clono un repositorio; es un alias para no tener que escribir la URL completa cada vez.

   **Ejemplo propio:** Subo webSuperMkdo a GitHub y lo conecto con `git remote add origin https://github.com/usuario/webSuperMkdo.git`. Desde ahí, cuando hago `git push origin main` envío mis cambios a GitHub, y con `git pull origin main` traigo los cambios de mis compañeros.

   **Fuente:** <https://git-scm.com/book/es/v2/Fundamentos-de-Git-Trabajar-con-Remotos>

5. **Pregunta:** ¿Para qué sirve .gitignore? Da 5 ejemplos de qué NO se debe subir.

   **Respuesta (con mis palabras):** El archivo `.gitignore` le indica a Git qué archivos y carpetas debe ignorar, es decir, que no se rastreen ni se suban al repositorio. Sirve para no subir archivos generados automáticamente, configuraciones personales o información sensible que no hace parte del código fuente.

   Qué no debemos subir:

   - Carpetas de compilación (`bin/`, `obj/`).
   - Archivos de configuración del IDE (`.vs/`, `*.user`).
   - Cadenas de conexión o contraseñas (por ejemplo, un `Web.config` con credenciales reales).
   - Paquetes descargados (`packages/`, `node_modules/`).
   - Archivos temporales o logs (`*.log`, `*.tmp`).

   **Ejemplo propio:** En webSuperMkdo creo un `.gitignore` con `bin/`, `obj/` y `.vs/` para que solo se suba el código fuente del proyecto y de libCnxBD, y no los archivos que genera Visual Studio al compilar.

   **Fuente:** <https://git-scm.com/book/es/v2/Fundamentos-de-Git-Guardando-cambios-en-el-Repositorio> · <https://github.com/github/gitignore>

## Autoinvestigación avanzada

1. **¿Qué es Conventional Commits y por qué ayuda en equipo?**

   Conventional Commits es una convención para escribir los mensajes de commit con una estructura estándar: `tipo(alcance): descripción`, por ejemplo `feat(login): agregar validación de usuario` o `fix(conexion): corregir cadena de conexión`. Los tipos más comunes son `feat` (nueva funcionalidad), `fix` (corrección de error), `docs` (documentación), `refactor` (reestructuración sin cambiar comportamiento) y `chore` (tareas de mantenimiento).

   Ayuda en equipo porque todos escriben los commits de la misma forma, lo que hace el historial más claro y fácil de leer; permite identificar rápidamente qué tipo de cambio hizo cada integrante, facilita la revisión de código y hace posible automatizar tareas como generar el changelog o definir el versionado semántico del proyecto.

2. **¿Cómo se configura una llave SSH para GitHub y por qué es mejor que usuario/contraseña?**

   Para configurar una llave SSH primero se genera un par de llaves en el computador con el comando `ssh-keygen -t ed25519 -C "micorreo@ejemplo.com"`. Eso crea dos archivos: una llave privada, que se queda en mi equipo y no se comparte con nadie, y una llave pública (el archivo `.pub`). Luego copio el contenido de la llave pública y la agrego en GitHub en Settings > SSH and GPG keys > New SSH key. Por último, pruebo la conexión con `ssh -T git@github.com` y ya puedo clonar o hacer push usando la URL SSH del repositorio en vez de la HTTPS.

   Es mejor que usar usuario y contraseña porque no tengo que escribir mis credenciales cada vez que hago push o pull, y además es más seguro, ya que la llave privada nunca viaja por internet; GitHub solo verifica que yo tenga la llave que corresponde a la pública que registré. Además, GitHub ya no permite autenticarse con contraseña desde la terminal, así que SSH es una de las formas recomendadas.

3. **¿Qué es git config --global y qué debe tener configurado un desarrollador?**

   `git config --global` es el comando que uso para guardar configuraciones de Git que aplican a todos los repositorios de mi computador, no solo a uno. Esa configuración queda guardada en un archivo en mi carpeta de usuario (`.gitconfig`), entonces solo tengo que hacerlo una vez.

   Lo mínimo que debe tener configurado un desarrollador es su nombre y su correo, porque Git los usa para identificar quién hizo cada commit:

   ```bash
   git config --global user.name "Nicolas Rendon"
   git config --global user.email "micorreo@ejemplo.com"
   ```

   También es recomendable configurar el nombre de la rama principal (`git config --global init.defaultBranch main`) y el editor que se va a usar para los mensajes de commit (`git config --global core.editor "code --wait"`). Para revisar lo que tengo configurado uso `git config --global --list`.

## Lo que aprendí hoy (3 cosas)

- La diferencia entre working directory, staging area y repositorio, y cómo `git add` y `git commit` mueven los cambios entre ellos.
- A configurar Git con `git config --global` y a conectarme con GitHub por medio de una llave SSH, que es más segura que usar usuario y contraseña.
- A escribir commits con Conventional Commits (`docs:`, `chore:`, `feat:`, `fix:`) y a corregir el último commit con `git commit --amend`.

## Lo que no entendí o me costó

- Diferenciar las terminales de VS Code (PowerShell, Git Bash, UCRT64), porque los mismos comandos no funcionaban igual en todas.
- Entender cuándo es seguro usar `git commit --amend`, ya que cambia el hash del commit y no se debe usar después de hacer push.

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
| --- | --- | --- |
| La llave SSH intentó guardarse con un nombre incorrecto | Escribí `cat ~/.ssh/id_ed25519.pub` cuando `ssh-keygen` preguntaba la ruta del archivo | Cancelé con `Ctrl + C`, repetí `ssh-keygen` presionando Enter en cada pregunta y después ejecuté `cat` por separado |
| `git : El término 'git' no se reconoce...` | La terminal de VS Code era PowerShell y ahí Git no estaba disponible | Cambié la terminal a bash, donde Git sí funcionaba |
| El README creado desde PowerShell podía quedar con codificación incorrecta | PowerShell guarda con `echo` en UTF-16 | Volví a crear el README desde bash para que quedara en UTF-8 |
| `warning: LF will be replaced by CRLF` | Diferencia de saltos de línea entre Linux y Windows | Entendí que es solo una advertencia y no afecta el commit |

## Uso de IA hoy

- ¿La usé? Sí.
- ¿Para qué? Para que me guiara paso a paso en la configuración de Git y SSH, entender las preguntas teóricas y resolver los errores de la terminal.
- ¿Qué aprendí de eso? Que leer bien los mensajes de error ayuda a encontrar la causa rápido, y que es importante entender cada comando antes de ejecutarlo en lugar de solo copiarlo.

## Autoevaluación del tema (1-5): 4

Logré configurar el entorno, crear el repositorio y hacer los commits convencionales, pero todavía necesito practicar más el manejo de terminales y comandos avanzados como `--amend`.

## Evidencia de los comandos avanzados

### `git log --oneline --graph`

```text
ndrendon@ndrendon UCRT64 ~/Documents/cielum-induccion-nicolas (main)
$ git log --oneline --graph
* 650c34b (HEAD -> main) docs: crear bitácora del día 01
* d7f3b69 chore: agregar .gitignore
* c8ed620 chore: agregar .gitignore~
* 8089692 docs: agregar README inicial
```

### `git diff --staged`

```text
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
```

### `git commit -m "docs: documentar comando"` escrito mal a propósito

```text
ndrendon@ndrendon UCRT64 ~/Documents/cielum-induccion-nicolas (main)
$ git commit -m "docs: documentar comando"
On branch main
Your branch is based on 'origin/main', but the upstream is gone.
  (use "git branch --unset-upstream" to fixup)

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        entorno.md

nothing added to commit but untracked files present (use "git add" to track)
```

### `git commit --amend` para corregirlo

```text
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
```

### Uso de los comandos avanzados

- `git log --oneline --graph`: me mostró el historial de commits resumido, una línea por commit con su código corto (hash) y un gráfico de las ramas.
- `git diff --staged`: me mostró los cambios que ya había agregado con `git add` pero que todavía no había guardado con commit. Las líneas nuevas salen en verde con `+`.
- `git commit --amend`: me permitió corregir el mensaje del último commit sin crear uno nuevo. Noté que el hash del commit cambió.
