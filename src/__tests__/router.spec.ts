import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../stores/authStore'

// Mock the router configuration to prevent loading heavy view components and ECharts
vi.mock('../views/router', () => ({
  config: {
    routes: [
      { path: '/', name: 'index', redirect: '/home' },
      { path: '/home', name: '主控台' },
      { path: '/login', name: '登录' },
    ]
  }
}))

import router from '../router'

describe('Router Navigation Guards', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should redirect unauthenticated users to /login', async () => {
    const authStore = useAuthStore()
    authStore.logout()

    await router.push('/home')
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('should allow authenticated users to access other routes', async () => {
    const authStore = useAuthStore()
    await authStore.login('admin')

    await router.push('/home')
    expect(router.currentRoute.value.path).toBe('/home')
  })

  it('should redirect authenticated users away from /login to /home', async () => {
    const authStore = useAuthStore()
    await authStore.login('admin')

    // Start from /home
    await router.push('/home')
    
    await router.push('/login')
    expect(router.currentRoute.value.path).toBe('/home')
  })
})
