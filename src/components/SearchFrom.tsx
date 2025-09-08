import { defineComponent, ref, markRaw, onMounted, computed } from 'vue'
import { NCard, NForm, NButton, NGrid, NGi, NRow, NIcon, NFlex } from 'naive-ui'
import { useNaiveStore } from '@/stores/naiveUimodules'
import type { FormProps, RowProps, ButtonProps } from 'naive-ui'
import Draggable from 'vuedraggable'
import FormEditorButton from './FormEditorButton'
import { DisplaySettingsFilled } from '@vicons/material'
import { CalendarSettings16Regular } from '@vicons/fluent'
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
      type: Array as () => ButtonProps[],
      default: () => {},
    },
  },
  emits: ['update:formItems', 'update:formProps'],
  setup(props, { emit }) {
    const { formData } = props
    const formItems = ref(props.formItems)
    const formProps = ref(props.formProps)

    return () => (
      <NCard bordered={false} contentStyle={{ padding: '16px' }}>
        <NGrid cols="1 s:2 m:3 l:4 xl:5 2xl:5" responsive="screen">
          <NGi span="1 s:1 m:2 l:3 xl:4 2xl:4">
            <Form
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
              <NButton>查询</NButton>
              <NButton>重置</NButton>
              <NButton text>展开 </NButton>
            </NFlex>
          </NGi>
        </NGrid>
      </NCard>
    )
  },
})
