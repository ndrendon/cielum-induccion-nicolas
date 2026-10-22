import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// El frontend siempre llama a la API con rutas que empiezan por /api (por ejemplo /api/pedidos).
// En desarrollo (npm run dev), Vite pasa esas peticiones a la API y les quita el /api.
// Por defecto usa la API de npm run dev (puerto 3000). Para usar la de Docker:
//   $env:API_URL = "http://localhost:3001"; npm run dev
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.API_URL ?? 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (ruta) => ruta.replace(/^\/api/, ''),
      },
    },
  },
});
