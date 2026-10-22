import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// El frontend siempre llama a la API con rutas que empiezan por /api (por ejemplo /api/pedidos).
// En desarrollo (npm run dev), Vite pasa esas peticiones a la API y les quita el /api.
// Por defecto usa la API de npm run dev (puerto 3000). Para usar la de Docker:
//   $env:API_URL = "http://localhost:3001"; npm run dev
export default defineConfig({
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
        target: process.env.API_URL ?? 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (ruta) => ruta.replace(/^\/api/, ''),
      },
    },
  },
})
