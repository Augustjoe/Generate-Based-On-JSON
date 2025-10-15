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

    function convertFunctionsToStrings(input: any): any {
      // 如果是数组，递归处理每个元素
      if (Array.isArray(input)) {
        return input.map(convertFunctionsToStrings)
      }

      // 如果是对象，递归处理每个属性
      if (input && typeof input === 'object') {
        return Object.fromEntries(
          Object.entries(input).map(([key, value]) => [
            key,
            typeof value === 'function'
              ? value.toString().replace(/\n/g, '')
              : convertFunctionsToStrings(value),
          ]),
        )
      }

      // 其他类型直接返回
      return input
    }

    //  处理字符串 使其变成可读性更强的字符串
    function customStringify(input: { [key: string]: any } | { [key: string]: any }[]): string {
      return JSON.stringify(convertFunctionsToStrings(input), null, 2)
    }

    function parseCustomStringified(input: string): any {
      return JSON.parse(input, (key, value) => {
        if (
          typeof value === 'string' &&
          (value.startsWith('function') || value.startsWith('() =>'))
        ) {
          try {
            return eval(value)
          } catch (e) {
            console.error('无法还原函数:', e)
          }
        }
        return value
      })
    }

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
                    autoFocus: false,
                    onUpdateShow(value: boolean) {
                      setDrawerProps({ show: value })
                    },
                  })
                  setDrawSlots({
                    default: () =>
                      markRaw(
                        <CardCodeEditor
                          codeValue={customStringify(element || formItems.value || formProps.value)}
                          onUpdate:codeValue={(val: string) => {
                            try {
                              const obj = parseCustomStringified(val)
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
