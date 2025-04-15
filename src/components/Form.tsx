import { defineComponent, ref, markRaw, onMounted, computed } from 'vue'
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

type renderItem = {
  item?: NaiveUIComponents | HTMLElement
  props?: Record<string, any>
  itemGiProps?: Record<string, any>
  path?: string
  itemType: string
  render?: () => HTMLElement
}

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
    const getNaiveUiItems: () => renderItem[] = () => {
      return props.formItems
        .map(({ itemType, props: itemProps, itemGiProps, path, ...other }) => {
          if (!itemType) return null

          const props = {
            ...(itemProps || {}),
            ...(path
              ? {
                  'v-model:value': formData[path],
                  value: formData[path],
                  'onUpdate:value': (val: any) => {
                    formData[path] = val
                    itemProps['onUpdate:value'] && itemProps['onUpdate:value']()
                  },
                }
              : {}),
          }
          const item = getComponent(itemType as NaiveUIComponentsKeys)
          if (itemType === 'render' && other.render) {
            return {
              itemType,
              render: () => {
                return other.render(props)
              },
              itemProps,
              path,
            }
          }

          if (itemType === 'renderInGi' && other.render) {
            return {
              itemType,
              item: other.render(props),
              itemGiProps: { path, ...itemGiProps },
              path,
            }
          }

          if (item) {
            try {
              return {
                itemType,
                item: toRaw(item),
                props,
                itemGiProps: { path, ...itemGiProps },
                path,
              }
            } catch (error) {
              console.error(`加载组件 ${itemType} 失败:`, error)
              return null
            }
          } else {
            console.log(itemType, item)
            return null
          }
        })
        .filter((item) => item !== null)
    }

    const formItems = computed(getNaiveUiItems)

    const getFormData = () => props.formData

    return { formItems, formData, formProps, GridProps, getFormData }
  },
  render() {
    const { formItems, formData, formProps, GridProps } = this
    return (
      <NForm v-model:value={formData} inline {...(formProps as FormProps)}>
        <NGrid cols={24} {...(GridProps as GridProps)}>
          {formItems.map(({ item, props, itemGiProps, itemType, render, ...other }, index) => {
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
          })}
        </NGrid>
      </NForm>
    )
  },
})
