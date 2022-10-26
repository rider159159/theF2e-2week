import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router.js'

const app = createApp(App)

// 引入 Pinia 以及封裝後的 stores
import { createPinia } from 'pinia'
const pinia = createPinia()
import stores from './store/index.js'
app.provide('$stores', stores)

app
.use(router)
.use(pinia)
.mount('#app')
