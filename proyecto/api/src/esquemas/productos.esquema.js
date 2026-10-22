import * as z from 'zod';

export const productoEsquema = z.object({
  nombre: z
    .string({ error: 'El nombre es obligatorio' })
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre puede tener máximo 100 caracteres'),
  categoria: z
    .string({ error: 'La categoría es obligatoria' })
    .trim()
    .min(1, 'La categoría es obligatoria')
    .max(50, 'La categoría puede tener máximo 50 caracteres'),
  precio: z.number({ error: 'El precio debe ser un número' }).positive('El precio debe ser mayor que 0'),
  stock: z
    .number({ error: 'El stock debe ser un número' })
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo')
});
