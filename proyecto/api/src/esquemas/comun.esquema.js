import * as z from 'zod';

// El id que viene en la URL (/clientes/5) llega como texto; z.coerce lo convierte en número
export const parametrosEsquema = z.object({
  id: z.coerce
    .number({ error: 'El id debe ser un número' })
    .int('El id debe ser un número entero')
    .positive('El id debe ser mayor que 0')
});
