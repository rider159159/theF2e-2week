import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router.js'
import 'uno.css'
import '@unocss/reset/tailwind.css';

const app = createApp(App)



app
.use(router)
.mount('#app')
