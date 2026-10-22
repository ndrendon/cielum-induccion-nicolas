// Pruebas de la API. Se ejecutan con: npm test
// Usan la base proyecto_test (ver entorno-pruebas.js), que se borra y se vuelve a llenar al empezar.

import './entorno-pruebas.js';
import assert from 'node:assert/strict';
import http from 'node:http';
import { after, before, describe, test } from 'node:test';
import request from 'supertest';
import { inicializarBase } from '../db/inicializar.js';
import { app } from '../src/app.js';
import { pool } from '../src/db.js';

let tokenAdmin;
let tokenVendedor;

// n8n falso: recibe los avisos que la API manda al crear un pedido (parte 7).
// Su dirección está en entorno-pruebas.js, y modoN8n dice cómo responde.
const avisos = [];
let modoN8n = 'ok';

const n8nFalso = http.createServer((req, res) => {
  let cuerpo = '';
  req.on('data', (parte) => (cuerpo += parte));
  req.on('end', () => {
    const aviso = { cabeceras: req.headers, cuerpo: JSON.parse(cuerpo) };
    avisos.push(aviso);
    const vecesDelPedido = avisos.filter((otro) => otro.cuerpo.pedido.id_pedido === aviso.cuerpo.pedido.id_pedido).length;

    if (modoN8n === 'falla-una-vez' && vecesDelPedido === 1) {
      res.writeHead(500).end();
    } else if (modoN8n === 'lento') {
      setTimeout(() => res.writeHead(202).end(), 1500);
    } else {
      res.writeHead(202, { 'Content-Type': 'application/json' }).end('{"mensaje":"Pedido recibido"}');
    }
  });
});

// Espera hasta 3 s a que lleguen los avisos de un pedido
async function avisosDe(idPedido, cuantos = 1) {
  for (let vuelta = 0; vuelta < 60; vuelta++) {
    const delPedido = avisos.filter((aviso) => aviso.cuerpo.pedido.id_pedido === idPedido);
    if (delPedido.length >= cuantos) {
      return delPedido;
    }
    await new Promise((resolver) => setTimeout(resolver, 50));
  }
  return avisos.filter((aviso) => aviso.cuerpo.pedido.id_pedido === idPedido);
}

async function iniciarSesion(email, password) {
  const respuesta = await request(app).post('/auth/login').send({ email, password });
  return respuesta.body.token;
}

async function stockDe(idProducto) {
  const respuesta = await request(app).get(`/productos/${idProducto}`);
  return respuesta.body.stock;
}

before(async () => {
  await new Promise((resolver) => n8nFalso.listen(3999, '127.0.0.1', resolver));
  await inicializarBase();
  tokenAdmin = await iniciarSesion('admin@cielum.test', 'Admin2026*');
  tokenVendedor = await iniciarSesion('vendedor@cielum.test', 'Vendedor2026*');
});

after(async () => {
  await pool.end();
  await new Promise((resolver) => n8nFalso.close(resolver));
});

describe('Salud y rutas que no existen', () => {
  test('GET /salud responde ok y la fecha', async () => {
    const respuesta = await request(app).get('/salud');
    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.estado, 'ok');
    assert.ok(!Number.isNaN(Date.parse(respuesta.body.fecha)));
  });

  test('una ruta que no existe responde 404', async () => {
    const respuesta = await request(app).get('/no-existe');
    assert.equal(respuesta.status, 404);
  });

  test('un JSON mal escrito responde 400', async () => {
    const respuesta = await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email": ');
    assert.equal(respuesta.status, 400);
    assert.equal(respuesta.body.mensaje, 'El cuerpo de la petición no es un JSON válido');
  });
});

