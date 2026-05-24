import { defineStore } from 'pinia'
import { ref } from 'vue'

export type MenuPosition = 'left' | 'right' | 'top'
export type AppTheme = 'light' | 'dark'

export const useAppSettingsStore = defineStore('appSettings', {
  state: () => {
    const menuPosition = ref<MenuPosition>('left')
    const isEdit = ref(false)
    const theme = ref<AppTheme>('light')
    
    return {
      menuPosition,
      isEdit,
      theme,
    }
  },
  actions: {
    setMenuPosition(position: MenuPosition) {
      this.menuPosition = position
    },
    setEditMode(mode: boolean) {
      this.isEdit = mode
    },
    setTheme(theme: AppTheme) {
      this.theme = theme
    },
  },
})

export default useAppSettingsStore
