# Bitácora Día 15 · Cierre del proyecto integrador y sustentación

**Fecha:** 23-10-2026

**Horas invertidas:** 8 h

## Qué hicimos hoy

Hoy terminé el proyecto integrador y lo expuse.

- Pulí el proyecto: el README de la raíz del repo y el del proyecto, con los pasos para prenderlo, la demo de 5 minutos, las pruebas y una tabla de errores.
- Hice el diagrama de arquitectura en `docs/arquitectura.md`. Tiene qué hace cada parte, el camino de un pedido, la API por capas, la base de datos, la seguridad, el manejo de errores y qué cambia entre el modo local y el modo Docker.
- Arreglé lo que estaba mal en el repo: `entorno.md` tenía caracteres raros de la terminal, `configuracion.md` de Zoho mostraba capturas que no existían, y la bitácora del día 14 decía una variable del front que no es la que usa el código.
- Dejé la base, n8n y Mailpit en Docker, compartidos por los dos modos del proyecto. En el modo local corren la API y la página con `npm run dev`; en el modo Docker corre todo en contenedores. Así todo queda guardado en un solo lugar.
- Uní todas mis ramas a `main` con `git merge --no-ff`, en el orden de los días, y después las borré.
- Preparé la sustentación: el guion de la demo, el cambio en vivo de agregar el teléfono al cliente, cómo buscar un error y las preguntas para repasar.
- Expuse el proyecto terminado a mi líder Esteban en una reunión.
- En la reunión también se habló del diagnóstico y de a qué parte se asigna a cada practicante. Yo quedé en la parte de Zoho.

## Cómo quedó el proyecto

El proyecto es una tienda. El vendedor entra a una página, hecha en React y también en Vue, y crea pedidos. La API, en Node.js con Express, revisa el token JWT y los datos, y guarda el pedido en PostgreSQL en una transacción. Después le avisa a n8n por un webhook, sin hacer esperar al vendedor. n8n busca el cliente en Zoho CRM: si existe lo actualiza y si no lo crea, deja el resultado en la tabla `log_integraciones` y manda un correo que se ve en Mailpit. Un bot de Python con Playwright entra a la página y arma el reporte diario en Excel.

Tiene 32 pruebas automáticas en la API y una colección de Postman con 135 pruebas. Se puede correr de dos formas: en el modo local, con la API y la página en el computador, o todo en Docker con `docker compose up -d --build`. En los dos modos se usan la misma base, el mismo n8n y el mismo Mailpit.

## Lo que aprendí hoy (3 cosas)

- A unir varias ramas a `main` con `git merge --no-ff`, una por una y en orden, para que en el historial quede un commit de merge por cada tema. Cuando hubo un conflicto en el `README.md`, me quedé con la versión de la rama con `git checkout --theirs README.md`, y con `git branch --merged main` revisé que todas las ramas estuvieran dentro de `main` antes de borrarlas. También aprendí que los comandos de Git se corren parado en la raíz del repo.
- La diferencia entre correr el proyecto en el computador y en Docker. En el computador todo se habla por `localhost`; dentro de Docker cada contenedor encuentra a los otros por el nombre del servicio, como `postgres` o `n8n`. Los datos de los contenedores quedan en los volúmenes, que no se borran al apagarlos, solo con `docker compose down -v`.
- A documentar la arquitectura con diagramas de Mermaid escritos dentro del Markdown: un diagrama de las partes, uno de la secuencia de un pedido y uno de las tablas. GitHub los dibuja solos.

## Lo que no entendí o me costó

- La llave de cifrado de n8n (`N8N_ENCRYPTION_KEY`). n8n cifra las credenciales con esa llave, así que si la llave cambia, o si se usan los datos de un n8n con otra llave, n8n ya no arranca.
- Que el n8n instalado con npm y el de Docker eran dos instalaciones distintas, cada una con su propia cuenta, sus credenciales y sus workflows.
- Preparar la demo y el cambio en vivo: saber qué archivos se tocan en cada capa para agregar un campo, desde la base hasta Zoho.

## Errores que tuve y cómo los resolví

| Error | Causa | Solución |
| --- | --- | --- |
| El commit del día 14 no se hizo: `git add` no encontraba los archivos | La terminal estaba parada en `proyecto/rpa` y no en la raíz del repo | Volví a la raíz con `cd C:\Users\ndrendon\Documents\cielum-induccion-nicolas` y repetí el `git add` y el commit |
| Los merges de las dos primeras ramas de SQL quedaron hechos en `feature/rpa-n8n` y no en `main` | `git switch main` falló porque había cambios sin commit, así que seguía en la rama del día 14 | Hice el commit del día 14 desde la raíz, me pasé a `main` y desde ahí uní las ramas en orden. Esos merges quedaron en la historia de `feature/rpa-n8n`, pero no dañan nada porque esas ramas igual entraron a `main` |
| Conflicto en `README.md` al unir `feature/docker` a `main` | En `main` el README solo tenía el título, y en la rama estaba completo | `git checkout --theirs README.md`, `git add README.md` y `git commit --no-edit` |
| Docker Compose no arrancaba: `required variable JWT_SECRET is missing a value` | Copié el `.env.example` encima del `.env` y se borraron los valores | Volví a llenar el `proyecto/.env`. El `.env.example` se copia una sola vez |
| n8n no arrancaba: `Deployment key 'signing.hmac' cannot be read with this instance encryption key` | Pasé los datos del n8n de Docker al n8n local, que tenía otra llave de cifrado | Borré los datos de n8n y dejé uno solo, en Docker, para los dos modos, con una llave que no se cambia |
| n8n pedía crear una cuenta nueva | Estaba abriendo el n8n instalado con npm, que guarda sus datos aparte del de Docker | Dejé un solo n8n, el de Docker, y lo preparé una vez |

## Uso de IA hoy

- ¿La usé? Sí.
- ¿Para qué? Para pulir los README y hacer el diagrama de arquitectura, para probar en una copia del repo el merge de todas las ramas antes de hacerlo en el mío, para ensayar el cambio en vivo del teléfono, para armar una guía de estudio de la sustentación y para resolver los errores de n8n y de Docker.
- ¿Qué aprendí de eso? Que los cambios grandes, como unir todas las ramas, conviene probarlos primero en una copia, y que hay que leer el mensaje de error completo antes de intentar arreglarlo.

## Autoevaluación del tema (1-5): 4

Terminé el proyecto integrador con todas sus partes funcionando y lo expuse. Todavía necesito practicar Docker con volúmenes y variables, y cómo se guarda la configuración de n8n.
