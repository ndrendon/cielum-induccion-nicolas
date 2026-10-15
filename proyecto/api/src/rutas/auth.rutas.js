import { Router } from 'express';
import * as authControlador from '../controladores/auth.controlador.js';
import { autenticar } from '../middlewares/autenticacion.js';

export const rutasAuth = Router();

rutasAuth.post('/login', authControlador.iniciarSesion);
rutasAuth.get('/perfil', autenticar, authControlador.perfil);
