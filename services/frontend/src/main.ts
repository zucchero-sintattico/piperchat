import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

import './assets/reset.css'
import { useUserStore } from './stores/user'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
pinia.use(piniaPluginPersistedState)

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  console.log(userStore.isLoggedIn)
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

app.use(router)

app.mount('#app')
