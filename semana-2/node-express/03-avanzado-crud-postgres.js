// Ejercicio avanzado: el mismo CRUD de productos, pero guardado en PostgreSQL con pg,
// con validación de datos usando zod y un middleware que maneja todos los errores.
// Usa la tabla productos de la base induccion (contenedor pg-induccion).
// Se ejecuta con: npm run avanzado (antes copiar .env.example como .env y poner la contraseña)

import express from 'express';
import pg from 'pg';
import * as z from 'zod';

// Mensajes de error de zod en español (para las reglas que no tienen un mensaje propio)
z.config(z.locales.es());

// pg devuelve las columnas NUMERIC como texto ("180000.00"); con esto llegan como número
pg.types.setTypeParser(1700, (valor) => Number(valor));

// El pool toma la conexión de las variables PGHOST, PGPORT, PGDATABASE, PGUSER y PGPASSWORD
const pool = new pg.Pool();

// Error con un código HTTP, para lanzarlo desde las rutas y responderlo en el middleware de errores
class ErrorHttp extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

// Cómo deben venir los datos de un producto. Cada regla lleva el mensaje que se responde si no se cumple.
const productoEsquema = z.object({
  nombre: z
    .string({ error: 'El nombre es obligatorio' })
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre puede tener máximo 100 caracteres'),
  categoria: z
    .string({ error: 'La categoría es obligatoria' })
    .trim()
    .min(1, 'La categoría es obligatoria')
    .max(50, 'La categoría puede tener máximo 50 caracteres'),
  precio: z.number({ error: 'El precio debe ser un número' }).positive('El precio debe ser mayor que 0'),
  stock: z
    .number({ error: 'El stock debe ser un número' })
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo')
});

// El id de la URL llega como texto; z.coerce lo convierte en número
const parametrosEsquema = z.object({
  id: z.coerce
    .number({ error: 'El id debe ser un número' })
    .int('El id debe ser un número entero')
    .positive('El id debe ser mayor que 0')
});

const columnas = 'id_producto, nombre, categoria, precio, stock';

const app = express();
app.use(express.json());

// Listar todos los productos
app.get('/productos', async (req, res) => {
  const { rows } = await pool.query(`SELECT ${columnas} FROM productos ORDER BY id_producto`);
  res.json(rows);
});

// Consultar un producto por su id
app.get('/productos/:id', async (req, res) => {
  const { id } = parametrosEsquema.parse(req.params);
  const { rows } = await pool.query(`SELECT ${columnas} FROM productos WHERE id_producto = $1`, [id]);
  if (rows.length === 0) {
    throw new ErrorHttp(404, 'Producto no encontrado');
  }
  res.json(rows[0]);
});

// Crear un producto
app.post('/productos', async (req, res) => {
  const datos = productoEsquema.parse(req.body);
  const { rows } = await pool.query(
    `INSERT INTO productos (nombre, categoria, precio, stock) VALUES ($1, $2, $3, $4) RETURNING ${columnas}`,
    [datos.nombre, datos.categoria, datos.precio, datos.stock]
  );
  res.status(201).json(rows[0]);
});

// Reemplazar todos los datos de un producto
app.put('/productos/:id', async (req, res) => {
  const { id } = parametrosEsquema.parse(req.params);
  const datos = productoEsquema.parse(req.body);
  const { rows } = await pool.query(
    `UPDATE productos SET nombre = $1, categoria = $2, precio = $3, stock = $4 WHERE id_producto = $5 RETURNING ${columnas}`,
    [datos.nombre, datos.categoria, datos.precio, datos.stock, id]
  );
  if (rows.length === 0) {
    throw new ErrorHttp(404, 'Producto no encontrado');
  }
  res.json(rows[0]);
});

// Borrar un producto
app.delete('/productos/:id', async (req, res) => {
  const { id } = parametrosEsquema.parse(req.params);
  const { rowCount } = await pool.query('DELETE FROM productos WHERE id_producto = $1', [id]);
  if (rowCount === 0) {
    throw new ErrorHttp(404, 'Producto no encontrado');
  }
  res.status(204).end();
});

// Si ninguna ruta coincidió, la ruta no existe
app.use((req, res) => {
  res.status(404).json({ mensaje: `No existe la ruta ${req.method} ${req.originalUrl}` });
});

// Middleware de errores: va al final y recibe cuatro parámetros.
// En Express 5, los errores de las rutas async llegan aquí solos.
app.use((err, req, res, next) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ mensaje: 'Los datos enviados no son válidos', errores: z.flattenError(err).fieldErrors });
  }
  if (err instanceof ErrorHttp) {
    return res.status(err.status).json({ mensaje: err.message });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
  }
  if (err.code === '23503') {
    // 23503 es el código de PostgreSQL cuando una llave foránea no deja hacer el cambio
    return res.status(409).json({ mensaje: 'No se puede borrar el producto porque ya está en pedidos' });
  }
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

const puerto = process.env.PORT ?? 3000;

app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
