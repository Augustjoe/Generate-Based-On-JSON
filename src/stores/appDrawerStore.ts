import { reactive, shallowReactive, VNode } from 'vue'
import { DrawerProps } from 'naive-ui'
import { defineStore } from 'pinia'

export const useAppDrawerStore = defineStore('appDrawer', () => {
  const drawerProps = reactive<DrawerProps>({})
  const drawSlots = shallowReactive<DrawSlots>({})

  const setDrawerProps = (obj: DrawerProps) => {
    ;(Object.keys(obj) as Array<keyof DrawerProps>).forEach((key) => {
      drawerProps[key] = obj[key]
    })
  }
  const setDrawSlots = (obj: DrawSlots) => {
    ;(Object.keys(obj) as Array<keyof DrawSlots>).forEach((key) => {
      drawSlots[key] = obj[key]
    })
  }
  const setDrawerPropsClear = () => {
    Object.keys(drawerProps).forEach((key) => {
      delete drawerProps[key as keyof DrawerProps]
    })
  }

  return { drawerProps, drawSlots, setDrawSlots, setDrawerProps, setDrawerPropsClear }
})
