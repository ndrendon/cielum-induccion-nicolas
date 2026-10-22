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
  NODE_ENV: z.string().default('development')
});

const resultado = esquemaEntorno.safeParse(process.env);

if (!resultado.success) {
  console.error('Faltan variables de entorno o tienen un valor inválido (revisa el archivo .env):');
  console.error(z.flattenError(resultado.error).fieldErrors);
  process.exit(1);
}

export const config = resultado.data;
