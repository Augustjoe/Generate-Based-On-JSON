import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEditMode = defineStore('editMode', {
  state: () => {
    const isEdit = ref(false)
    return { isEdit }
  },
  actions: {
    getEditMode() {
      return this.isEdit
    },
    setEditMode(mode: boolean) {
      this.isEdit = mode as boolean
    },
  },
})

export default useEditMode
