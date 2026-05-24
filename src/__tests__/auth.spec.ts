import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/authStore'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with null token and userInfo if localStorage is empty', () => {
    const authStore = useAuthStore()
    expect(authStore.token).toBeNull()
    expect(authStore.userInfo).toBeNull()
  })

  it('should store token and userInfo in localStorage and state on login', async () => {
    const authStore = useAuthStore()
    await authStore.login('testUser')
    expect(authStore.token).not.toBeNull()
    expect(authStore.token).toContain('mock-token')
    expect(authStore.userInfo?.userName).toBe('testUser')
    expect(localStorage.getItem('token')).toBe(authStore.token)
    expect(localStorage.getItem('userInfo')).toBe(JSON.stringify({ userName: 'testUser' }))
  })

  it('should clear token, userInfo and state on logout', async () => {
    const authStore = useAuthStore()
    await authStore.login('testUser')
    authStore.logout()
    expect(authStore.token).toBeNull()
    expect(authStore.userInfo).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('userInfo')).toBeNull()
  })

  it('should restore token and userInfo from localStorage on initialization', () => {
    localStorage.setItem('token', 'stored-token')
    localStorage.setItem('userInfo', JSON.stringify({ userName: 'persistedUser' }))
    const authStore = useAuthStore()
    expect(authStore.token).toBe('stored-token')
    expect(authStore.userInfo?.userName).toBe('persistedUser')
  })
})
