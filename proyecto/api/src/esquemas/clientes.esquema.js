import * as z from 'zod';

export const clienteEsquema = z.object({
  nombre: z
    .string({ error: 'El nombre es obligatorio' })
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre puede tener máximo 100 caracteres'),
  email: z.email('Escribe un correo válido').max(150, 'El correo puede tener máximo 150 caracteres'),
  ciudad: z
    .string({ error: 'La ciudad es obligatoria' })
    .trim()
    .min(1, 'La ciudad es obligatoria')
    .max(60, 'La ciudad puede tener máximo 60 caracteres')
});
