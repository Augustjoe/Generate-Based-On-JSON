import {
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  reactive,
  toRaw,
  type Component,
} from 'vue'
import {
  NForm,
  NFormItemGi,
  NGrid,
} from 'naive-ui'
import { getNaiveComponent } from '@/utils/dynamicComponent'
import type { FormProps, RowProps, GridProps, FormInst } from 'naive-ui'
import { registerEditableSection } from '@/composables/useEditableRegistry'

type renderItem = {
  item?: Component | HTMLElement
  props?: Record<string, any>
  itemGiProps?: Record<string, any>
  path?: string
  itemType: string
  slots?: Record<string, () => any>
  render?: () => HTMLElement
}

export default defineComponent({
  name: 'Form',
  props: {
    isEdit: {
      type: Boolean,
      default: false,
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
    editable: {
      type: Boolean,
      default: true,
    },
    editableTitle: {
      type: String,
      default: '表单',
    },
  },
  emits: ['update:formItems', 'update:formProps'],
  setup(props, { expose, emit }) {
    const { GridProps, formData } = props
    const formItems = ref(props.formItems)
    const formProps = reactive(props.formProps || {})
    const nFormRef = ref<FormInst | null>(null)
    const instanceUid = String(getCurrentInstance()?.uid ?? Math.random())
    const unregisterList: Array<() => void> = []

      const getNaiveUiItems: (formItem: FormItem) => renderItem | null = (formItem: FormItem) => {
      const { itemType, props: itemProps, itemGiProps, path, slots, ...other } = formItem
      if (!itemType) return null

      const props = {
        ...(itemProps || {}),
        ...(path
          ? {
              'v-model:value': formData[path],
              value: formData[path],
              'onUpdate:value': (val: any) => {
                formData[path] = val
                itemProps['onUpdate:value']?.()
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

      let normalizedSlots: Record<string, () => any> | undefined = undefined
      if (slots) {
        normalizedSlots = {}
        for (const key in slots) {
          if (typeof slots[key] !== 'function') {
            const val = slots[key]
            normalizedSlots[key] = () => val
          } else {
            normalizedSlots[key] = slots[key]
          }
        }
      }

      const item = getNaiveComponent(itemType)
      if (item) {
        try {
          return {
            itemType,
            item,
            props,
            itemGiProps: { path, ...itemGiProps },
            path,
            slots: normalizedSlots,
          }
        } catch (error) {
          console.error(`加载组件 ${itemType} 失败:`, error)
          return null
        }
      } else {
        return null
      }
    }

    watch(
      () => props.formItems,
      (items) => {
        formItems.value = items
      },
      { immediate: true },
    )

    watch(
      () => props.formProps,
      (nextVal) => {
        Object.keys(formProps).forEach((key) => {
          delete formProps[key as keyof FormProps]
        })
        Object.assign(formProps, nextVal || {})
      },
      { deep: true },
    )

    onMounted(() => {
      if (!props.editable) return
      unregisterList.push(
        registerEditableSection({
          id: `form-items-${instanceUid}`,
          key: `formItems-${instanceUid}`,
          title: `${props.editableTitle}项配置 (formItems)`,
          order: 10,
          getValue: () => formItems.value,
          apply: (value) => {
            emit('update:formItems', value as FormItem[])
          },
        }),
      )
      unregisterList.push(
        registerEditableSection({
          id: `form-props-${instanceUid}`,
          key: `formProps-${instanceUid}`,
          title: `${props.editableTitle}属性配置 (formProps)`,
          order: 11,
          getValue: () => formProps,
          apply: (value) => {
            emit('update:formProps', value as FormProps)
          },
        }),
      )
    })

    onBeforeUnmount(() => {
      unregisterList.forEach((fn) => fn())
    })

    expose({
      validate: (...args: any[]) => nFormRef.value?.validate?.(...args),
      restoreValidation: () => nFormRef.value?.restoreValidation?.(),
      get form() {
        return nFormRef.value
      },
    })

    return () => (
      <NForm
        ref={nFormRef}
        model={formData}
        {...(formProps as FormProps)}
        inline={false}
        labelPlacement={(formProps as FormProps).labelPlacement ?? 'left'}
      >
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
            const { item, props, itemGiProps, itemType, slots, render, ...other } = NaiveUiItem
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
                  <Component {...props} v-slots={slots || undefined} />
                </NFormItemGi>
              )
            }
          })}
        </NGrid>
      </NForm>
    )
  },
})
