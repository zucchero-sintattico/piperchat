import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import MonitoringView from '../views/MonitoringView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/login', name: 'Login', component: LoginView, meta: { requiresAuth: false } },
    {
      path: '/monitoring',
      name: 'Monitoring',
      component: MonitoringView,
      meta: { requiresAuth: false }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: HomeView,
      meta: { requiresAuth: true }
    }
  ]
})

export default router
