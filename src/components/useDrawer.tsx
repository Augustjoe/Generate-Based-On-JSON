import { NDrawer, NDrawerContent, DrawerProps } from 'naive-ui'
import { useAppDrawerStore } from '@/stores/appDrawerStore'
import { defineComponent } from 'vue'
import { use } from 'echarts/types/src/extension.js'

export const DrawerDom = defineComponent({
  name: 'UseDrawer',
  setup() {
    const { drawerProps, drawSlots } = useAppDrawerStore()
    return () => {
      return (
        <NDrawer {...drawerProps}>
          {{
            ...drawSlots,
            default: () => (
              <NDrawerContent>{(drawSlots.default || (() => <div></div>))()}</NDrawerContent>
            ),
          }}
        </NDrawer>
      )
    }
  },
})
export const useDrawer = (slots: DrawSlots, props?: DrawerProps) => {
  const { setDrawerProps, setDrawSlots } = useAppDrawerStore()
  setDrawSlots({
    ...slots,
  })
  setDrawerProps({
    show: true,
    defaultWidth: '502',
    resizable: true,
    onUpdateShow(value: boolean) {
      setDrawerProps({ show: value })
    },
    onAfterLeave() {
      setDrawerProps({
        show: false,
      })
      setDrawSlots({})
    },
    ...props,
  })
}

export default DrawerDom