describe('Login y rutas protegidas', () => {
  test('con los datos correctos devuelve un token y el usuario', async () => {
    const respuesta = await request(app)
      .post('/auth/login')
      .send({ email: 'ADMIN@cielum.test', password: 'Admin2026*' });
    assert.equal(respuesta.status, 200);
    assert.ok(respuesta.body.token);
    assert.equal(respuesta.body.usuario.rol, 'admin');
    assert.equal(respuesta.body.usuario.password_hash, undefined);
  });

  test('con la contraseña mal responde 401', async () => {
    const respuesta = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@cielum.test', password: 'otra' });
    assert.equal(respuesta.status, 401);
    assert.equal(respuesta.body.mensaje, 'Correo o contraseña incorrectos');
  });

  test('con un correo inválido responde 400', async () => {
    const respuesta = await request(app).post('/auth/login').send({ email: 'no-es-correo' });
    assert.equal(respuesta.status, 400);
    assert.deepEqual(respuesta.body.errores.email, ['Escribe un correo válido']);
    assert.deepEqual(respuesta.body.errores.password, ['La contraseña es obligatoria']);
  });

  test('sin token, una ruta protegida responde 401', async () => {
    const respuesta = await request(app).get('/clientes');
    assert.equal(respuesta.status, 401);
  });

  test('con un token alterado responde 401', async () => {
    const respuesta = await request(app).get('/clientes').set('Authorization', `Bearer ${tokenAdmin}x`);
    assert.equal(respuesta.status, 401);
    assert.equal(respuesta.body.mensaje, 'El token no es válido o ya venció');
  });

  test('GET /auth/perfil devuelve los datos del token', async () => {
    const respuesta = await request(app).get('/auth/perfil').set('Authorization', `Bearer ${tokenVendedor}`);
    assert.equal(respuesta.status, 200);
    assert.deepEqual(respuesta.body, { id_usuario: 2, nombre: 'Vendedor', rol: 'vendedor' });
  });
});

describe('Productos', () => {
  test('la lista es pública y los precios llegan como número', async () => {
    const respuesta = await request(app).get('/productos');
    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.length, 10);
    assert.equal(respuesta.body[0].precio, 180000);
  });

  test('crear sin token responde 401', async () => {
    const respuesta = await request(app).post('/productos').send({});
    assert.equal(respuesta.status, 401);
  });

  test('crear con datos inválidos responde 400 con los campos que fallan', async () => {
    const respuesta = await request(app)
      .post('/productos')
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ nombre: '', categoria: 'Audio', precio: 'caro', stock: -1 });
    assert.equal(respuesta.status, 400);
    assert.deepEqual(respuesta.body.errores, {
      nombre: ['El nombre es obligatorio'],
      precio: ['El precio debe ser un número'],
      stock: ['El stock no puede ser negativo']
    });
  });

  test('crear, consultar, actualizar y borrar un producto', async () => {
    const creado = await request(app)
      .post('/productos')
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ nombre: 'Parlante bluetooth', categoria: 'Audio', precio: 130000, stock: 10 });
    assert.equal(creado.status, 201);
    const id = creado.body.id_producto;

    const consultado = await request(app).get(`/productos/${id}`);
    assert.equal(consultado.body.nombre, 'Parlante bluetooth');

    const actualizado = await request(app)
      .put(`/productos/${id}`)
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ nombre: 'Parlante bluetooth XL', categoria: 'Audio', precio: 150000, stock: 8 });
    assert.equal(actualizado.status, 200);
    assert.equal(actualizado.body.precio, 150000);

    const borradoPorVendedor = await request(app)
      .delete(`/productos/${id}`)
      .set('Authorization', `Bearer ${tokenVendedor}`);
    assert.equal(borradoPorVendedor.status, 403);

    const borrado = await request(app).delete(`/productos/${id}`).set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(borrado.status, 204);

    const yaNoExiste = await request(app).get(`/productos/${id}`);
    assert.equal(yaNoExiste.status, 404);
  });

  test('no deja borrar un producto que ya está en pedidos', async () => {
    const respuesta = await request(app).delete('/productos/1').set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(respuesta.status, 409);
  });
});

describe('Clientes', () => {
  test('un id que no es número responde 400 y uno que no existe 404', async () => {
    const texto = await request(app).get('/clientes/abc').set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(texto.status, 400);
    const noExiste = await request(app).get('/clientes/999').set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(noExiste.status, 404);
  });

  test('crear, actualizar y borrar un cliente', async () => {
    const creado = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ nombre: 'Pedro Ramírez', email: 'Pedro.Ramirez@example.com', ciudad: 'Pereira' });
    assert.equal(creado.status, 201);
    assert.equal(creado.body.email, 'pedro.ramirez@example.com');
    const id = creado.body.id_cliente;

    const actualizado = await request(app)
      .put(`/clientes/${id}`)
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ nombre: 'Pedro Ramírez', email: 'pedro.ramirez@example.com', ciudad: 'Manizales' });
    assert.equal(actualizado.status, 200);
    assert.equal(actualizado.body.ciudad, 'Manizales');

    const borrado = await request(app).delete(`/clientes/${id}`).set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(borrado.status, 204);
  });

  test('un correo repetido responde 409', async () => {
    const respuesta = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ nombre: 'Otra Ana', email: 'ana.gomez@example.com', ciudad: 'Cali' });
    assert.equal(respuesta.status, 409);
    assert.equal(respuesta.body.mensaje, 'Ya existe un cliente con ese correo');
  });

  test('no deja borrar un cliente que tiene pedidos', async () => {
    const respuesta = await request(app).delete('/clientes/1').set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(respuesta.status, 409);
    assert.equal(respuesta.body.mensaje, 'No se puede borrar el cliente porque tiene pedidos');
  });
});

