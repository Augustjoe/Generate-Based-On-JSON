import { defineComponent, ref, watch } from 'vue'
import { NCard } from 'naive-ui'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'

export const CardCodeEditor = defineComponent({
  name: 'CardCodeEditor',
  props: {
    codeValue: {
      type: String,
      required: true,
    },
  },
  emits: ['update:codeValue'],
  setup(props, { emit }) {
    const code = ref(props.codeValue)

    watch(
      () => props.codeValue,
      (newVal) => {
        code.value = newVal
      },
    )

    const updateCode = (newCode: string) => {
      code.value = newCode
      emit('update:codeValue', newCode)
    }

    return () => (
      <NCard title={'组件代码'} style={{ height: '100%' }} contentStyle={{ height: '100%' }}>
        <Codemirror
          modelValue={code.value}
          onUpdate:modelValue={updateCode}
          extensions={[javascript()]}
          style={{ minHeight: '400px', height: '100%' }}
        />
      </NCard>
    )
  },
})

export default CardCodeEditor
