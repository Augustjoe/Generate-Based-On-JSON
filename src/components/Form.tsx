import { defineComponent, ref, defineAsyncComponent, onMounted, watch } from 'vue'
import { NForm, NGrid, NFormItemGi } from 'naive-ui'
import { useNaiveStore } from '@/stores/naiveUimodules'

export default defineComponent({
  name: 'Form',
  props: {
    formItems: {
      required: false,
      default: () => [
        {
          itemType: 'NInput',
          props: {
            style: { width: '120px' },
          },
        },
      ],
    },
  },
  setup(props) {
    const loadedFormItems = ref<any[]>([])
    const { getComponent } = useNaiveStore()

    const getNaiveUiItems = async () => {
      const promises = props.formItems.map(async ({ itemType, props: itemProps }) => {
        const componentName = itemType.slice(1).toLowerCase()
        try {
          return { item: getComponent(itemType), props: itemProps || {} }
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
