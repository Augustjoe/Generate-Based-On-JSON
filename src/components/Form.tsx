import { defineComponent, ref, markRaw, onMounted, computed } from 'vue'
import { NForm, NFormItemCol, NGi, NRow, type NotificationApi } from 'naive-ui'
import { useNaiveStore } from '@/stores/naiveUimodules'
import type { FormProps, GridProps } from 'naive-ui'
import Draggable from 'vuedraggable'

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
      required: true,
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
    const getNaiveUiItems: () => (renderItem | null)[] = () => {
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
        .filter((item) => item)
    }

    // const formItems = computed(getNaiveUiItems)
    const getFormData = () => props.formData

    const formItems = ref(getNaiveUiItems().filter((item) => item))

    const list = ref<{ name: string }[]>([{ name: 'Item 1' }, { name: 'Item 2' }])

    return { formItems, formData, formProps, GridProps, getFormData, list }
  },
  render() {
    const { formItems, formData, formProps, GridProps } = this
    console.log('Form render', formItems, formData, formProps, GridProps)
    return (
      <NForm v-model:value={formData} inline {...(formProps as FormProps)}>
        <NRow {...(GridProps as GridProps)}>
          <Draggable v-model={formItems} item-key="path" style={{ width: '100%' }}>
            {{
              item: ({ element }: { element: renderItem }) => {
                const { item, props, itemGiProps, itemType, render, ...other } = element
                console.log('Form item render')
                const Component = item as any
                if (itemType === 'render' && render) {
                  return (
                    <NGi span={24} key={other.path} {...itemGiProps}>
                      {render()}
                    </NGi>
                  )
                }
                if (itemType === 'renderInGi') {
                  return (
                    <NFormItemCol span={24} key={other.path} {...itemGiProps}>
                      {item}
                    </NFormItemCol>
                  )
                }
                if (Component) {
                  return (
                    <NFormItemCol span={24} key={other.path} {...itemGiProps}>
                      <Component {...props} />
                    </NFormItemCol>
                  )
                }
              },
            }}
          </Draggable>
        </NRow>
      </NForm>
    )
  },
})
