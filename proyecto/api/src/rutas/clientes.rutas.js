import { Router } from 'express';
import * as clientesControlador from '../controladores/clientes.controlador.js';
import { autenticar, permitirRoles } from '../middlewares/autenticacion.js';

export const rutasClientes = Router();

// Todas las rutas de clientes necesitan haber iniciado sesión
rutasClientes.use(autenticar);

rutasClientes.get('/', clientesControlador.listar);
rutasClientes.get('/:id', clientesControlador.obtener);
rutasClientes.post('/', clientesControlador.crear);
rutasClientes.put('/:id', clientesControlador.actualizar);
rutasClientes.delete('/:id', permitirRoles('admin'), clientesControlador.eliminar);
