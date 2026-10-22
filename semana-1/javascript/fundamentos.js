console.log("===== JS INTERMEDIO: PEDIDOS =====");
const pedidos = [
  { id: 1, cliente: "Ana", ciudad: "Medellín", total: 120000, estado: "entregado" },
  { id: 2, cliente: "Luis", ciudad: "Bogotá", total: 85000, estado: "pendiente" },
  { id: 3, cliente: "Sofía", ciudad: "Cali", total: 230000, estado: "entregado" },
  { id: 4, cliente: "Mateo", ciudad: "Medellín", total: 45000, estado: "pendiente" },
  { id: 5, cliente: "Ana", ciudad: "Medellín", total: 310000, estado: "entregado" },
  { id: 6, cliente: "Carlos", ciudad: "Bogotá", total: 150000, estado: "entregado" },
  { id: 7, cliente: "Luis", ciudad: "Bogotá", total: 60000, estado: "entregado" },
  { id: 8, cliente: "Sofía", ciudad: "Cali", total: 95000, estado: "pendiente" },
  { id: 9, cliente: "Mateo", ciudad: "Medellín", total: 400000, estado: "entregado" },
  { id: 10, cliente: "Carlos", ciudad: "Bogotá", total: 70000, estado: "pendiente" },
  { id: 11, cliente: "Ana", ciudad: "Medellín", total: 55000, estado: "pendiente" },
  { id: 12, cliente: "Luis", ciudad: "Bogotá", total: 180000, estado: "entregado" },
  { id: 13, cliente: "Sofía", ciudad: "Cali", total: 125000, estado: "entregado" },
  { id: 14, cliente: "Mateo", ciudad: "Medellín", total: 90000, estado: "entregado" },
  { id: 15, cliente: "Carlos", ciudad: "Bogotá", total: 260000, estado: "entregado" },
  { id: 16, cliente: "Ana", ciudad: "Medellín", total: 75000, estado: "entregado" },
  { id: 17, cliente: "Luis", ciudad: "Bogotá", total: 40000, estado: "pendiente" },
  { id: 18, cliente: "Sofía", ciudad: "Cali", total: 210000, estado: "entregado" },
  { id: 19, cliente: "Mateo", ciudad: "Medellín", total: 135000, estado: "pendiente" },
  { id: 20, cliente: "Carlos", ciudad: "Bogotá", total: 100000, estado: "entregado" }
];

const totalVendido = pedidos.reduce((acc, p) => acc + p.total, 0);

const totalPorCiudad = pedidos.reduce((acc, p) => {
  acc[p.ciudad] = (acc[p.ciudad] ?? 0) + p.total;
  return acc;
}, {});

const pendientes = pedidos.filter(p => p.estado === "pendiente");

const masCaro = pedidos.reduce((max, p) => (p.total > max.total ? p : max));

const resumenClientes = pedidos.reduce((acc, p) => {
  if (!acc[p.cliente]) acc[p.cliente] = { suma: 0, cantidad: 0 };
  acc[p.cliente].suma += p.total;
  acc[p.cliente].cantidad++;
  return acc;
}, {});

const promedioPorCliente = Object.entries(resumenClientes).map(([cliente, { suma, cantidad }]) => ({
  cliente,
  promedio: suma / cantidad
}));

console.log("Total vendido:", totalVendido);
console.log("Total por ciudad:", totalPorCiudad);
console.log("Pedidos pendientes:", pendientes.map(p => p.id));
console.log("Pedido más caro:", masCaro);
console.log("Promedio por cliente:", promedioPorCliente);
console.log("Ejercicio en progreso");
