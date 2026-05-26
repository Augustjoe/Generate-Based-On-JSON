import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useAppSettingsStore } from './appSettings'

export const useEditMode = defineStore('editMode', () => {
  const appSettings = useAppSettingsStore()
  const isEdit = computed(() => appSettings.isEdit)

  const getEditMode = () => appSettings.isEdit
  const setEditMode = (mode: boolean) => {
    appSettings.setEditMode(mode)
  }

  return {
    isEdit,
    getEditMode,
    setEditMode,
  }
})

export default useEditMode
