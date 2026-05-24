import { defineComponent, type PropType } from 'vue'
import { NMenu } from 'naive-ui'
import type { MenuProps, MenuOption } from 'naive-ui'

export default defineComponent({
  name: 'Menu',
  props: {
    MenuProps: {
      required: false,
      type: Object as PropType<MenuProps>,
      default: () => ({}),
    },
    options: {
      required: true,
      type: Array as PropType<MenuOption[]>,
      default: () => [],
    },
  },
  setup(props) {
    const onUpdateValue = () => {}
    return { onUpdateValue }
  },
  render() {
    const { MenuProps, options, onUpdateValue } = this
    return <NMenu options={options} onUpdateValue={onUpdateValue} {...MenuProps} />
  },
})

