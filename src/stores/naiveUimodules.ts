import { defineStore } from 'pinia'

export const useNaiveStore = defineStore('naive', {
  state: () => ({
    components: {} as NaiveUIComponents, // 存储部分动态加载的组件
  }),
  actions: {
    getComponent(name: NaiveUIComponentsKeys) {
      return this.components[name] as NaiveUIComponents
    },
    setComponent(modules: NaiveUIComponents) {
      Object.assign(this.components, modules)
    },
  },
})
