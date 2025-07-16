import { NTooltip, NButton, TooltipProps, ButtonProps } from 'naive-ui'
import { PropType, VNode, useSlots, defineComponent } from 'vue'

export const TooltipButton = defineComponent({
  name: 'TooltipButton',
  props: {
    tooltipProps: {
      type: Object as PropType<TooltipProps & Record<any, any>>,
      required: false,
      default: () => ({}),
    },
    buttonProps: {
      type: Object as PropType<ButtonProps & { icon?: VNode } & Record<any, any>>,
      required: true,
    },
    tooltipSlots: {
      type: Object as PropType<Record<string, () => VNode>>,
      required: false,
      default: () => ({}),
    },
    buttonSlots: {
      type: Object as PropType<Record<string, () => VNode>>,
      required: false,
      default: () => ({}),
    },
  },
  setup(props) {
    const slots = useSlots()
    return () => (
      <NTooltip trigger="hover" placement="bottom" {...props.tooltipProps}>
        {{
          trigger: () => (
            <NButton
              text
              {...props.buttonProps}
              v-slots={{ icon: () => props.buttonProps.icon, ...props.buttonSlots }}
            />
          ),
          default: () => (slots.default ? slots.default() : null),
          ...props.tooltipSlots,
        }}
      </NTooltip>
    )
  },
})

export default TooltipButton
