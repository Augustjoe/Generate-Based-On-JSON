import { defineComponent, ref, markRaw, onMounted, computed } from 'vue'
import { NMenu } from 'naive-ui'
import { useNaiveStore } from '@/stores/naiveUimodules'
import type { MenuProps, MenuOption } from 'naive-ui'

export default defineComponent({
  name: 'Menu',
  props: {
    MenuProps: {
      require: false,
      type: Object as () => MenuProps,
      default: () => ({}),
    },
    options: {
      require: true,
      type: Object as () => MenuOption[],
      default: () => [],
    },
  },
  setup(props) {
    const onUpdateValue = (key: string, item: MenuOption) => {
      console.log(item)
    }
    return { ...props, onUpdateValue }
  },
  render() {
    const { MenuProps, options, onUpdateValue } = this
    return <NMenu options={options} onUpdateValue={onUpdateValue} {...MenuProps} />
  },
})
