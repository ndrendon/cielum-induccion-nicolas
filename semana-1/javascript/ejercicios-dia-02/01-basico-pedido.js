class Pedido {
  constructor(cliente) {
    this.cliente = cliente;
    this.items = [];
    this.descuento = 0;
  }

  agregarItem(nombre, precio, cantidad = 1) {
    if (!nombre || precio <= 0 || cantidad <= 0) {
      throw new Error(`Item inválido: ${nombre}`);
    }
    this.items.push({ nombre, precio, cantidad });
  }

  calcularSubtotal() {
    return this.items.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  aplicarDescuento(porcentaje) {
    if (porcentaje < 0 || porcentaje > 100) {
      throw new Error("El descuento debe estar entre 0 y 100");
    }
    this.descuento = porcentaje;
  }

  calcularTotal() {
    const subtotal = this.calcularSubtotal();
    return subtotal - subtotal * (this.descuento / 100);
  }
}

const pedido = new Pedido("Nicolas");
pedido.agregarItem("Teclado", 120000);
pedido.agregarItem("Mouse", 45000, 2);
pedido.agregarItem("Pad mouse", 20000);

console.log("Subtotal:", pedido.calcularSubtotal());
pedido.aplicarDescuento(10);
console.log("Total con 10% de descuento:", pedido.calcularTotal());

try {
  pedido.aplicarDescuento(150);
} catch (error) {
  console.log("Error esperado:", error.message);
}

try {
  pedido.agregarItem("Monitor", -5);
} catch (error) {
  console.log("Error esperado:", error.message);
}
