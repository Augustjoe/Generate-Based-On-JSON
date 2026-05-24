import { createRouter, createWebHistory } from 'vue-router'
import { config } from '../views/router'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: config.routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  // 必须同时存在 token 和 userInfo 且 token 不为无效字符串时才判定为已登录
  const hasToken = !!(
    authStore.token &&
    authStore.token !== 'null' &&
    authStore.token !== 'undefined' &&
    authStore.userInfo
  )
  
  console.log(`[Router Guard] 导航至: ${to.path}, 已登录: ${hasToken}, Token: ${authStore.token}, UserInfo:`, authStore.userInfo)
  
  if (to.path !== '/login' && !hasToken) {
    next('/login')
  } else if (to.path === '/login' && hasToken) {
    next('/')
  } else {
    next()
  }
})

export default router

