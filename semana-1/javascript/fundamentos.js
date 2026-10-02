console.log("===== JS BÁSICO =====");

console.log("\n--- Ejercicio 1: tipos de datos ---");
const nombre = "Nicolas";
const horasPractica = 6;
const esPracticante = true;
let proyecto;
const jefe = null;
console.log(typeof nombre, typeof horasPractica, typeof esPracticante, typeof proyecto, typeof jefe);

console.log("\n--- Ejercicio 2: let, const y var ---");
const empresa = "Cielum";
let horas = 6;
horas = horas + 2;
if (true) {
  var dentroVar = "visible fuera del bloque";
  let dentroLet = "solo dentro del bloque";
}
console.log(empresa, horas);
console.log(dentroVar);
console.log(typeof dentroLet);

console.log("\n--- Ejercicio 3: == vs === ---");
console.log(5 == "5", 5 === "5");
console.log(0 == false, 0 === false);
console.log(null == undefined, null === undefined);

console.log("\n--- Ejercicio 4: if/else ---");
const nota = 4.2;
if (nota >= 4.5) {
  console.log("Excelente");
} else if (nota >= 3) {
  console.log("Aprobado");
} else {
  console.log("Reprobado");
}

console.log("\n--- Ejercicio 5: switch ---");
const dia = 3;
switch (dia) {
  case 1: console.log("Lunes"); break;
  case 2: console.log("Martes"); break;
  case 3: console.log("Miércoles"); break;
  case 4: console.log("Jueves"); break;
  case 5: console.log("Viernes"); break;
  case 6: console.log("Sábado"); break;
  case 7: console.log("Domingo"); break;
  default: console.log("Día no válido");
}

console.log("\n--- Ejercicio 6: bucle for ---");
for (let i = 1; i <= 10; i++) {
  console.log(`7 x ${i} = ${7 * i}`);
}

console.log("\n--- Ejercicio 7: bucle while ---");
let numero = 1;
let suma = 0;
while (numero <= 100) {
  suma += numero;
  numero++;
}
console.log(suma);

console.log("\n--- Ejercicio 8: función normal vs flecha ---");
function calcularIvaNormal(precio) {
  return precio * 0.19;
}
const calcularIvaFlecha = (precio) => precio * 0.19;
console.log(calcularIvaNormal(100000), calcularIvaFlecha(100000));

console.log("\n--- Ejercicio 9: arrays ---");
const tareas = ["Crear rama", "Resolver ejercicios", "Abrir PR"];
tareas.push("Subir bitácora");
console.log(tareas.length);
console.log(tareas[0]);
for (const tarea of tareas) {
  console.log("- " + tarea);
}
console.log(tareas.includes("Abrir PR"));

console.log("\n--- Ejercicio 10: objetos ---");
const practicante = {
  nombre: "Nicolas",
  empresa: "Cielum",
  habilidades: ["C#", "SQL"]
};
practicante.habilidades.push("JavaScript");
practicante.semana = 1;
console.log(practicante.nombre, practicante["empresa"]);
for (const clave in practicante) {
  console.log(clave + ": " + practicante[clave]);
}

console.log("\n===== JS INTERMEDIO: PEDIDOS =====");
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
console.log(" ")
console.log('prueba');
console.log('prueba revert');
