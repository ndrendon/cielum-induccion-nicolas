import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// El frontend siempre llama a la API con rutas que empiezan por /api (por ejemplo /api/pedidos).
// En desarrollo (npm run dev), Vite pasa esas peticiones a la API y les quita el /api.
// La dirección de la API sale del archivo .env (API_URL). Si no hay .env, usa http://localhost:3000.
export default defineConfig(({ mode }) => {
  // loadEnv lee el .env de esta carpeta. El '' del final hace que lea todas las variables, no solo las VITE_
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.API_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (ruta) => ruta.replace(/^\/api/, ''),
        },
      },
    },
  };
});
