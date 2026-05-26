import { defineStore } from 'pinia'
export type MenuPosition = 'left' | 'right' | 'top'
export type AppTheme = 'light' | 'dark'

export const useAppSettingsStore = defineStore('appSettings', {
  state: () => ({
    menuPosition: 'left' as MenuPosition,
    isEdit: false,
    theme: 'light' as AppTheme,
  }),
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
