import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// El frontend siempre llama a la API con rutas que empiezan por /api (por ejemplo /api/pedidos).
// En desarrollo (npm run dev), Vite pasa esas peticiones a la API y les quita el /api.
// La dirección de la API sale del archivo .env (API_URL). Si no hay .env, usa http://localhost:3000.
export default defineConfig(({ mode }) => {
  // loadEnv lee el .env de esta carpeta. El '' del final hace que lea todas las variables, no solo las VITE_
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // vue() convierte los archivos .vue en JavaScript y CSS; vueDevTools() agrega las herramientas de Vue
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        // @ es la carpeta src, por ejemplo: import CajaMensaje from '@/componentes/CajaMensaje.vue'
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5175,
      proxy: {
        '/api': {
          target: env.API_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (ruta) => ruta.replace(/^\/api/, ''),
        },
      },
    },
  }
})
