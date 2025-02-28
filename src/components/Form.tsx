import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
import { NForm, NGrid, NFormItemGi, NGi, type NotificationApi } from 'naive-ui'
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
    formData: {
      required: false,
      type: Object as () => Record<any, any>,
      default: () => ({}),
    },
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
    const { formProps, GridProps, formData } = props

    const getNaiveUiItems: () => {
      item?: NaiveUIComponents | HTMLElement
      props?: Record<string, any>
      itemGiProps?: Record<string, any>
      path?: string
      itemType: string
      render?: () => HTMLElement
    }[] = () => {
      return props.formItems
        .map(({ itemType, props: itemProps, itemGiProps, path, ...other }) => {
          if (!itemType) return null

          if (itemType === 'render' && other.render) {
            return {
              itemType,
              render: () => {
                return other.render({
                  ...(path ? { 'v-model:value': formData[path] } : {}),
                  ...(itemProps || {}),
                })
              },
              itemProps,
              path,
            }
          }

          if (itemType === 'renderInGi' && other.render) {
            return {
              itemType,
              item: other.render({
                ...(path ? { 'v-model:value': formData[path] } : {}),
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
                  'v-model:value': formData[path],
                  ...(path ? { 'v-model:value': formData[path] } : {}),
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

    const getFormData = () => props.formData

    onMounted(getNaiveUiItems)

    return { loadedFormItems, formData, formProps, GridProps, getFormData }
  },
  render() {
    const { loadedFormItems, formData, formProps, GridProps } = this

    return (
      <NForm v-model:value={formData} inline {...(formProps as FormProps)}>
        <NGrid cols={24} {...(GridProps as GridProps)}>
          {loadedFormItems.map(
            ({ item, props, itemGiProps, itemType, render, ...other }, index) => {
              const Component = item as any
              if (itemType === 'render' && render) {
                return (
                  <NGi span={24} {...itemGiProps}>
                    {render()}
                  </NGi>
                )
              }
              if (itemType === 'renderInGi') {
                return (
                  <NFormItemGi span={24} {...itemGiProps}>
                    {item}
                  </NFormItemGi>
                )
              }
              if (Component) {
                return (
                  <NFormItemGi span={24} {...itemGiProps}>
                    <Component key={index} {...props} />
                  </NFormItemGi>
                )
              }
            },
          )}
        </NGrid>
      </NForm>
    )
  },
})
