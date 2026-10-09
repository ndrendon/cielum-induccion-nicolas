import * as z from 'zod';

// Cada regla lleva su propio mensaje, para que el error diga claro qué corregir
export const loginEsquema = z.object({
  email: z.email('Escribe un correo válido'),
  password: z.string({ error: 'La contraseña es obligatoria' }).min(1, 'La contraseña es obligatoria')
});
