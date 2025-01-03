import { createRouter, createWebHistory } from 'vue-router'
import { test } from '../json/text'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: test.routes,
})

export default router
