"""Ejercicio intermedio: inventario de productos con dataclasses."""

import logging
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class Producto:
    codigo: str
    nombre: str
    precio: float
    existencias: int = 0
    stock_minimo: int = 5

    def __post_init__(self) -> None:
        if self.precio <= 0:
            raise ValueError(f"El precio de {self.nombre} debe ser mayor que 0")
        if self.existencias < 0 or self.stock_minimo < 0:
            raise ValueError(f"Las existencias y el stock mínimo de {self.nombre} no pueden ser negativos")

    @property
    def bajo_stock(self) -> bool:
        return self.existencias <= self.stock_minimo

    def __str__(self) -> str:
        return f"{self.nombre} ({self.codigo}): {self.existencias} unidades"


class Inventario:
    def __init__(self) -> None:
        self._productos: dict[str, Producto] = {}

    def __len__(self) -> int:
        return len(self._productos)

    def agregar_producto(self, producto: Producto) -> None:
        if producto.codigo in self._productos:
            raise ValueError(f"Ya existe un producto con el código {producto.codigo}")
        self._productos[producto.codigo] = producto
        logger.info("Producto agregado: %s", producto)

    def obtener_producto(self, codigo: str) -> Producto:
        if codigo not in self._productos:
            raise KeyError(f"No existe un producto con el código {codigo}")
        return self._productos[codigo]

    def descontar_existencias(self, codigo: str, cantidad: int) -> None:
        if cantidad <= 0:
            raise ValueError("La cantidad a descontar debe ser mayor que 0")
        producto = self.obtener_producto(codigo)
        if cantidad > producto.existencias:
            raise ValueError(
                f"No hay suficientes existencias de {producto.nombre}: "
                f"hay {producto.existencias} y se pidieron {cantidad}"
            )
        producto.existencias -= cantidad
        logger.info("%s: descuento de %d, quedan %d unidades", producto.nombre, cantidad, producto.existencias)

    def alertar_bajo_stock(self) -> list[Producto]:
        productos_bajos = [producto for producto in self._productos.values() if producto.bajo_stock]
        for producto in productos_bajos:
            logger.warning("Bajo stock: %s (mínimo %d)", producto, producto.stock_minimo)
        return productos_bajos


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)-7s | %(message)s")

    inventario = Inventario()
    inventario.agregar_producto(Producto("TEC-01", "Teclado mecánico", 180000, existencias=12))
    inventario.agregar_producto(Producto("MOU-01", "Mouse inalámbrico", 65000, existencias=8))
    inventario.agregar_producto(Producto("MON-01", "Monitor 24 pulgadas", 720000, existencias=3, stock_minimo=2))

    inventario.descontar_existencias("MOU-01", 5)
    inventario.descontar_existencias("MON-01", 1)

    try:
        inventario.descontar_existencias("TEC-01", 20)
    except ValueError as error:
        logger.error("No se pudo descontar: %s", error)

    productos_bajos = inventario.alertar_bajo_stock()
    logger.info("Productos con bajo stock: %d de %d", len(productos_bajos), len(inventario))


if __name__ == "__main__":
    main()
