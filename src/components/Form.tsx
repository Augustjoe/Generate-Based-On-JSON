import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
import { NForm, NGrid, NFormItemGi, type NotificationApi } from 'naive-ui'
import { useNaiveStore } from '@/stores/naiveUimodules'
import type { FormProps, GridProps } from 'naive-ui'

type FormItem =
  | {
      itemType: string
      path?: string
      props?: Record<string, any>
      itemGiProps?: Record<string, any>
      render?: () => HTMLElement
    }
  | Record<string, any>

export default defineComponent({
  name: 'Form',
  props: {
    formItems: {
      required: false,
      type: Array as () => FormItem[],
      default: () => [],
    },
    formProps: {
      required: false,
      type: Object as () => FormProps,
      default: () => {},
    },
    GridProps: {
      required: false,
      type: Object as () => GridProps,
      default: () => {},
    },
  },
  setup(props) {
    const { getComponent } = useNaiveStore()
    const saveFormData = reactive<Record<string, any>>({})
    const { formProps, GridProps } = props

    const getNaiveUiItems: () => {
      item: NaiveUIComponents | HTMLElement
      props?: Record<string, any>
      itemGiProps?: Record<string, any>
      path?: string
      itemType: string
    }[] = () => {
      return props.formItems
        .map(({ itemType, props: itemProps, itemGiProps, path, ...other }) => {
          if (!itemType) return null

          if (itemType === 'render' && other.render) {
            return {
              itemType,
              item: other.render({
                ...(path ? { 'v-model:value': saveFormData[path] } : {}),
                ...(itemProps || {}),
              }),
              path,
            }
          }

          if (itemType === 'renderInGi' && other.render) {
            return {
              itemType,
              item: other.render({
                ...(path ? { 'v-model:value': saveFormData[path] } : {}),
                ...(itemProps || {}),
              }),
              itemGiProps: { path, ...itemGiProps },
              path,
            }
          }

          const item = getComponent(itemType as NaiveUIComponentsKeys)
          if (item) {
            try {
              return {
                itemType,
                item: item,
                props: {
                  ...(path ? { 'v-model:value': saveFormData[path] } : {}),
                  ...(itemProps || {}),
                },
                itemGiProps: { path, ...itemGiProps },
                path,
              }
            } catch (error) {
              console.error(`加载组件 ${itemType} 失败:`, error)
              return null
            }
          } else {
            return null
          }
        })
        .filter((item) => item !== null)
    }
    const loadedFormItems = computed(getNaiveUiItems)

    onMounted(getNaiveUiItems)

    return { loadedFormItems, saveFormData, formProps, GridProps }
  },
  render() {
    const { loadedFormItems, saveFormData, formProps, GridProps } = this

    return (
      <NForm v-model:value={saveFormData} {...(formProps as FormProps)}>
        <NGrid {...(GridProps as GridProps)}>
          {loadedFormItems.map(({ item, props, itemGiProps, itemType, ...other }, index) => {
            const Component = item as any
            if (itemType === 'render') {
              console.log('item', item)
              return <Component />
            }
            if (itemType === 'renderInGi') {
              return (
                <NFormItemGi span={24} {...itemGiProps}>
                  {item}
                </NFormItemGi>
              )
            }
            return (
              <NFormItemGi span={24} {...itemGiProps}>
                <Component key={index} {...props} />
              </NFormItemGi>
            )
          })}
        </NGrid>
      </NForm>
    )
  },
})
