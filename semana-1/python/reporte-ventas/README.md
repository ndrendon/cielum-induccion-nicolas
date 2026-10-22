# Reto: reporte de ventas en Python

Script de línea de comandos que lee un CSV de ventas, limpia los datos y genera un Excel con una hoja por análisis.

```bash
python reporte.py --entrada ventas.csv --salida reporte.xlsx
```

## Estructura

| Archivo | Para qué sirve |
| --- | --- |
| `generar_ventas.py` | Crea `ventas.csv` con 200 ventas ficticias usando `random`. Algunas filas se dañan a propósito para que haya datos que limpiar. |
| `reporte.py` | Script principal: lee el CSV, limpia los datos, calcula los análisis y genera el Excel con `pandas` y `openpyxl`. |
| `test_reporte.py` | Pruebas con `pytest` de la limpieza, los análisis y el script completo. |
| `requirements.txt` | Librerías que necesita el proyecto. |

## Requisitos

- Python 3.10 o superior.

## Instalación

Desde esta carpeta, en PowerShell (la terminal de VS Code):

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

En Git Bash el entorno se activa con `source .venv/Scripts/activate`. La carpeta `.venv` no se sube al repositorio porque está en el `.gitignore`.

## Uso

```powershell
python generar_ventas.py
python reporte.py --entrada ventas.csv --salida reporte.xlsx
```

`generar_ventas.py` acepta `--salida`, `--cantidad` y `--semilla`. Con la misma semilla siempre genera los mismos datos. Los dos scripts muestran todas sus opciones con `--help`.

## Limpieza de datos

| Problema en el CSV | Qué hace el script |
| --- | --- |
| Espacios o mayúsculas mal puestas en la ciudad (`"  cali "`, `"BOGOTÁ"`) | Quita los espacios y deja solo la primera letra en mayúscula. |
| Datos vacíos en fecha, ciudad, producto, cantidad o precio | Elimina la fila. |
| Fechas en otro formato (`15/03/2026`, `2026/03/15`, `15-03-2026`) | Las convierte a `AAAA-MM-DD`. |
| Fechas que no existen o no se pueden leer (`2026-02-30`, `sin fecha`) | Elimina la fila y la registra como advertencia. |
| Ventas duplicadas | Deja solo una. |

Cada paso queda registrado con `logging`, con la cantidad de filas corregidas o eliminadas.

## Contenido del Excel

| Hoja | Contenido |
| --- | --- |
| Total por mes | Cantidad de ventas y total vendido de cada mes. |
| Total por ciudad | Cantidad de ventas y total vendido de cada ciudad, de mayor a menor. |
| Top 5 productos | Los 5 productos con mayor total vendido y sus unidades vendidas. |

## Pruebas

```powershell
python -m pytest
```

Se usa `python -m pytest` en vez de solo `pytest` porque en algunos equipos con Windows la política de seguridad bloquea el archivo `pytest.exe` que crea pip. Con `python -m`, las pruebas corren con el Python del entorno virtual.
