import { NForm, NGrid, NFormItemGi } from 'naive-ui'
import { defineComponent, ref, computed, onMounted, watch } from 'vue'

export default defineComponent({
  name: 'Form',
  props: {
    formItems: {
      require: false,
      default: [
        {
          itemType: '',
          props: {},
        },
      ],
    },
  },
  setup(props) {
    const formItems = ref<any[]>([])

    const getNaiveUiItem = async () => {
      const modules = import.meta.glob('/node_modules/naive-ui/es/input/index.d.ts', {
        eager: false,
      })

      props.formItems.map(async ({ itemType, ...other }) => {
        console.log(modules)
        let item = await modules['/node_modules/naive-ui/es/input/index.d.ts']()
        formItems.value.push({
          item,
          ...other,
        })
        console.log(formItems.value)
      })
    }

    watch(() => props.formItems, getNaiveUiItem)

    onMounted(getNaiveUiItem)

    return { formItems }
  },
  render() {
    const { formItems } = this

    return (
      <NForm>
        <NGrid>
          <NFormItemGi>
            {formItems.map(({ item, props }) => (
              <component is={item} {...props} />
            ))}
            <n-button> 112233</n-button>
          </NFormItemGi>
        </NGrid>
      </NForm>
    )
  },
})
