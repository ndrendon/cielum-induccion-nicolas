import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Los ejercicios usan el puerto 5176, para poder tenerlos prendidos al mismo tiempo que el reto (5175).
// Las peticiones a /api/... se pasan a la API del proyecto y se les quita el /api.
// Por defecto usa la API de npm run dev (puerto 3000). Para usar la de Docker:
//   $env:API_URL = "http://localhost:3001"; npm run dev
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5176,
    proxy: {
      '/api': {
        target: process.env.API_URL ?? 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (ruta) => ruta.replace(/^\/api/, ''),
      },
    },
  },
})
