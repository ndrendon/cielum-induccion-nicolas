// Arma la aplicación de Express: middlewares, rutas y manejo de errores.
// Está separada de index.js para poder usarla en las pruebas sin levantar el servidor.

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import * as z from 'zod';
import { config } from './config.js';
import { manejarErrores, rutaNoEncontrada } from './middlewares/errores.js';
import { registrarPeticiones } from './middlewares/registro.js';
import { rutasAuth } from './rutas/auth.rutas.js';
import { rutasClientes } from './rutas/clientes.rutas.js';
import { rutasPedidos } from './rutas/pedidos.rutas.js';
import { rutasProductos } from './rutas/productos.rutas.js';

// Mensajes de error de zod en español
z.config(z.locales.es());

export const app = express();

app.use(helmet()); // encabezados de seguridad
app.use(cors({ origin: config.CORS_ORIGIN })); // qué frontend puede usar la API
app.use(express.json()); // convierte el JSON del cuerpo en req.body

if (config.NODE_ENV !== 'test') {
  app.use(registrarPeticiones); // logs de cada petición (en las pruebas no se muestran)
}

app.get('/salud', (req, res) => {
  res.json({ estado: 'ok', fecha: new Date().toISOString() });
});

app.use('/auth', rutasAuth);
app.use('/clientes', rutasClientes);
app.use('/productos', rutasProductos);
app.use('/pedidos', rutasPedidos);

// Estos dos van al final: primero la ruta que no existe y después el manejo de errores
app.use(rutaNoEncontrada);
app.use(manejarErrores);
