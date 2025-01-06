import { defineComponent, ref, defineAsyncComponent, onMounted, watch } from 'vue'
import { NForm, NGrid, NFormItemGi } from 'naive-ui'

export default defineComponent({
  name: 'Form',
  props: {
    formItems: {
      required: false,
      default: () => [
        {
          itemType: 'NInput',
          props: {},
        },
      ],
    },
  },
  setup(props) {
    const loadedFormItems = ref<any[]>([])

    // 预定义 itemType 到异步组件的映射
    const typeMap: Record<string, () => Promise<{ default: Component }>> = {
      input: () => import('naive-ui/es/input'),
      NSelect: () => import('naive-ui/es/select'),
      button: () => import('naive-ui/es/button'),
      NSelect: () => import('naive-ui/es/select'),
      NSelect: () => import('naive-ui/es/select'),
      // 根据需要添加更多组件映射
    }
    // props.formItems.forEach(({ itemType }) => {
    //   if (!typeMap[itemType]) {
    //     const componentName = itemType.slice(1).toLowerCase()
    //     // const path = 'naive-ui/es/input'
    //     typeMap[itemType] = () =>
    //       require(`'naive-ui/es/${componentName}`).catch((error) => {
    //         console.error(`未能加载组件 ${itemType}:`, error)
    //         return { default: null }
    //       })
    //   }
    // })

    const getNaiveUiItems = async () => {
      const promises = props.formItems.map(async ({ itemType, props: itemProps }) => {
        const componentName = itemType.slice(1).toLowerCase()
        try {
          const module = await import(`naive-ui-es/${componentName}/index.d.js`)
          return { item: module.default, props: itemProps || {} }
        } catch (error) {
          console.error(`加载组件 ${itemType} 失败:`, error)
          return null
        }
      })

      const results = await Promise.all(promises)
      loadedFormItems.value = results.filter((item) => item !== null)
    }

    watch(() => props.formItems, getNaiveUiItems, { immediate: true })

    onMounted(getNaiveUiItems)

    return { loadedFormItems }
  },
  render() {
    const { loadedFormItems } = this

    return (
      <NForm>
        <NGrid>
          <NFormItemGi>
            {loadedFormItems.map(({ item: AsyncComponent, props }, index) => (
              <AsyncComponent key={index} {...props} />
            ))}
          </NFormItemGi>
        </NGrid>
      </NForm>
    )
  },
})
