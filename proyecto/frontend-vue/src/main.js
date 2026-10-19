import './estilos.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// createApp crea la aplicación con el componente principal (App.vue).
// Pinia guarda la sesión y el router maneja las direcciones; los dos se instalan con app.use.
// Pinia va primero, porque la guarda del router lee la sesión.
// Al final, mount dibuja la aplicación dentro de <div id="app"> (index.html).
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
