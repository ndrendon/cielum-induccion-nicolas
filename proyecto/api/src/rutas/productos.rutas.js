import { Router } from 'express';
import * as productosControlador from '../controladores/productos.controlador.js';
import { autenticar, permitirRoles } from '../middlewares/autenticacion.js';

export const rutasProductos = Router();

// Consultar los productos es público; crearlos, cambiarlos y borrarlos necesita sesión
rutasProductos.get('/', productosControlador.listar);
rutasProductos.get('/:id', productosControlador.obtener);
rutasProductos.post('/', autenticar, productosControlador.crear);
rutasProductos.put('/:id', autenticar, productosControlador.actualizar);
rutasProductos.delete('/:id', autenticar, permitirRoles('admin'), productosControlador.eliminar);
