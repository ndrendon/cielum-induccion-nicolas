# Ejercicios del día 14: RPA y n8n

| Carpeta | Ejercicio | Qué tiene |
|---|---|---|
| `01-basico/` | n8n en Docker y un flujo **Manual Trigger → HTTP Request → archivo** | `productos-a-archivo.json` |
| `02-intermedio/` | Bot de Playwright que llena un formulario de práctica y toma capturas | `llenar_formulario.py` y `requirements.txt` |
| `03-avanzado/` | Error Workflow que avisa por correo cuando falla un flujo | `aviso-de-errores.json` y `flujo-que-falla.json` |

Los archivos `.json` son workflows de n8n exportados: se importan desde la página de n8n. No tienen credenciales ni secretos.

La página de n8n está en inglés. En esta guía los botones y los menús van con el nombre que muestra n8n.

## Antes de empezar: n8n en Docker

n8n y Mailpit están en el `docker-compose.yml` del proyecto (parte 7). Así hay un solo n8n para los ejercicios y para el reto.

1. **Agrega los dos valores nuevos al `.env` del proyecto.** Abre `proyecto/.env` y agrega, al final, las dos variables que están en `proyecto/.env.example`:

   ```text
   N8N_ENCRYPTION_KEY=
   N8N_WEBHOOK_SECRET=
   ```

   Cada una lleva un texto aleatorio distinto. Para crear cada texto, corre este comando y copia lo que sale:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   - `N8N_ENCRYPTION_KEY` es la llave con la que n8n cifra las credenciales. No la cambies después: si cambia, n8n ya no puede leer las credenciales guardadas.
   - `N8N_WEBHOOK_SECRET` es el secreto que la API le manda a n8n en cada aviso de un pedido nuevo (lo usa el reto).

2. **Prende todo.** Parado en la carpeta `proyecto`:

   ```powershell
   docker compose up -d --build
   ```

   El `--build` vuelve a construir la imagen de la API, que cambió en la parte 7. La primera vez también descarga las imágenes de n8n y Mailpit.

3. **Crea tu cuenta de n8n.** Abre <http://localhost:5678>. La primera vez n8n pide crear la cuenta del dueño (**Set up owner account**): correo, nombre, apellido y contraseña. Esa cuenta solo existe en tu n8n; no se crea nada en internet. Si después pregunta por tu empresa o te ofrece una licencia gratis, puedes saltarlo.

4. **Revisa Mailpit.** Abre <http://localhost:8025>. Ahí van a llegar los correos que mande n8n. Mailpit los recibe y los muestra, pero no los envía a internet.

**Si la API corre en el modo local** (`npm run dev`, ver [`../../proyecto/README.md`](../../proyecto/README.md)), n8n sigue en Docker, pero no hay un contenedor `api`. En los nodos **HTTP Request**, usa `http://host.docker.internal:3000` en lugar de `http://api:3000`: así n8n llega desde Docker a la API que corre en el computador.

## Básico: Manual Trigger → HTTP Request → archivo

El flujo pide la lista de productos a la API del proyecto, la convierte en un archivo CSV y lo guarda en la carpeta compartida de n8n. Esa carpeta es `/home/node/.n8n-files` dentro del contenedor y `proyecto/n8n/archivos` en tu computador. Es la única carpeta donde n8n deja leer y escribir archivos.

**Opción A: armarlo a mano (la mejor para aprender).**

1. En **Overview**, dale **Create workflow**.
2. Clic en **Add first step...** y escoge **Trigger manually**. Es el nodo **Manual Trigger**: el flujo corre cuando le das el botón de ejecutar.
3. Clic en el **+** que sale a la derecha del nodo, busca **HTTP Request** y llénalo:
   - Method: `GET`
   - URL: `http://api:3000/productos`

   Se usa `api`, el nombre del servicio en Docker, porque dentro del contenedor de n8n `localhost` es el mismo n8n.
4. Clic en el **+** → busca **Convert to File** → escoge **Convert to CSV**. En **Options** → **Add option** → **File Name** escribe `productos.csv`.
5. Clic en el **+** → busca **Read/Write Files from Disk** → escoge **Write File to Disk**. En **File Path and Name** escribe `/home/node/.n8n-files/productos.csv`.
6. Clic en el nombre del workflow, arriba a la izquierda, y ponle `Ejercicio básico: productos a un archivo`.
7. Dale **Execute workflow**. Los cuatro nodos deben quedar con un chulo verde.

**Opción B: importarlo.** Dale **Create workflow**, luego el menú **...** que está al lado del nombre → **Import** → **From file**, y escoge `01-basico/productos-a-archivo.json`. Después dale **Execute workflow**.

**Revisa el resultado.** En tu computador abre `proyecto/n8n/archivos/productos.csv`: debe tener los 10 productos, con las columnas `id_producto`, `nombre`, `categoria`, `precio` y `stock`. Ese archivo no se sube a Git.

Al hacer clic en cada nodo ves los datos que entraron y salieron. Fíjate que la API devolvió una lista y n8n la convirtió en 10 items: cada nodo trabaja con todos los items que le llegan.

