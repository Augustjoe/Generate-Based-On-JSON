import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { useAppSettingsStore } from '../stores/appSettings'
import ProTable from '../components/ProTable'

vi.mock('../components/SearchFrom', () => ({
  default: {
    name: 'SearchFrom',
    render: () => null,
  },
}))

vi.mock('../components/CustomTable', () => ({
  default: {
    name: 'CustomTable',
    render: () => null,
  },
}))

vi.mock('../utils/dynamicComponent', () => ({
  getNaiveComponent: vi.fn(() => ({
    name: 'MockNaiveComponent',
    render: () => null,
  })),
}))

describe('Admin Layout & Settings Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize settings correctly', () => {
    const store = useAppSettingsStore()
    expect(store.menuPosition).toBe('left')
    expect(store.isEdit).toBe(false)
    expect(store.theme).toBe('light')
  })

  it('should modify settings correctly', () => {
    const store = useAppSettingsStore()
    store.setMenuPosition('top')
    store.setTheme('dark')
    store.setEditMode(true)

    expect(store.menuPosition).toBe('top')
    expect(store.theme).toBe('dark')
    expect(store.isEdit).toBe(true)
  })
})

describe('ProTable Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should trigger request prop on mount', async () => {
    const requestMock = vi.fn().mockResolvedValue({
      data: [{ id: 1, name: 'Test Row' }],
      total: 1,
    })

    const wrapper = mount(ProTable, {
      props: {
        columns: [{ title: 'Name', key: 'name' }],
        request: requestMock,
      },
      global: {
        stubs: {
          SearchFrom: true,
          CustomTable: true,
          NSpin: true,
          NCard: true,
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    // 验证 request 是否在生命周期中被触发
    expect(requestMock).toHaveBeenCalled()
  })
})
