import { createRouter, createWebHistory } from 'vue-router'
import { config } from '../views/router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: config.routes,
})

export default router
