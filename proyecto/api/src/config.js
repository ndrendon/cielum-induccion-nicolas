// Lee las variables de entorno y revisa que estén completas apenas arranca la API.
// Si falta alguna, la API se detiene con un mensaje claro en vez de fallar después.

import * as z from 'zod';

const esquemaEntorno = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  PGDATABASE: z.string().min(1),
  PGUSER: z.string().min(1),
  PGPASSWORD: z.string().min(1),
  JWT_SECRET: z.string().min(16, 'El secreto del JWT debe tener al menos 16 caracteres'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  NODE_ENV: z.string().default('development'),
  // Webhook de n8n que recibe cada pedido nuevo (proyecto integrador, parte 7).
  // Si se deja vacío, la API no avisa a nadie y todo lo demás funciona igual.
  N8N_WEBHOOK_URL: z.union([z.url('N8N_WEBHOOK_URL debe ser una URL'), z.literal('')]).default(''),
  // Secreto que la API manda en el encabezado X-Webhook-Secret, para que n8n sepa que el aviso es de ella
  N8N_WEBHOOK_SECRET: z.string().default('')
}).refine((entorno) => !entorno.N8N_WEBHOOK_URL || entorno.N8N_WEBHOOK_SECRET.length >= 16, {
  path: ['N8N_WEBHOOK_SECRET'],
  message: 'Si hay N8N_WEBHOOK_URL, N8N_WEBHOOK_SECRET debe tener al menos 16 caracteres'
});

const resultado = esquemaEntorno.safeParse(process.env);

if (!resultado.success) {
  console.error('Faltan variables de entorno o tienen un valor inválido (revisa el archivo .env):');
  console.error(z.flattenError(resultado.error).fieldErrors);
  process.exit(1);
}

export const config = resultado.data;
