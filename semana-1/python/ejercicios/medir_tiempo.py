"""Ejercicio avanzado: decorador que registra con logging cuánto tarda una función."""

import functools
import logging
import time
from collections.abc import Callable
from typing import Any

logger = logging.getLogger(__name__)


def medir_tiempo(funcion: Callable[..., Any]) -> Callable[..., Any]:
    @functools.wraps(funcion)
    def envoltura(*args: Any, **kwargs: Any) -> Any:
        inicio = time.perf_counter()
        try:
            return funcion(*args, **kwargs)
        finally:
            duracion = time.perf_counter() - inicio
            logger.info("%s tardó %.4f segundos", funcion.__name__, duracion)

    return envoltura


@medir_tiempo
def esperar(segundos: float) -> None:
    time.sleep(segundos)


@medir_tiempo
def sumar_hasta(numero: int) -> int:
    return sum(range(numero + 1))


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)-7s | %(message)s")

    esperar(0.5)
    resultado = sumar_hasta(1_000_000)
    logger.info("La suma del 1 al 1.000.000 es %d", resultado)
    logger.info("El decorador conserva el nombre de la función: %s", sumar_hasta.__name__)


if __name__ == "__main__":
    main()
