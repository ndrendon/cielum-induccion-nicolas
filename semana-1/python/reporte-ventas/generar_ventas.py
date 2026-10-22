"""Genera un CSV con ventas ficticias para probar reporte.py.

Algunas filas se dañan a propósito (datos vacíos, fechas mal escritas,
ciudades mal escritas y ventas duplicadas) para que el reporte tenga
datos que limpiar.

Uso:
    python generar_ventas.py --salida ventas.csv --cantidad 200 --semilla 42
"""

import argparse
import csv
import logging
import random
import sys
from datetime import date, timedelta
from pathlib import Path

logger = logging.getLogger(__name__)

COLUMNAS = ["id_venta", "fecha", "cliente", "ciudad", "producto", "cantidad", "precio_unitario"]
CAMPOS_QUE_PUEDEN_FALTAR = ["fecha", "ciudad", "producto", "cantidad", "precio_unitario"]

CIUDADES = ["Medellín", "Bogotá", "Cali", "Barranquilla", "Bucaramanga", "Cartagena"]
PESOS_CIUDADES = [30, 25, 15, 12, 10, 8]
PRODUCTOS = {
    "Teclado mecánico": 180000,
    "Mouse inalámbrico": 65000,
    "Monitor 24 pulgadas": 720000,
    "Audífonos bluetooth": 150000,
    "Cámara web HD": 120000,
    "Base para portátil": 85000,
    "Disco SSD 1 TB": 310000,
    "Memoria USB 64 GB": 35000,
    "Silla ergonómica": 890000,
    "Hub USB-C": 95000,
}
NOMBRES = ["Ana", "Luis", "Sofía", "Mateo", "Carlos", "Valentina", "Juan", "Camila", "Andrés", "Laura"]
APELLIDOS = ["Gómez", "Pérez", "Rodríguez", "Martínez", "López", "García", "Ramírez", "Torres", "Restrepo", "Zapata"]

FECHA_INICIO = date(2026, 1, 1)
FECHA_FIN = date(2026, 9, 30)
FORMATOS_FECHA_ALTERNOS = ["%d/%m/%Y", "%Y/%m/%d", "%d-%m-%Y"]
FECHAS_INVALIDAS = ["2026-02-30", "31/04/2026", "2026-13-05", "sin fecha"]

CANTIDAD_VACIOS = 10
CANTIDAD_FECHAS_OTRO_FORMATO = 8
CANTIDAD_CIUDADES_MAL_ESCRITAS = 10
CANTIDAD_DUPLICADOS = 8
FILAS_SUCIAS = CANTIDAD_VACIOS + CANTIDAD_FECHAS_OTRO_FORMATO + len(FECHAS_INVALIDAS) + CANTIDAD_CIUDADES_MAL_ESCRITAS
CANTIDAD_MINIMA = FILAS_SUCIAS + 2 * CANTIDAD_DUPLICADOS


def crear_venta(id_venta: int, rng: random.Random) -> dict[str, str]:
    producto = rng.choice(list(PRODUCTOS))
    dias = rng.randint(0, (FECHA_FIN - FECHA_INICIO).days)
    return {
        "id_venta": str(id_venta),
        "fecha": (FECHA_INICIO + timedelta(days=dias)).isoformat(),
        "cliente": f"{rng.choice(NOMBRES)} {rng.choice(APELLIDOS)}",
        "ciudad": rng.choices(CIUDADES, weights=PESOS_CIUDADES)[0],
        "producto": producto,
        "cantidad": str(rng.randint(1, 5)),
        "precio_unitario": str(PRODUCTOS[producto]),
    }


def ensuciar_datos(ventas: list[dict[str, str]], rng: random.Random) -> set[int]:
    posiciones = rng.sample(range(len(ventas)), FILAS_SUCIAS)
    posiciones_sucias = set(posiciones)

    for _ in range(CANTIDAD_VACIOS):
        venta = ventas[posiciones.pop()]
        venta[rng.choice(CAMPOS_QUE_PUEDEN_FALTAR)] = ""

    for _ in range(CANTIDAD_FECHAS_OTRO_FORMATO):
        venta = ventas[posiciones.pop()]
        fecha = date.fromisoformat(venta["fecha"])
        venta["fecha"] = fecha.strftime(rng.choice(FORMATOS_FECHA_ALTERNOS))

    for fecha_invalida in FECHAS_INVALIDAS:
        ventas[posiciones.pop()]["fecha"] = fecha_invalida

    for _ in range(CANTIDAD_CIUDADES_MAL_ESCRITAS):
        venta = ventas[posiciones.pop()]
        ciudad = venta["ciudad"]
        venta["ciudad"] = rng.choice([ciudad.upper(), ciudad.lower(), f"  {ciudad} "])

    return posiciones_sucias


def agregar_duplicados(ventas: list[dict[str, str]], posiciones_sucias: set[int], rng: random.Random) -> list[dict[str, str]]:
    posiciones_limpias = [posicion for posicion in range(len(ventas)) if posicion not in posiciones_sucias]
    resultado = list(ventas)
    for posicion in rng.sample(posiciones_limpias, CANTIDAD_DUPLICADOS):
        resultado.insert(rng.randint(0, len(resultado)), dict(ventas[posicion]))
    return resultado


def generar_ventas(cantidad: int, semilla: int) -> list[dict[str, str]]:
    rng = random.Random(semilla)
    ventas = [crear_venta(id_venta, rng) for id_venta in range(1, cantidad - CANTIDAD_DUPLICADOS + 1)]
    posiciones_sucias = ensuciar_datos(ventas, rng)
    return agregar_duplicados(ventas, posiciones_sucias, rng)


def guardar_csv(ventas: list[dict[str, str]], ruta: Path) -> None:
    with open(ruta, "w", newline="", encoding="utf-8-sig") as archivo:
        escritor = csv.DictWriter(archivo, fieldnames=COLUMNAS)
        escritor.writeheader()
        escritor.writerows(ventas)


def crear_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Genera un CSV con ventas ficticias, con algunos datos sucios a propósito.")
    parser.add_argument("--salida", type=Path, default=Path("ventas.csv"), help="ruta del CSV a generar (por defecto: ventas.csv)")
    parser.add_argument("--cantidad", type=int, default=200, help="cantidad de filas del CSV (por defecto: 200)")
    parser.add_argument("--semilla", type=int, default=42, help="semilla para generar siempre los mismos datos (por defecto: 42)")
    return parser


def main(argumentos: list[str] | None = None) -> int:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)-7s | %(message)s", datefmt="%H:%M:%S")
    parser = crear_parser()
    args = parser.parse_args(argumentos)
    if args.cantidad < CANTIDAD_MINIMA:
        parser.error(f"--cantidad debe ser al menos {CANTIDAD_MINIMA}")

    ventas = generar_ventas(args.cantidad, args.semilla)
    try:
        guardar_csv(ventas, args.salida)
    except PermissionError:
        logger.error("No se pudo escribir %s. Si está abierto en otro programa, ciérralo e intenta de nuevo", args.salida)
        return 1

    logger.info("Se generaron %d ventas en %s", len(ventas), args.salida)
    logger.info(
        "Datos sucios a propósito: %d con vacíos, %d fechas en otro formato, %d fechas inválidas, "
        "%d ciudades mal escritas y %d duplicados",
        CANTIDAD_VACIOS,
        CANTIDAD_FECHAS_OTRO_FORMATO,
        len(FECHAS_INVALIDAS),
        CANTIDAD_CIUDADES_MAL_ESCRITAS,
        CANTIDAD_DUPLICADOS,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
