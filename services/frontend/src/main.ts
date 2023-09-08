import './assets/main.css'
import { Register as RegisterApi } from '@piperchat/commons/src/api/users/auth'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
