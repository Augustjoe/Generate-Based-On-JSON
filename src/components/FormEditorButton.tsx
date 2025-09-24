import { NButton, NIcon, NFlex, NPopover, popoverProps } from 'naive-ui'
import CardCodeEditor from './CardCodeEditor'
import { SettingOutlined } from '@vicons/antd'
import { useAppDrawerStore } from '@/stores/appDrawerStore'
import { CSSProperties } from 'vue'
import type { ButtonProps, FormProps } from 'naive-ui'

export const FormEditorButton = defineComponent({
  props: {
    formItems: {
      type: Array as PropType<FormItem[]>,
      required: false,
    },
    formProps: {
      type: Object as PropType<FormProps>,
      required: false,
      default: () => ({}) as FormProps,
    },
    element: {
      type: Object as () => FormItem,
      required: false,
    },
    style: {
      type: Object as () => CSSProperties,
      required: false,
      // default: () => ({}),
    },
    propoverTitle: {
      type: String,
      required: false,
      default: '配置',
    },
    buttonProps: {
      type: Object as () => ButtonProps,
      required: false,
      default: () => ({}),
    },
  },
  emits: ['update:formItems', 'update:formProps'],
  setup(props, { emit }) {
    const { setDrawerProps, setDrawSlots } = useAppDrawerStore()
    const { element } = props
    const formItems = ref(props.formItems)
    const formProps = ref(props.formProps)

    return () => (
      <div
        style={
          props.style || {
            bottom: '-25px',
            right: '2px',
            position: 'absolute',
          }
        }
      >
        <NPopover trigger="hover">
          {{
            trigger: () => (
              <NButton
                type="info"
                text
                render-icon={() => <NIcon component={<SettingOutlined></SettingOutlined>}></NIcon>}
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
                        <CardCodeEditor
                          codeValue={JSON.stringify(
                            element || formItems.value || formProps.value,
                            null,
                            2,
                          )}
                          onUpdate:codeValue={(val: string) => {
                            try {
                              const obj = JSON.parse(val)
                              if (formItems.value) {
                                if (element) {
                                  formItems.value.splice(
                                    formItems.value.findIndex((i) => i.path === element.path),
                                    1,
                                    obj,
                                  )
                                } else {
                                  formItems.value = obj
                                }
                                emit('update:formItems', formItems.value)
                              } else if (formProps.value) {
                                formProps.value = obj
                                emit('update:formProps', formProps.value)
                              }
                            } catch (error) {
                              console.log(val)
                              console.error('配置解析失败', error)
                            }
                          }}
                        />,
                      ),
                  })
                }}
                {...props.buttonProps}
              ></NButton>
            ),
            default: () => props.propoverTitle || '配置',
          }}
        </NPopover>
      </div>
    )
  },
})

export default FormEditorButton
