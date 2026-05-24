import { defineStore } from 'pinia'
import { useAppSettingsStore } from './appSettings'

export const useEditMode = defineStore('editMode', {
  getters: {
    isEdit: () => {
      const appSettings = useAppSettingsStore()
      return appSettings.isEdit
    }
  },
  actions: {
    getEditMode() {
      const appSettings = useAppSettingsStore()
      return appSettings.isEdit
    },
    setEditMode(mode: boolean) {
      const appSettings = useAppSettingsStore()
      appSettings.isEdit = mode
    },
  },
})

export default useEditMode
