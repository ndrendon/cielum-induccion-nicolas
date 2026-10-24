# Bot de RPA: reporte diario de pedidos (proyecto integrador, parte 7)

`reporte_diario.py` es un bot de Python con Playwright. Hace lo mismo que haría una persona para armar el reporte del día:

1. Abre el frontend de React y entra con el usuario de prueba.
2. Lee la tabla de pedidos página por página, con el botón **Siguiente**, y se queda con los pedidos del día.
3. Escribe `salida/reporte_diario.xlsx` con openpyxl.

| Archivo | Qué es |
|---|---|
| `reporte_diario.py` | El bot |
| `requirements.txt` | Las librerías: Playwright, openpyxl y python-dotenv |
| `.env.example` | Plantilla del `.env`: la dirección del frontend y el usuario de prueba |
| `salida/` | Lo que genera el bot: el reporte y las capturas de los errores. No se sube a Git |

## Cómo se corre

Con la API y la página en React prendidas (ver **Opción 1: modo local** en [`../README.md`](../README.md)), en PowerShell, desde la raíz del repo:

```powershell
cd proyecto/rpa
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
playwright install chromium
Copy-Item .env.example .env
code .env
```

En el `.env` llena `RPA_CLAVE` con la contraseña del usuario `vendedor@cielum.test`. Es `Vendedor2026*`, y también sale en la página de login. `FRONTEND_URL` ya viene con `http://localhost:5173`, la página del modo local. En el modo Docker, cámbialo a `http://localhost:8080`.

Después, cada vez que quieras el reporte:

```powershell
python reporte_diario.py
```

| Comando | Qué hace |
|---|---|
| `python reporte_diario.py` | Reporte de los pedidos de hoy |
| `python reporte_diario.py --fecha 2026-10-01` | Reporte de otra fecha (con el formato AAAA-MM-DD) |
| `python reporte_diario.py --ver` | Muestra el navegador mientras el bot trabaja |

Para que haya pedidos de hoy, crea uno o dos en la página (<http://localhost:5173>), en **Nuevo pedido**. Los pedidos de los datos de ejemplo son de agosto, septiembre y el 1 de octubre: `python reporte_diario.py --fecha 2026-10-01` trae uno.

## Qué genera

`salida/reporte_diario.xlsx` tiene dos hojas:

- **Pedidos del día:** el título con la fecha, una tabla con el número del pedido, la fecha, el cliente, el estado y el total, y al final una fila con el total del día (una fórmula `SUM`). Los totales tienen formato de pesos.
- **Resumen por estado:** cuántos pedidos y cuánto dinero hubo en cada estado (`pendiente`, `enviado`, `entregado` y `cancelado`).

Si ese día no hubo pedidos, el reporte se crea igual y lo dice.

En la terminal, el bot deja un log de lo que va haciendo. Por ejemplo:

```text
08:44:27 INFO    Entrando a http://localhost:5173/login con el usuario vendedor@cielum.test
08:44:28 INFO    Sesión iniciada
08:44:28 INFO    Página 1 leída: 10 pedidos del 2026-10-21 hasta ahora
08:44:28 INFO    Página 2 leída: 15 pedidos del 2026-10-21 hasta ahora
08:44:28 INFO    Listo: 15 pedidos del 2026-10-21 por $ 1.070.000. Reporte en ...\salida\reporte_diario.xlsx
```

## Cómo está hecho

- **Selectores robustos:** los campos del login se buscan por su etiqueta (`get_by_label('Correo')`), los botones por su rol y su texto (`get_by_role('button', name='Siguiente')`) y las filas y las celdas por su rol en la tabla. Así el bot no depende de la estructura del HTML ni de las clases de CSS.
- **Esperas sin `time.sleep`:** `expect(...).to_be_visible()` reintenta hasta que aparece lo que se espera, máximo 15 segundos. Al pasar de página, el frontend sigue mostrando la tabla anterior mientras carga la nueva, así que el bot espera a que la paginación diga `Página 2 de ...` antes de leer.
- **Sin recargar la página:** el frontend guarda la sesión en memoria, así que si el bot escribe una dirección en el navegador, la sesión se pierde y vuelve al login. Por eso se mueve con los botones, como una persona.
- **Para en el momento justo:** la tabla trae los pedidos del más nuevo al más viejo. Cuando aparece un pedido de una fecha anterior, el bot deja de pasar páginas.
- **Errores claros:** si el login falla, el bot dice que revises `RPA_USUARIO` y `RPA_CLAVE`. Si el frontend no responde, dice que revises `FRONTEND_URL`. En los dos casos guarda una captura de la pantalla en `salida/errores/`.
- **Sin contraseñas en el código:** el usuario y la contraseña van en el `.env`, que no se sube a Git.

## Por qué en la vida real esto se haría mejor por API

La misma información ya la da la API del proyecto: `GET /pedidos?limite=100`, con el token del login, devuelve los pedidos en JSON, con la fecha, el cliente, el estado y el total como número. Agregarle a esa ruta un filtro por fecha sería un cambio pequeño. Un script que llame a la API es mejor por varias razones:

- **Es más estable.** La API es un contrato: sus rutas y sus campos no cambian porque alguien rediseñe la página. El bot, en cambio, se daña si cambia el texto de un botón (**Siguiente**), el orden de las columnas, la forma de mostrar los pesos o cómo maneja la sesión el frontend. Mientras se hizo este bot, por ejemplo, la primera versión perdía la sesión al cambiar de página, porque escribía la dirección en el navegador.
- **Es más rápido.** El bot tiene que abrir un navegador, cargar la página, entrar y pasar página por página. La API responde los mismos datos en una sola petición de milisegundos.
- **Los datos llegan limpios.** Por la API el total llega como `135000`; en la pantalla llega como el texto `$ 135.000` y el bot lo tiene que convertir.
- **Es más fácil de mantener y de probar.** Las pruebas de la API ya existen (`npm test` y la colección de Postman). Un bot necesita que el navegador, el frontend y la API estén prendidos para probarlo.
- **Es más seguro.** Por la API se usa un token con los permisos justos. El bot necesita el usuario y la contraseña de una persona.

Lo mejor sería un endpoint propio para el reporte, por ejemplo `GET /reportes/diario?fecha=2026-10-21`, o una consulta SQL programada.

## Cuándo sí se justifica la RPA

- Cuando el sistema **no tiene API**: aplicaciones viejas, programas de escritorio o sistemas que solo se manejan desde la pantalla.
- Cuando hay que sacar datos de **portales de otras empresas** que no ofrecen API, por ejemplo la página de un proveedor o de una entidad.
- Cuando la API existe pero **no tiene la operación** que se necesita y sí está en la pantalla.
- Como **solución temporal**, mientras se construye la integración por API.
- Cuando el volumen es bajo, las pantallas casi no cambian y automatizar le ahorra a una persona un trabajo repetitivo.

Aun en esos casos, el bot necesita lo mismo que este: selectores robustos, esperas, logs, capturas cuando falla, credenciales fuera del código y alguien que lo mantenga cuando la aplicación cambie.
