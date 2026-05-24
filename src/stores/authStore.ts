import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const getStoredToken = () => {
    const val = localStorage.getItem('token')
    if (val === null || val === 'null' || val === 'undefined') {
      return null
    }
    return val
  }
  const token = ref<string | null>(getStoredToken())
  
  const getStoredUserInfo = () => {
    const stored = localStorage.getItem('userInfo')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse userInfo', e)
      }
    }
    return null
  }
  
  const userInfo = ref<{ userName: string } | null>(getStoredUserInfo())

  const setToken = (value: string | null) => {
    token.value = value
    if (value) {
      localStorage.setItem('token', value)
    } else {
      localStorage.removeItem('token')
    }
  }

  const login = async (userName: string) => {
    // 模拟纯前端登录请求
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockToken = `mock-token-${Date.now()}`
        setToken(mockToken)
        const info = { userName }
        userInfo.value = info
        localStorage.setItem('userInfo', JSON.stringify(info))
        resolve()
      }, 500)
    })
  }

  const logout = () => {
    setToken(null)
    userInfo.value = null
    localStorage.removeItem('userInfo')
  }

  return {
    token,
    userInfo,
    login,
    logout,
  }
})
