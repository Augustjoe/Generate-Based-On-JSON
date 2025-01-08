import { defineStore } from 'pinia'
import type * as NaiveUI from 'naive-ui'

export const useNaiveStore = defineStore('naive', {
  state: () => ({
    components: {} as Partial<typeof NaiveUI>, // 存储部分动态加载的组件
  }),
  actions: {
    getComponent(name: keyof typeof NaiveUI) {
      return this.components[name] || null
    },
    setComponent(modules: Partial<typeof NaiveUI>) {
      Object.assign(this.components, modules)
    },
  },
})
