import {
  defineAsyncComponent,
  defineComponent,
  ref,
  markRaw,
  type PropType,
  type CSSProperties,
} from 'vue'
import { NButton, NIcon, NPopover } from 'naive-ui'
import type { ButtonProps, FormProps } from 'naive-ui'
import { SettingOutlined } from '@vicons/antd'
import { useAppDrawerStore } from '@/stores/appDrawerStore'

const FUNCTION_SLOT_PREFIX = '__function_slot__'
const CardCodeEditor = defineAsyncComponent(() => import('./CardCodeEditor'))

type EditableSlots = Record<string, (...args: any[]) => any>

function extractFunctions(input: any) {
  const slots: EditableSlots = {}
  let index = 0

  const clone = (value: any): any => {
    if (Array.isArray(value)) {
      return value.map(clone)
    }

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, entry]) => {
          if (typeof entry === 'function') {
            const slotKey = `${FUNCTION_SLOT_PREFIX}${++index}`
            slots[slotKey] = entry as (...args: any[]) => any
            return [key, slotKey]
          }

          return [key, clone(entry)]
        }),
      )
    }

    return value
  }

  return {
    data: clone(input),
    slots,
  }
}

function restoreFunctions(input: any, slots: EditableSlots): any {
  if (Array.isArray(input)) {
    return input.map((item) => restoreFunctions(item, slots))
  }

  if (input && typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, restoreFunctions(value, slots)]),
    )
  }

  if (typeof input === 'string') {
    if (input.startsWith(FUNCTION_SLOT_PREFIX)) {
      if (input in slots) {
        return slots[input]
      }

      throw new Error(`Unknown function slot: ${input}`)
    }

    if (/^\s*(function\b|\(?[\w\s,]*\)?\s*=>)/.test(input)) {
      throw new Error('Function source is not supported in JSON config.')
    }
  }

  return input
}

function createEditableConfig(input: { [key: string]: any } | { [key: string]: any }[]) {
  const { data, slots } = extractFunctions(input)

  return {
    code: JSON.stringify(data, null, 2),
    slots,
  }
}

function parseEditableConfig(input: string, slots: EditableSlots): any {
  return restoreFunctions(JSON.parse(input), slots)
}

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
                    autoFocus: false,
                    onUpdateShow(value: boolean) {
                      setDrawerProps({ show: value })
                    },
                  })

                  const editableConfig = createEditableConfig(
                    element || formItems.value || formProps.value,
                  )

                  setDrawSlots({
                    default: () =>
                      markRaw(
                        <CardCodeEditor
                          codeValue={editableConfig.code}
                          onUpdate:codeValue={(val: string) => {
                            try {
                              const obj = parseEditableConfig(val, editableConfig.slots)
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
