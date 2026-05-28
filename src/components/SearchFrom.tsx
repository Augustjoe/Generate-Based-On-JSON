import { computed, defineComponent, ref, onMounted, reactive, toRef, nextTick, watch, getCurrentInstance, onBeforeUnmount } from 'vue'
import { NCard, NButton, NIcon, NFlex } from 'naive-ui'
import type { FormProps, RowProps } from 'naive-ui'
import { ChevronDown, ChevronUp } from '@vicons/ionicons5'
import { renderIconFromString } from '@/utils/iconMap'
import { registerEditableSection } from '@/composables/useEditableRegistry'

import Form from './Form'

export default defineComponent({
  name: 'SearchFrom',
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
      default: () => ({}),
    },
    RowProps: {
      required: false,
      type: Object as () => RowProps,
      default: () => ({}),
    },
    ButtonItems: {
      required: false,
      type: Array as () => searchButtonItem,
      default: () => [],
    },
  },
  emits: ['update:formItems', 'update:formProps', 'update:ButtonItems', 'action'],
  setup(props, { emit }) {
    const { formData } = props
    const formItems = ref(props.formItems)
    const formProps = ref(props.formProps)
    const ButtonItems = ref(props.ButtonItems)
    const isHidden = ref(true)
    const showExpandButton = ref(false)
    const formRef = ref()
    const formAreaRef = ref<HTMLElement | null>(null)
    const displayFormItems = computed(() =>
      formItems.value.map((item) => ({
        ...item,
        itemGiProps: {
          ...(item.itemGiProps || {}),
          showFeedback: item.itemGiProps?.showFeedback ?? false,
        },
      })),
    )
    const collapsedStyle = reactive({
      height: '40px',
    })
    const expandedStyle = reactive({
      height: 'auto',
    })
    const isEdit = toRef(props, 'isEdit')
    const instanceUid = String(getCurrentInstance()?.uid ?? Math.random())
    const unregisterList: Array<() => void> = []

    const refreshExpandState = () => {
      const el = formRef.value?.$el as HTMLElement | undefined
      const height = el?.getBoundingClientRect().height || 0
      const firstItem = el?.querySelector('.n-form-item') as HTMLElement | null
      const rowHeight = firstItem?.getBoundingClientRect().height || 0

      if (rowHeight) {
        collapsedStyle.height = `${rowHeight}px`
      }
      if (height) {
        expandedStyle.height = `${height}px`
      }

      showExpandButton.value = Boolean(height && rowHeight && height - rowHeight > 8)
      if (!showExpandButton.value) {
        isHidden.value = false
      }
    }

    onMounted(async () => {
      await nextTick()
      refreshExpandState()
      unregisterList.push(
        registerEditableSection({
          id: `search-form-items-${instanceUid}`,
          key: `searchFormItems-${instanceUid}`,
          title: '搜索表单项 (formItems)',
          order: 20,
          getValue: () => formItems.value,
          apply: (value) => {
            emit('update:formItems', value as FormItem[])
          },
        }),
      )
      unregisterList.push(
        registerEditableSection({
          id: `search-form-props-${instanceUid}`,
          key: `searchFormProps-${instanceUid}`,
          title: '搜索表单属性 (formProps)',
          order: 21,
          getValue: () => formProps.value,
          apply: (value) => {
            emit('update:formProps', value as FormProps)
          },
        }),
      )
      unregisterList.push(
        registerEditableSection({
          id: `search-button-items-${instanceUid}`,
          key: `searchButtonItems-${instanceUid}`,
          title: '搜索按钮 (formButtonItems)',
          order: 22,
          getValue: () => ButtonItems.value,
          apply: (value) => {
            emit('update:ButtonItems', value as searchButtonItem)
          },
        }),
      )
    })

    onBeforeUnmount(() => {
      unregisterList.forEach((fn) => fn())
    })

    watch(
      () => [props.formItems, props.formProps],
      async () => {
        formItems.value = props.formItems
        formProps.value = props.formProps
        await nextTick()
        refreshExpandState()
      },
      { deep: true },
    )

    return () => (
      <NCard bordered={false} contentStyle={{ padding: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            width: '100%',
          }}
        >
          <div
            ref={formAreaRef}
            style={{
              flex: '1 1 auto',
              minWidth: 0,
              ...(isHidden.value ? collapsedStyle : expandedStyle),
              transition: 'height 0.2s ease-out',
              overflow: 'hidden',
            }}
          >
            <Form
              isEdit={isEdit.value}
              editable={false}
              ref={formRef}
              formData={formData}
              formItems={displayFormItems.value}
              formProps={formProps.value}
              onUpdate:formItems={(val: FormItem[]) => {
                formItems.value = val
                emit('update:formItems', val)
              }}
              onUpdate:formProps={(val: FormProps) => {
                formProps.value = val
                emit('update:formProps', val)
              }}
            ></Form>
          </div>
          <NFlex
            size={8}
            style={{
              flex: '0 0 auto',
              minHeight: isHidden.value ? collapsedStyle.height : '34px',
            }}
            justify="end"
            align="center"
          >
            {ButtonItems.value.map((item) => {
              if (item.type === 'expand') {
                if (!showExpandButton.value) return null
                return (
                  <NButton
                    text
                    type="primary"
                    renderIcon={() => (
                      <NIcon component={isHidden.value ? ChevronDown : ChevronUp}></NIcon>
                    )}
                    style={{ height: '34px', marginLeft: '2px' }}
                    onClick={() => {
                      isHidden.value = !isHidden.value
                    }}
                  >
                    {isHidden.value ? '展开' : '收起'}
                  </NButton>
                )
              }

              const { icon, actionType, onClick, ...btnProps } = item
              const finalRenderIcon = icon ? renderIconFromString(icon) : btnProps.renderIcon
              const handleClick = (e: MouseEvent) => {
                if (onClick) {
                  if (Array.isArray(onClick)) {
                    onClick.forEach((fn: any) => fn(e))
                  } else {
                    ;(onClick as any)(e)
                  }
                }
                if (actionType) emit('action', actionType, formData)
              }
              return (
                <NButton {...btnProps} renderIcon={finalRenderIcon} onClick={handleClick}>
                  {item.buttonText}
                </NButton>
              )
            })}
          </NFlex>
        </div>
      </NCard>
    )
  },
})
