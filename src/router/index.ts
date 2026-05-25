import { createRouter, createWebHistory } from 'vue-router'
import { config } from '../views/router'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: config.routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  // 必须同时存在 token 和 userInfo，且 token 不是无效字符串时才判定为已登录
  const hasToken = !!(
    authStore.token &&
    authStore.token !== 'null' &&
    authStore.token !== 'undefined' &&
    authStore.userInfo
  )

  if (import.meta.env.DEV) {
    console.debug('[Router Guard]', {
      to: to.path,
      authenticated: hasToken,
      hasUserInfo: !!authStore.userInfo,
    })
  }

  if (to.path !== '/login' && !hasToken) {
    next('/login')
  } else if (to.path === '/login' && hasToken) {
    next('/')
  } else {
    next()
  }
})

export default router