describe('Pedidos: filtros y paginación', () => {
  test('sin filtros trae la primera página de 10 y el total', async () => {
    const respuesta = await request(app).get('/pedidos').set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.datos.length, 10);
    assert.equal(respuesta.body.total, 12);
    assert.equal(respuesta.body.totalPaginas, 2);
    assert.equal(respuesta.body.datos[0].id_pedido, 12);
  });

  test('filtra por estado y pagina', async () => {
    const respuesta = await request(app)
      .get('/pedidos?estado=pendiente&pagina=2&limite=2')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.total, 3);
    assert.equal(respuesta.body.totalPaginas, 2);
    assert.deepEqual(respuesta.body.datos.map((pedido) => pedido.id_pedido), [10]);
  });

  test('los filtros vacíos se toman como no enviados', async () => {
    const respuesta = await request(app)
      .get('/pedidos?estado=&pagina=&limite=')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.pagina, 1);
    assert.equal(respuesta.body.limite, 10);
  });

  test('un estado que no existe o un límite muy alto responde 400', async () => {
    const respuesta = await request(app)
      .get('/pedidos?estado=perdido&limite=500')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(respuesta.status, 400);
    assert.ok(respuesta.body.errores.estado);
    assert.ok(respuesta.body.errores.limite);
  });
});

describe('Pedidos: crear con transacción, cambiar estado y borrar', () => {
  test('crea el pedido con su detalle y descuenta el stock', async () => {
    const respuesta = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ id_cliente: 9, detalle: [{ id_producto: 8, cantidad: 2 }, { id_producto: 9, cantidad: 1 }] });
    assert.equal(respuesta.status, 201);
    assert.equal(respuesta.body.cliente, 'Andrés López');
    assert.equal(respuesta.body.estado, 'pendiente');
    assert.equal(respuesta.body.total, 960000);
    assert.equal(respuesta.body.detalle.length, 2);
    assert.equal(await stockDe(8), 58);
    assert.equal(await stockDe(9), 4);
  });

  test('si un producto no tiene stock, hace ROLLBACK de todo', async () => {
    const antes = await request(app).get('/pedidos').set('Authorization', `Bearer ${tokenAdmin}`);

    const respuesta = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ id_cliente: 10, detalle: [{ id_producto: 2, cantidad: 1 }, { id_producto: 9, cantidad: 100 }] });
    assert.equal(respuesta.status, 409);
    assert.equal(respuesta.body.mensaje, 'No hay stock suficiente de Silla ergonómica: hay 4 y se pidieron 100');

    // El mouse se alcanzó a descontar antes de la silla, pero el ROLLBACK lo devolvió
    assert.equal(await stockDe(2), 40);
    const despues = await request(app).get('/pedidos').set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(despues.body.total, antes.body.total);
  });

  test('un cliente o un producto que no existe responde 404', async () => {
    const sinCliente = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ id_cliente: 999, detalle: [{ id_producto: 1, cantidad: 1 }] });
    assert.equal(sinCliente.status, 404);

    const sinProducto = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ id_cliente: 1, detalle: [{ id_producto: 999, cantidad: 1 }] });
    assert.equal(sinProducto.status, 404);
    assert.equal(sinProducto.body.mensaje, 'El producto 999 no existe');
  });

  test('un pedido sin productos responde 400', async () => {
    const respuesta = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ id_cliente: 1, detalle: [] });
    assert.equal(respuesta.status, 400);
    assert.deepEqual(respuesta.body.errores.detalle, ['El pedido debe tener al menos un producto']);
  });

  test('GET /pedidos/:id trae el detalle con los subtotales', async () => {
    const respuesta = await request(app).get('/pedidos/1').set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.fecha, '2026-08-03');
    assert.equal(respuesta.body.total, 310000);
    assert.deepEqual(
      respuesta.body.detalle.map((linea) => [linea.producto, linea.subtotal]),
      [['Teclado mecánico', 180000], ['Mouse inalámbrico', 130000]]
    );
  });

  test('cambiar el estado y, al cancelar, devolver el stock', async () => {
    const creado = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ id_cliente: 2, detalle: [{ id_producto: 10, cantidad: 3 }] });
    const id = creado.body.id_pedido;
    assert.equal(await stockDe(10), 17);

    const enviado = await request(app)
      .patch(`/pedidos/${id}/estado`)
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ estado: 'enviado' });
    assert.equal(enviado.status, 200);
    assert.equal(enviado.body.estado, 'enviado');

    const cancelado = await request(app)
      .patch(`/pedidos/${id}/estado`)
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ estado: 'cancelado' });
    assert.equal(cancelado.body.estado, 'cancelado');
    assert.equal(await stockDe(10), 20);

    const otraVez = await request(app)
      .patch(`/pedidos/${id}/estado`)
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ estado: 'pendiente' });
    assert.equal(otraVez.status, 409);

    const estadoMalo = await request(app)
      .patch('/pedidos/1/estado')
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ estado: 'perdido' });
    assert.equal(estadoMalo.status, 400);
  });

  test('borrar: solo el admin y solo pedidos pendientes o cancelados', async () => {
    const creado = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ id_cliente: 3, detalle: [{ id_producto: 4, cantidad: 5 }] });
    const id = creado.body.id_pedido;
    assert.equal(await stockDe(4), 10);

    const porVendedor = await request(app).delete(`/pedidos/${id}`).set('Authorization', `Bearer ${tokenVendedor}`);
    assert.equal(porVendedor.status, 403);

    const entregado = await request(app).delete('/pedidos/1').set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(entregado.status, 409);

    const borrado = await request(app).delete(`/pedidos/${id}`).set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(borrado.status, 204);
    assert.equal(await stockDe(4), 15);

    const yaNoExiste = await request(app).get(`/pedidos/${id}`).set('Authorization', `Bearer ${tokenAdmin}`);
    assert.equal(yaNoExiste.status, 404);
  });
});

