// Aviso a n8n cada vez que se crea un pedido (proyecto integrador, parte 7).
// n8n recibe el aviso en un webhook y pasa el cliente a Zoho CRM (ver proyecto/n8n).
//
// El aviso no frena la respuesta de la API: el pedido ya quedó guardado en la base,
// así que si n8n está apagado o tarda, solo se reintenta unas veces y se deja el error en el log.

import { config } from '../config.js';

const INTENTOS = 3;
const ESPERA_INICIAL_MS = 1000; // espera 1 s antes del segundo intento y 2 s antes del tercero
const TIEMPO_MAXIMO_MS = 5000; // cada intento espera la respuesta de n8n máximo 5 s

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

// Arma el cuerpo del aviso: el evento, el pedido con su detalle y los datos del cliente
export function armarAviso(pedido, cliente) {
  return {
    evento: 'pedido.creado',
    pedido: {
      id_pedido: pedido.id_pedido,
      fecha: pedido.fecha,
      estado: pedido.estado,
      total: pedido.total,
      detalle: pedido.detalle.map(({ id_producto, producto, cantidad, precio_unitario, subtotal }) => ({
        id_producto,
        producto,
        cantidad,
        precio_unitario,
        subtotal
      }))
    },
    cliente: {
      id_cliente: cliente.id_cliente,
      nombre: cliente.nombre,
      email: cliente.email,
      ciudad: cliente.ciudad
    }
  };
}

// Manda el aviso con reintentos. Nunca lanza errores: devuelve true si n8n lo recibió y false si no.
export async function avisarPedidoCreado(pedido, cliente) {
  if (!config.N8N_WEBHOOK_URL) {
    return false; // la integración está apagada
  }

  try {
    const cuerpo = JSON.stringify(armarAviso(pedido, cliente));

    for (let intento = 1; intento <= INTENTOS; intento++) {
      try {
        const respuesta = await fetch(config.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': config.N8N_WEBHOOK_SECRET },
          body: cuerpo,
          signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS)
        });

        if (respuesta.ok) {
          console.log(`n8n recibió el pedido ${pedido.id_pedido} (${respuesta.status})`);
          return true;
        }

        // Un 4xx es un problema de los datos, del secreto o del webhook: reintentar no lo arregla
        if (respuesta.status < 500) {
          const detalle = (await respuesta.text()).slice(0, 300);
          console.error(`n8n rechazó el pedido ${pedido.id_pedido} con el código ${respuesta.status}: ${detalle}`);
          return false;
        }

        console.warn(`Intento ${intento} de ${INTENTOS}: n8n respondió ${respuesta.status} al pedido ${pedido.id_pedido}`);
      } catch (error) {
        // n8n apagado, sin red o sin respuesta en 5 s
        console.warn(`Intento ${intento} de ${INTENTOS}: no se pudo avisar a n8n del pedido ${pedido.id_pedido} (${error.message})`);
      }

      if (intento < INTENTOS) {
        await esperar(ESPERA_INICIAL_MS * 2 ** (intento - 1));
      }
    }

    console.error(`No se pudo avisar a n8n del pedido ${pedido.id_pedido} después de ${INTENTOS} intentos`);
  } catch (error) {
    console.error(`Error inesperado al avisar a n8n del pedido ${pedido.id_pedido}:`, error);
  }

  return false;
}
