// Ejercicio intermedio: CRUD de productos guardados en memoria (en un arreglo).
// Los datos se pierden cada vez que se reinicia el servidor.
// Se ejecuta con: npm run intermedio

import express from 'express';

const app = express();

// Convierte el JSON que llega en el cuerpo de la petición en un objeto (req.body)
app.use(express.json());

const productos = [
  { id: 1, nombre: 'Teclado mecánico', categoria: 'Periféricos', precio: 180000, stock: 25 },
  { id: 2, nombre: 'Mouse inalámbrico', categoria: 'Periféricos', precio: 65000, stock: 40 },
  { id: 3, nombre: 'Monitor 24 pulgadas', categoria: 'Pantallas', precio: 720000, stock: 8 }
];
let siguienteId = 4;

// Revisa que el producto tenga todos los datos y que sean del tipo correcto.
// Devuelve el mensaje del primer problema que encuentre, o null si todo está bien.
function revisarProducto(datos) {
  if (typeof datos.nombre !== 'string' || datos.nombre.trim() === '') {
    return 'El nombre es obligatorio';
  }
  if (typeof datos.categoria !== 'string' || datos.categoria.trim() === '') {
    return 'La categoría es obligatoria';
  }
  if (typeof datos.precio !== 'number' || datos.precio <= 0) {
    return 'El precio debe ser un número mayor que 0';
  }
  if (!Number.isInteger(datos.stock) || datos.stock < 0) {
    return 'El stock debe ser un número entero mayor o igual que 0';
  }
  return null;
}

function buscarProducto(id) {
  return productos.find((producto) => producto.id === Number(id));
}

// Listar todos los productos
app.get('/productos', (req, res) => {
  res.json(productos);
});

// Consultar un producto por su id
app.get('/productos/:id', (req, res) => {
  const producto = buscarProducto(req.params.id);
  if (!producto) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
  res.json(producto);
});

// Crear un producto
app.post('/productos', (req, res) => {
  const problema = revisarProducto(req.body);
  if (problema) {
    return res.status(400).json({ mensaje: problema });
  }
  const { nombre, categoria, precio, stock } = req.body;
  const nuevo = { id: siguienteId, nombre, categoria, precio, stock };
  siguienteId++;
  productos.push(nuevo);
  res.status(201).json(nuevo);
});

// Reemplazar todos los datos de un producto
app.put('/productos/:id', (req, res) => {
  const producto = buscarProducto(req.params.id);
  if (!producto) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
  const problema = revisarProducto(req.body);
  if (problema) {
    return res.status(400).json({ mensaje: problema });
  }
  producto.nombre = req.body.nombre;
  producto.categoria = req.body.categoria;
  producto.precio = req.body.precio;
  producto.stock = req.body.stock;
  res.json(producto);
});

// Borrar un producto
app.delete('/productos/:id', (req, res) => {
  const posicion = productos.findIndex((producto) => producto.id === Number(req.params.id));
  if (posicion === -1) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
  productos.splice(posicion, 1);
  res.status(204).end();
});

const puerto = process.env.PORT ?? 3000;

app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
