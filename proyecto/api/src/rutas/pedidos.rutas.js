import { Router } from 'express';
import * as pedidosControlador from '../controladores/pedidos.controlador.js';
import { autenticar, permitirRoles } from '../middlewares/autenticacion.js';

export const rutasPedidos = Router();

// Todas las rutas de pedidos necesitan haber iniciado sesión
rutasPedidos.use(autenticar);

rutasPedidos.get('/', pedidosControlador.listar);
rutasPedidos.get('/:id', pedidosControlador.obtener);
rutasPedidos.post('/', pedidosControlador.crear);
rutasPedidos.patch('/:id/estado', pedidosControlador.cambiarEstado);
rutasPedidos.delete('/:id', permitirRoles('admin'), pedidosControlador.eliminar);
