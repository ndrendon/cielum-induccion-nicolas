import './estilos.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Crea la aplicación, le instala Pinia (estado global) y el router (las páginas),
// y la dibuja dentro de <div id="app"> (index.html).
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
