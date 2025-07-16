import { defineComponent, ref, nextTick } from 'vue'
import { NButton, NIcon, NInput } from 'naive-ui'
import { Search16Regular } from '@vicons/fluent'
import type { InputInst } from 'naive-ui'

export const SearchInput = defineComponent({
  name: 'SearchInput',
  props: {},
  emits: [''],
  setup() {
    const isShowInput = ref(false)
    const inputRef = ref<InputInst | null>(null) // 初始化为 null

    return () => (
      <>
        {isShowInput.value ? (
          <NInput
            ref={inputRef} // 绑定 ref
            round
            onBlur={() => (isShowInput.value = false)}
            placeholder="请输入"
            v-slots={{
              prefix: () => (
                <NIcon>
                  <Search16Regular />
                </NIcon>
              ),
            }}
          ></NInput>
        ) : (
          <NButton
            onClick={async () => {
              isShowInput.value = true
              await nextTick() // 等待 DOM 更新完成
              inputRef.value?.focus() // 然后调用 focus 方法
            }}
            text
          >
            {{
              icon: () => (
                <NIcon>
                  <Search16Regular />
                </NIcon>
              ),
            }}
          </NButton>
        )}
      </>
    )
  },
})

export default SearchInput