describe('Aviso a n8n cuando se crea un pedido (parte 7)', () => {
  test('manda a n8n el pedido y el cliente, con el secreto en el encabezado', async () => {
    modoN8n = 'ok';
    const respuesta = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ id_cliente: 2, detalle: [{ id_producto: 8, cantidad: 2 }] });
    assert.equal(respuesta.status, 201);

    const [aviso] = await avisosDe(respuesta.body.id_pedido);
    assert.ok(aviso, 'n8n no recibió el aviso del pedido');
    assert.equal(aviso.cabeceras['x-webhook-secret'], 'secreto-de-las-pruebas-123');
    assert.equal(aviso.cuerpo.evento, 'pedido.creado');
    assert.deepEqual(aviso.cuerpo.cliente, {
      id_cliente: 2,
      nombre: 'Luis Pérez',
      email: 'luis.perez@example.com',
      ciudad: 'Bogotá'
    });
    assert.equal(aviso.cuerpo.pedido.estado, 'pendiente');
    assert.equal(aviso.cuerpo.pedido.total, 70000);
    assert.deepEqual(aviso.cuerpo.pedido.detalle, [
      { id_producto: 8, producto: 'Memoria USB 64 GB', cantidad: 2, precio_unitario: 35000, subtotal: 70000 }
    ]);
  });

  test('si n8n responde con error 500, la API lo vuelve a intentar', async () => {
    modoN8n = 'falla-una-vez';
    const respuesta = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ id_cliente: 5, detalle: [{ id_producto: 8, cantidad: 1 }] });
    assert.equal(respuesta.status, 201);

    const recibidos = await avisosDe(respuesta.body.id_pedido, 2);
    assert.equal(recibidos.length, 2, 'la API no reintentó después del error 500');
  });

  test('la API responde sin esperar a que n8n conteste', async () => {
    modoN8n = 'lento'; // el n8n falso tarda 1,5 s en responder
    const inicio = Date.now();
    const respuesta = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${tokenVendedor}`)
      .send({ id_cliente: 6, detalle: [{ id_producto: 8, cantidad: 1 }] });
    assert.equal(respuesta.status, 201);
    assert.ok(Date.now() - inicio < 1500, 'la respuesta de la API esperó a n8n');

    const [aviso] = await avisosDe(respuesta.body.id_pedido);
    assert.ok(aviso, 'n8n no recibió el aviso del pedido');
    modoN8n = 'ok';
  });
});
