import { defineStore } from 'pinia'
import type { TemplateAsset } from '@/types/template'
import { createMockTemplates, validateTemplateAsset } from '@/utils/templateSchema'

const STORAGE_KEY = 'gbj-template-assets'

export const useTemplateStore = defineStore('templateStore', {
  state: () => ({
    templates: [] as Array<Record<string, any>>,
    initialized: false,
  }),
  getters: {
    getById: (state) => (id: string) => state.templates.find((item) => item.id === id),
  },
  actions: {
    init() {
      if (this.initialized) return
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) {
          this.templates = createMockTemplates()
          this.persist()
        } else {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) {
            const valid: Array<Record<string, any>> = []
            parsed.forEach((item) => {
              const result = validateTemplateAsset(item)
              if (result.ok) valid.push(result.value)
            })
            this.templates = valid.length > 0 ? valid : createMockTemplates()
          } else {
            this.templates = createMockTemplates()
          }
        }
      } catch {
        this.templates = createMockTemplates()
      }
      this.initialized = true
    },
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.templates))
    },
    updateTemplateConfig(id: string, config: TemplateAsset['config']) {
      const target = this.templates.find((item) => item.id === id)
      if (!target) return
      target.config = config
      target.updatedAt = new Date().toISOString().slice(0, 10)
      this.persist()
    },
    importTemplateFromText(text: string) {
      const parsed = JSON.parse(text)
      const validation = validateTemplateAsset(parsed)
      if (!validation.ok) throw new Error(validation.error)
      const existsIndex = this.templates.findIndex((item) => item.id === validation.value.id)
      if (existsIndex >= 0) {
        this.templates[existsIndex] = validation.value
      } else {
        this.templates.unshift(validation.value)
      }
      this.persist()
      return validation.value as TemplateAsset
    },
    exportTemplateText(id: string) {
      const target = this.templates.find((item) => item.id === id)
      if (!target) throw new Error('模板不存在')
      return JSON.stringify(target, null, 2)
    },
  },
})

export default useTemplateStore
