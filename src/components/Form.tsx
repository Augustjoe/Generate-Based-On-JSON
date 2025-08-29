import { defineComponent, ref, markRaw, onMounted, computed } from 'vue'
import {
  NCard,
  NForm,
  NFormItemCol,
  NGi,
  NRow,
  type NotificationApi,
  NButton,
  NIcon,
} from 'naive-ui'
import { useNaiveStore } from '@/stores/naiveUimodules'
import type { FormProps, RowProps } from 'naive-ui'
import Draggable from 'vuedraggable'
import { SettingOutlined } from '@vicons/antd'
import { useAppDrawerStore } from '@/stores/appDrawerStore'

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
    RowProps: {
      required: false,
      type: Object as () => RowProps,
      default: () => {},
    },
  },
  setup(props) {
    const { getComponent } = useNaiveStore()
    const { formProps, RowProps, formData } = props
    const formItems = ref(props.formItems)
    const { setDrawerProps, setDrawSlots } = useAppDrawerStore()

    const getNaiveUiItems: (formItem: FormItem) => renderItem | null = (formItem: FormItem) => {
      const { itemType, props: itemProps, itemGiProps, path, ...other } = formItem
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
      if (itemType === 'render' && other.render) {
        return {
          itemType,
          render: other.render,
          itemProps,
          path,
        }
      }

      if (itemType === 'renderInGi' && other.render) {
        return {
          itemType,
          render: other.render,
          itemGiProps: { path, ...itemGiProps },
          path,
        }
      }

      const item = getComponent(itemType as NaiveUIComponentsKeys)
      if (item) {
        try {
          return {
            itemType,
            item,
            props,
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
    }

    return () => (
      <NForm v-model:value={formData} inline {...(formProps as FormProps)}>
        <NRow {...(RowProps as RowProps)}>
          <Draggable v-model={formItems.value} item-key="path" style={{ width: '100%' }}>
            {{
              item: ({ element }: { element: FormItem }) => {
                const NaiveUiItem = getNaiveUiItems(element)
                if (!NaiveUiItem) return null
                const { item, props, itemGiProps, itemType, render, ...other } = NaiveUiItem
                if (itemType === 'render' && render) {
                  return (
                    <NFormItemCol span={24} key={other.path} {...itemGiProps}>
                      {render()}
                    </NFormItemCol>
                  )
                }
                if (itemType === 'renderInGi' && render) {
                  return (
                    <NFormItemCol span={24} key={other.path} {...itemGiProps}>
                      {render()}
                    </NFormItemCol>
                  )
                }

                if (item) {
                  const Component = toRaw(item) as any
                  return (
                    <NFormItemCol span={24} key={other.path} {...itemGiProps}>
                      <Component {...props} />
                      <NButton
                        style={{
                          bottom: '-20px',
                          right: '5px',
                          position: 'absolute',
                        }}
                        text
                        render-icon={() => (
                          <NIcon component={<SettingOutlined></SettingOutlined>}></NIcon>
                        )}
                        onClick={() => {
                          setDrawerProps({
                            show: true,
                            defaultWidth: '502',
                            resizable: true,
                            onUpdateShow(value: boolean) {
                              setDrawerProps({ show: value })
                            },
                          })
                          setDrawSlots({
                            default: () =>
                              markRaw(
                                <NCard title="表单配置" style={{ width: '100%' }}>
                                  <pre>{JSON.stringify(element, null, 2)}</pre>
                                </NCard>,
                              ),
                          })
                        }}
                      ></NButton>
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
