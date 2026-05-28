import { defineStore } from 'pinia'

export type EditableSectionRecord = {
  id: string
  path: string
  key: string
  title: string
  order: number
  getValue: () => unknown
  apply: (value: unknown) => void
}

export const useEditableRegistryStore = defineStore('editableRegistry', {
  state: () => ({
    sections: {} as Record<string, EditableSectionRecord>,
  }),
  getters: {
    sectionsByPath: (state) => (path: string) =>
      Object.values(state.sections)
        .filter((item) => item.path === path)
        .sort((a, b) => a.order - b.order),
  },
  actions: {
    registerSection(section: EditableSectionRecord) {
      this.sections[section.id] = section
    },
    unregisterSection(sectionId: string) {
      delete this.sections[sectionId]
    },
  },
})

export default useEditableRegistryStore
