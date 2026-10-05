import logging

import pytest

from inventario import Inventario, Producto


@pytest.fixture
def inventario() -> Inventario:
    inventario = Inventario()
    inventario.agregar_producto(Producto("TEC-01", "Teclado mecánico", 180000, existencias=12))
    inventario.agregar_producto(Producto("MOU-01", "Mouse inalámbrico", 65000, existencias=4))
    return inventario


def test_agregar_producto_lo_guarda_en_el_inventario(inventario: Inventario) -> None:
    inventario.agregar_producto(Producto("MON-01", "Monitor 24 pulgadas", 720000, existencias=3))

    assert len(inventario) == 3
    assert inventario.obtener_producto("MON-01").nombre == "Monitor 24 pulgadas"


def test_agregar_producto_con_codigo_repetido_lanza_error(inventario: Inventario) -> None:
    with pytest.raises(ValueError, match="Ya existe"):
        inventario.agregar_producto(Producto("TEC-01", "Otro teclado", 99000))


def test_descontar_existencias_resta_la_cantidad(inventario: Inventario) -> None:
    inventario.descontar_existencias("TEC-01", 5)

    assert inventario.obtener_producto("TEC-01").existencias == 7


def test_descontar_mas_de_lo_disponible_lanza_error_y_no_cambia_existencias(inventario: Inventario) -> None:
    with pytest.raises(ValueError, match="No hay suficientes existencias"):
        inventario.descontar_existencias("MOU-01", 10)

    assert inventario.obtener_producto("MOU-01").existencias == 4


def test_alertar_bajo_stock_devuelve_y_registra_los_productos_bajo_el_minimo(
    inventario: Inventario, caplog: pytest.LogCaptureFixture
) -> None:
    with caplog.at_level(logging.WARNING):
        productos_bajos = inventario.alertar_bajo_stock()

    assert [producto.codigo for producto in productos_bajos] == ["MOU-01"]
    assert "Bajo stock: Mouse inalámbrico" in caplog.text
