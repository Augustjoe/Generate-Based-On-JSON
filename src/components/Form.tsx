import { defineComponent, ref, markRaw, onMounted, computed } from 'vue'
import {
  NCard,
  NForm,
  NFormItemCol,
  NFormItemGi,
  NGrid,
  NGi,
  NRow,
  type NotificationApi,
  NButton,
  NIcon,
  NFlex,
} from 'naive-ui'
import { useNaiveStore } from '@/stores/naiveUimodules'
import type { FormProps, RowProps, GridProps } from 'naive-ui'
import Draggable from 'vuedraggable'
import FormEditorButton from './FormEditorButton'
import { DisplaySettingsFilled } from '@vicons/material'
import { CalendarSettings16Regular } from '@vicons/fluent'

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
    isEdit: {
      type: Boolean,
      default: true,
    },
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
    GridProps: {
      required: false,
      type: Object as () => GridProps,
      default: () => {},
    },
  },
  emits: ['update:formItems', 'update:formProps'],
  setup(props, { emit }) {
    const { getComponent } = useNaiveStore()
    const { RowProps, GridProps, formData, isEdit } = props
    const formItems = ref(props.formItems)
    const formProps = reactive(props.formProps)

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
      <NForm model={formData} {...(formProps as FormProps)} inline={false}>
        {isEdit && (
          <NFlex style={{ position: 'absolute', top: '5px', right: '5px', zIndex: 1 }}>
            <FormEditorButton
              style={{}}
              formItems={formItems.value}
              buttonProps={{
                renderIcon: () => <NIcon component={<DisplaySettingsFilled />}></NIcon>,
                type: 'success',
              }}
              onUpdate:formItems={(items: FormItem[]) => {
                formItems.value = items
                emit('update:formItems', items)
              }}
              propoverTitle="表单元素"
            ></FormEditorButton>
            <FormEditorButton
              style={{}}
              buttonProps={{
                renderIcon: () => <NIcon component={<CalendarSettings16Regular />}></NIcon>,
                type: 'info',
              }}
              formProps={formProps}
              onUpdate:formProps={(items: FormProps) => {
                Object.assign(formProps, items)
                console.log(formProps, 'formProps')
                // emit('update:formItems', items)
              }}
              propoverTitle="表单设置"
            ></FormEditorButton>
          </NFlex>
        )}

        {/* Draggable */}
        {/* <NRow {...(RowProps as RowProps)}>
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
                      {isEdit && (
                        <FormEditorButton
                          element={element}
                          formItems={formItems.value}
                          onUpdate:formItems={(items: FormItem[]) => {
                            formItems.value = items
                            emit('update:formItems', items)
                          }}
                        ></FormEditorButton>
                      )}
                    </NFormItemCol>
                  )
                }
              },
            }}
          </Draggable>
        </NRow> */}
        <NGrid cols={24} x-gap={8} {...GridProps}>
          {formItems.value.map((element: FormItem) => {
            const NaiveUiItem = getNaiveUiItems(element)
            if (!NaiveUiItem) return null
            const { item, props, itemGiProps, itemType, render, ...other } = NaiveUiItem
            if (itemType === 'render' && render) {
              return (
                <NFormItemGi span={24} key={other.path} {...itemGiProps}>
                  {render()}
                </NFormItemGi>
              )
            }
            if (itemType === 'renderInGi' && render) {
              return (
                <NFormItemGi span={24} key={other.path} {...itemGiProps}>
                  {render()}
                </NFormItemGi>
              )
            }

            if (item) {
              const Component = toRaw(item) as any
              return (
                <NFormItemGi span={24} key={other.path} {...itemGiProps}>
                  <Component {...props} />
                  {isEdit && (
                    <FormEditorButton
                      element={element}
                      formItems={formItems.value}
                      onUpdate:formItems={(items: FormItem[]) => {
                        formItems.value = items
                        emit('update:formItems', items)
                      }}
                    ></FormEditorButton>
                  )}
                </NFormItemGi>
              )
            }
          })}
        </NGrid>
      </NForm>
    )
  },
})
