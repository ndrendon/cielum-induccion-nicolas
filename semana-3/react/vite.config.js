import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Los ejercicios usan el puerto 5174, para poder tenerlos prendidos al mismo tiempo que el reto (5173).
// Las peticiones que empiezan por /api (por ejemplo /api/productos) Vite las pasa a la API y les quita el /api.
// Por defecto usa la API de npm run dev (puerto 3000). Para usar la de Docker:
//   $env:API_URL = "http://localhost:3001"; npm run dev
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: process.env.API_URL ?? 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (ruta) => ruta.replace(/^\/api/, ''),
      },
    },
  },
});
