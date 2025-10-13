import { defineComponent, ref, markRaw, onMounted, computed } from 'vue'
import { NCard, NForm, NButton, NGrid, NGi, NRow, NIcon, NFlex } from 'naive-ui'
import type { FormProps, RowProps, ButtonProps } from 'naive-ui'
import FormEditorButton from './FormEditorButton'
import { EditSettings24Regular } from '@vicons/fluent'

import Form from './Form'

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
    ButtonItems: {
      required: false,
      type: Array as () => searchButtonItem,
      default: () => [],
    },
  },
  emits: ['update:formItems', 'update:formProps', 'update:ButtonItems'],
  setup(props, { emit }) {
    const { formData } = props
    const formItems = ref(props.formItems)
    const formProps = ref(props.formProps)
    const ButtonItems = ref(props.ButtonItems)
    const isHidden = ref(true)
    const formRef = ref()
    const formNGiRef = ref()
    const hiddenStyle = reactive({
      height: '58px',
    })
    const notHiddenStyle = reactive({
      height: '116px',
    })

    onMounted(() => {
      // 计算高度从而设计动画
      const el = formRef.value?.$el as HTMLElement | undefined
      const height = el?.getBoundingClientRect().height

      const formNGiRefEl = formNGiRef.value?.$el as HTMLElement | undefined
      const NGheight = formNGiRefEl?.getBoundingClientRect().height
      if (el && height) {
        notHiddenStyle.height = height + 'px'
      }
      if (formNGiRefEl && NGheight) {
        hiddenStyle.height = NGheight + 'px'
      }
    })

    return () => (
      <NCard bordered={false} contentStyle={{ padding: '16px' }}>
        <NGrid cols="1 s:2 m:3 l:4 xl:5 2xl:5" responsive="screen">
          <NGi
            ref={formNGiRef}
            style={{
              ...(isHidden.value ? hiddenStyle : notHiddenStyle),
              transition: 'height 0.2s ease-out',
              overflow: 'hidden',
            }}
            span="1 s:1 m:2 l:3 xl:4 2xl:4"
          >
            <Form
              isEdit={props.isEdit}
              ref={formRef}
              formData={formData}
              formItems={formItems.value}
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
          </NGi>
          <NGi span="1">
            <NFlex style={{ height: '100%' }} justify="center" align="center">
              {ButtonItems.value.map((item) => {
                if (item.type === 'expand') {
                  return (
                    <NButton
                      text
                      onClick={() => {
                        isHidden.value = !isHidden.value
                      }}
                    >
                      {isHidden.value ? '展开' : '收起'}
                    </NButton>
                  )
                } else {
                  return <NButton {...item}>{item.buttonText}</NButton>
                }
              })}
              {props.isEdit && (
                <FormEditorButton
                  style={{}}
                  formItems={ButtonItems.value}
                  buttonProps={{
                    renderIcon: () => <NIcon component={<EditSettings24Regular />}></NIcon>,
                    type: 'info',
                  }}
                  onUpdate:formItems={(items: searchButtonItem) => {
                    ButtonItems.value = items
                    emit('update:ButtonItems', ButtonItems.value)
                  }}
                  propoverTitle="按钮配置"
                ></FormEditorButton>
              )}
            </NFlex>
          </NGi>
        </NGrid>
      </NCard>
    )
  },
})
