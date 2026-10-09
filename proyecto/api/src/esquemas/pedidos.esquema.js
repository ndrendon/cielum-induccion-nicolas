import * as z from 'zod';

export const ESTADOS = ['pendiente', 'enviado', 'entregado', 'cancelado'];

const mensajeEstado = `El estado debe ser uno de estos: ${ESTADOS.join(', ')}`;

// Datos para crear un pedido: el cliente y la lista de productos con su cantidad
export const crearPedidoEsquema = z.object({
  id_cliente: z
    .number({ error: 'El id_cliente debe ser un número' })
    .int('El id_cliente debe ser un número entero')
    .positive('El id_cliente debe ser mayor que 0'),
  detalle: z
    .array(
      z.object({
        id_producto: z
          .number({ error: 'El id_producto debe ser un número' })
          .int('El id_producto debe ser un número entero')
          .positive('El id_producto debe ser mayor que 0'),
        cantidad: z
          .number({ error: 'La cantidad debe ser un número' })
          .int('La cantidad debe ser un número entero')
          .positive('La cantidad debe ser mayor que 0')
      }),
      { error: 'El detalle debe ser una lista de productos' }
    )
    .min(1, 'El pedido debe tener al menos un producto')
});

export const estadoEsquema = z.object({
  estado: z.enum(ESTADOS, { error: mensajeEstado })
});

// Los valores de la query (?estado=&pagina=&limite=) llegan como texto.
// Si llegan vacíos, se toman como si no los hubieran mandado.
const vacioComoNoEnviado = (esquema) => z.preprocess((valor) => (valor === '' ? undefined : valor), esquema);

export const filtrosPedidosEsquema = z.object({
  estado: vacioComoNoEnviado(z.enum(ESTADOS, { error: mensajeEstado }).optional()),
  pagina: vacioComoNoEnviado(
    z.coerce
      .number({ error: 'La página debe ser un número' })
      .int('La página debe ser un número entero')
      .min(1, 'La página debe ser 1 o más')
      .default(1)
  ),
  limite: vacioComoNoEnviado(
    z.coerce
      .number({ error: 'El límite debe ser un número' })
      .int('El límite debe ser un número entero')
      .min(1, 'El límite debe estar entre 1 y 100')
      .max(100, 'El límite debe estar entre 1 y 100')
      .default(10)
  )
});