## Intermedio: bot de Playwright que llena un formulario

`02-intermedio/llenar_formulario.py` entra al formulario de práctica de Selenium (<https://www.selenium.dev/selenium/web/web-form.html>), que es una página pública hecha para practicar automatización. El bot:

1. Llena el texto, la contraseña, el área de texto, la lista desplegable, el datalist, una casilla, un botón de opción y la fecha.
2. Toma una captura del formulario lleno.
3. Le da **Submit** y espera a que la página diga **Form submitted** y **Received!**.
4. Toma otra captura con la confirmación.

Si algo falla, toma una captura del error.

**Cómo correrlo**, en PowerShell, desde la raíz del repo:

```powershell
cd semana-3/rpa-n8n/02-intermedio
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
playwright install chromium
python llenar_formulario.py --ver
```

- `playwright install chromium` descarga el navegador que usa Playwright. Se hace una sola vez.
- Con `--ver` se abre el navegador y se ve al bot trabajando. Sin `--ver` trabaja sin mostrar la ventana.
- Las capturas quedan en `02-intermedio/capturas/`, con la fecha y la hora en el nombre: `formulario-lleno_...png` y `formulario-enviado_...png`. Así cada corrida guarda capturas nuevas sin borrar las anteriores.

**Lo que tiene de buenas prácticas:**

- **Selectores robustos:** cada campo se busca por su etiqueta, con `get_by_label('Text input')`, y el botón por su rol y su texto, con `get_by_role('button', name='Submit')`. No depende de la posición de los elementos en el HTML.
- **Esperas:** no hay `time.sleep`. Playwright espera solo a que cada campo esté listo antes de escribir, y `expect(...).to_be_visible()` reintenta hasta que aparece la confirmación, máximo 15 segundos.
- **Capturas en error:** si algo falla, el bloque `except` guarda `capturas/error_...png` con lo que había en la pantalla.

## Avanzado: Error Workflow que avisa por correo

`aviso-de-errores.json` es el **Error Workflow**: empieza con un **Error Trigger** y manda un correo con el workflow, el nodo y el error. `flujo-que-falla.json` es un flujo que falla a propósito: pide los pedidos a la API sin token, así que la API responde 401 y el nodo falla.

1. **Crea la credencial de correo.** En **Overview** → pestaña **Credentials** → **Create credential**. Busca **SMTP**, dale **Continue** y llena:
   - User: `n8n`
   - Password: `n8n`
   - Host: `mailpit`
   - Port: `1025`
   - SSL/TLS: apagado

   Mailpit acepta cualquier usuario y contraseña. Clic en el título **SMTP account**, arriba, y cámbialo a `SMTP de Mailpit`. Dale **Save**.
2. **Importa el Error Workflow.** **Create workflow** → **...** → **Import** → **From file** → `03-avanzado/aviso-de-errores.json`. Sale el aviso **Credentials auto-added**: n8n le puso al nodo de correo la credencial que acabas de crear. Abre el nodo **Enviar el aviso por correo** y revisa que diga `SMTP de Mailpit`.
3. **Publícalo.** Dale **Publish** y, en la ventana, otra vez **Publish**. El Error Workflow tiene que estar publicado; si no, n8n no deja escogerlo en otro workflow y responde *The selected error workflow has no published version*.
4. **Importa el flujo que falla** en otro workflow nuevo: **Create workflow** → **...** → **Import** → **From file** → `03-avanzado/flujo-que-falla.json`.
5. **Escoge el Error Workflow.** En ese mismo flujo: **...** → **Settings** → en **Error Workflow (to notify when this one errors)** escoge **Aviso de errores** → **Save**.
6. **Publica el flujo que falla** con **Publish**.
7. **Hazlo fallar.** Abre en el navegador <http://localhost:5678/webhook/probar-error>. Sale `{"message":"Workflow was started"}`.
8. **Revisa el correo.** En Mailpit (<http://localhost:8025>) llega *Falló el workflow "Ejercicio avanzado: flujo que falla"*, con el nodo que falló (**Pedir pedidos sin token**), el error y el enlace a la ejecución.
9. **Revisa las ejecuciones.** En n8n, pestaña **Executions** de cada workflow: el flujo que falla aparece con error y **Aviso de errores** aparece con éxito.

El Error Workflow solo corre cuando falla una ejecución de producción, es decir, de un workflow publicado que arrancó solo. Si le das **Execute workflow** al flujo que falla, el nodo falla pero no llega ningún correo.

## Lo que pide cada ejercicio y dónde queda

| Ejercicio | Qué se hace | Dónde se ve |
|---|---|---|
| Básico | n8n en Docker y el flujo Manual Trigger → HTTP Request → archivo | `proyecto/docker-compose.yml` (servicio `n8n`), `01-basico/` y `proyecto/n8n/archivos/productos.csv` |
| Intermedio | Bot de Playwright que llena un formulario público y toma capturas | `02-intermedio/llenar_formulario.py` y `02-intermedio/capturas/` |
| Avanzado | Error Workflow que avisa por correo cuando falla un flujo | `03-avanzado/` y el correo en Mailpit |
