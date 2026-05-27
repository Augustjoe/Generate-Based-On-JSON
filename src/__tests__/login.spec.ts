import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import LoginFrom from '@/views/login/loginFrom'

const pushMock = vi.fn()
const loginMock = vi.fn()
const validateMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    login: loginMock,
  }),
}))

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  return {
    ...actual,
    useMessage: () => ({
      success: vi.fn(),
      error: vi.fn(),
    }),
  }
})

vi.mock('@/components/Form', () => ({
  default: defineComponent({
    name: 'MockForm',
    setup(_, { expose }) {
      expose({
        validate: validateMock,
      })
      return () => h('div')
    },
  }),
}))

describe('LoginFrom', () => {
  beforeEach(() => {
    pushMock.mockReset()
    loginMock.mockReset()
    validateMock.mockReset()
    loginMock.mockResolvedValue(undefined)
    validateMock.mockResolvedValue(undefined)
  })

  it('submits when Enter is pressed', async () => {
    const wrapper = mount(LoginFrom)
    await wrapper.trigger('keydown', { key: 'Enter' })
    await Promise.resolve()

    expect(validateMock).toHaveBeenCalledTimes(1)
    expect(loginMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith('/')
  })

  it('prevents duplicate submit while loading', async () => {
    let resolveLogin: (() => void) | null = null
    loginMock.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveLogin = resolve
      }),
    )

    const wrapper = mount(LoginFrom)
    const submitButton = wrapper.find('.login-btn')

    await wrapper.trigger('keydown', { key: 'Enter' })
    await submitButton.trigger('click')

    expect(loginMock).toHaveBeenCalledTimes(1)

    resolveLogin!()
    await Promise.resolve()
  })
})
